# Macrotrue — System Architecture Breakdown

---

## 1. End-to-End System Flow

**User Input → Backend → LLM → Response**

```
Browser (React 19)
  │
  ├── /Food page mounts
  │     ├── MealData.tsx → GET /api/meal-recommendations?calories={goal}
  │     └── PantryChat.tsx → POST /api/chat { messages[], calorieGoal }
  │
  ├── Next.js App Router (Edge Middleware)
  │     └── Clerk middleware validates session token before route hits handler
  │
  ├── API Route Handler (Node.js serverless on Vercel)
  │     ├── Auth check: auth() from @clerk/nextjs/server
  │     ├── Rate limit check: in-memory IP map (10 req/min)
  │     ├── DB check: Neon PostgreSQL via Drizzle ORM
  │     │     └── Read user's subscription.chat_count / refresh_count
  │     ├── Prompt construction (system + user prompt injected with calorie data)
  │     └── Groq API call → llama-3.3-70b-versatile
  │
  └── Response

        └── Returned to component for display
```

**Where data is stored:**
- User identity → Clerk (external IdP)
- Calorie goals → `user_goals` table (PostgreSQL, keyed by `clerk_id`)
- Usage counters → `subscriptions` table (`chat_count`, `refresh_count`)
- Workout history → `workouts` table (exercises stored as JSONB)

**LLM is called in two places:**
- `GET /api/meal-recommendations` — single-shot structured JSON generation
- `POST /api/chat` — multi-turn conversational assistant

---

## 2. Backend AI Pipeline

### Prompt Construction

**Meal Recommendations (`/api/meal-recommendations`):**

The route dynamically calculates macro targets server-side before building the prompt:
```
Protein  = (calories × 0.30) / 4 g
Carbs    = (calories × 0.40) / 4 g
Fats     = (calories × 0.30) / 9 g

Breakfast = 25% | Lunch = 35% | Dinner = 40%
```

The user prompt is then assembled with exact numeric targets injected before the Groq call. The system prompt instructs the model to act as a "professional nutritionist and home chef" and enforces:
- Variety constraint (no repeated protein sources across lunch/dinner)
- Specific portion quantities (grams, ounces, cups)
- **JSON-only output** — no markdown allowed

**Chat (`/api/chat`):**

A static system prompt with one runtime injection:
```
{{CALORIE_GOAL}} → replaced with user's saved goal from DB
```
The last 6 messages of conversation history are forwarded as context to maintain coherent multi-turn dialogue.

### Schema Validation / Output Formatting

For meal recommendations, a `validateResponse()` function runs post-parse to confirm all required fields are present (`breakfast`, `lunch`, `dinner`, nested `name`, `portions`, `macros`). If validation fails, the route returns a 500 before the client ever sees malformed data.

JSON is extracted using a regex that strips markdown code fences in case the model wraps output despite instructions:
```ts
const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
```

### Error Handling

- All API routes are wrapped in `try/catch`
- Groq failures return `500` with a user-friendly message
- DB failures on usage-tracking are caught separately so they don't block the LLM response
- Frontend components display error states and offer retry UI

### Determinism Controls

| Setting | Chat | Meal Recs |
|---|---|---|
| Temperature | 0.7 | 0.85 |
| Max Tokens | 1024 | 1024 |
| Output constraint | Markdown | **JSON only** |
| Context window | Last 6 messages | Stateless (single-shot) |

Temperature is kept below 1.0 to reduce hallucination on numeric macro values. The JSON-only constraint on meal recs is the primary guardrail for deterministic structure.

### Rate Limiting

In-memory IP-keyed map with a 60-second rolling window, capped at 10 requests/minute. This resets on cold start — a known limitation acknowledged for production scaling.

---

## 3. Data Layer

**Database:** Neon PostgreSQL (serverless, HTTP-mode driver)
**ORM:** Drizzle ORM (type-safe, schema-first)
**Connection:** `drizzle-orm/neon-http` — uses HTTPS requests instead of a persistent TCP pool, ideal for serverless

### Schema

```sql
users           -- clerk_id, email, name, timestamps
user_goals      -- clerk_id (unique), calorie_goal
subscriptions   -- clerk_id (unique), plan, status, refresh_count, chat_count
workouts        -- clerk_id, workout_type, exercises (JSONB), created_at
```

**Key design decisions:**
- `clerk_id` is the foreign key across all tables — no internal user ID joins required
- Workout `exercises` are stored as **JSONB** for schema flexibility (variable sets/reps per exercise)
- Calorie goals live in a dedicated table with `upsert` semantics — one row per user
- Usage counters (`chat_count`, `refresh_count`) are incremented per request and checked against plan limits

**Meal plans are NOT persisted** — they are generated fresh on every request. There is no meal plan cache layer.

---

## 4. API Layer

### Endpoints

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/meal-recommendations` | GET | Clerk JWT | Generate AI meal plan |
| `/api/chat` | GET | Clerk JWT | Fetch usage stats |
| `/api/chat` | POST | Clerk JWT | Send chat message to AI |
| `/api/goals` | GET | Clerk JWT | Read calorie goal |
| `/api/goals` | POST | Clerk JWT | Set/update calorie goal |
| `/api/workouts` | GET | Clerk JWT | Fetch workout history |
| `/api/workouts` | POST | Clerk JWT | Save a workout |
| `/api/checkout` | POST | Clerk JWT | Create Stripe session |

### Request/Response Lifecycle

```
Request arrives at Next.js Edge
  → Clerk middleware validates session (JWT check)
  → Route handler: auth() extracts clerk_id
  → Input validation (query params / body fields)
  → Rate limit check (IP-based, in-memory)
  → Subscription check (DB read for plan + usage)
  → Business logic (DB reads/writes + Groq call)
  → Validated JSON response
```

### Middleware

Defined in `src/middleware.ts` using Clerk's `clerkMiddleware()`:
- Enforces authentication session on all non-static routes
- Injects **Content Security Policy headers** to allow Clerk's OAuth iframe and JS bundles
- Matcher excludes `_next`, static assets, and media files

---

## 5. LLM Workflow

### Pipeline Classification

This is a **prompt-based pipeline**, not RAG. There is no retrieval step, vector database, or document embedding. All context is constructed deterministically at request time:

```
User goal (DB) + Macro math (server) → Injected into prompt → Groq → Parsed response
```

This is a clean **few-shot / zero-shot prompt engineering** approach where structure is enforced via instruction rather than schema tooling.

### Structured Output

Groq is called via the raw OpenAI-compatible REST API (`fetch` to `api.groq.com/openai/v1/chat/completions`). There is **no function calling or tool use** — structure is enforced through:
1. Prompt instruction: "Return ONLY valid JSON"
2. Server-side regex extraction of JSON block
3. Post-parse `validateResponse()` type check

### Guardrails

| Guardrail | Implementation |
|---|---|
| Output format | JSON-only instruction in system prompt |
| Calorie accuracy | Macro targets pre-calculated and passed as hard numbers |
| Variety | "Do NOT repeat protein source" instruction |
| Usage limits | DB counter checked before LLM call |
| Rate limiting | IP-keyed in-memory window |
| Auth | Every route gated behind Clerk JWT |

No LLM observability tooling (no LangSmith, Helicone, etc.) is currently integrated.

---

## 6. Deployment + Infra

| Layer | Technology |
|---|---|
| Hosting | **Vercel** (inferred from Next.js 15 + Neon + Clerk stack) |
| Runtime | **Node.js serverless functions** (Next.js App Router API routes) |
| Database | **Neon PostgreSQL** (serverless, scales to zero) |
| Auth | **Clerk** (hosted identity provider) |
| LLM | **Groq Cloud API** (external, llama-3.3-70b-versatile) |
| Payments | **Stripe** (hosted checkout) |
| CDN | Vercel Edge Network (static assets + pages) |

Every API route (`/api/*`) compiles to an isolated **serverless function**. Cold starts are mitigated by Neon's HTTP-mode driver (no connection pooling overhead) and Clerk's lightweight JWT verification.

---

## 7. Scaling Considerations

### Current Bottlenecks Under Load

| Bottleneck | Why | Fix |
|---|---|---|
| In-memory rate limiter | Resets on cold start, not shared across instances | Replace with **Redis** (Upstash or ElastiCache) |
| No meal plan caching | Every request hits Groq (latency + cost) | Cache responses in S3 or Redis by `(calories, preferences)` hash |
| Neon HTTP driver | Per-request connection overhead | Use Neon connection pooling (PgBouncer) for high throughput |
| Single Groq model | No fallback if Groq is down | Add secondary LLM provider (OpenAI or Bedrock) with retry logic |
| No webhook for Stripe | Subscription state may be stale | Implement `/api/webhook/stripe` to sync plan updates to DB |

### AWS Productionization Path

```
API Gateway
  └── Lambda (per route: /chat, /meals, /workouts, /goals)
        ├── ElastiCache (Redis) — rate limiting + response caching
        ├── RDS Aurora PostgreSQL (or keep Neon) — user data
        ├── S3 — cached meal plan JSON by (calorie, preference) hash key
        └── Secrets Manager — API keys (Groq, Stripe, Clerk)

Bedrock or Groq — LLM inference
Cognito or Clerk — Auth (Clerk works on Lambda)
CloudFront — CDN for static Next.js assets
SQS — Async meal generation queue for high load
```

---

## A. 30-Second Explanation

> Macrotrue is a full-stack AI nutrition SaaS built on **Next.js 15** with a **Neon PostgreSQL** backend and **Clerk** for authentication. Users input their calorie and macronutrient goals, which are stored in the database and injected into prompts sent to **Groq's Llama 3.3-70B model**. The LLM generates structured meal plans as JSON, which is validated server-side before being returned to the React frontend. A freemium model enforced by **Stripe** gates usage — free users get 5 daily AI interactions before being prompted to upgrade.

---

## B. 60-Second Explanation

> Macrotrue is a full-stack AI-powered nutrition platform. On the frontend, users interact with two AI features: a meal recommendation engine and an interactive pantry chef chatbot — both built in React and served through Next.js App Router.
>
> On the backend, each API route is a serverless function. When a user requests a meal plan, the server reads their calorie goal from PostgreSQL, calculates macro splits server-side (30% protein, 40% carbs, 30% fat), then constructs a structured prompt and calls Groq's Llama 3.3-70B model. The response is expected as raw JSON — the server validates its structure before returning it to the client.
>
> Authentication is handled entirely by Clerk, with JWT tokens verified at the middleware layer before any route logic runs. Usage tracking — how many AI calls a user has made today — is stored in a subscriptions table and checked before every LLM call, enforcing a tiered freemium model backed by Stripe.
>
> The main scaling considerations I'd address in production are: replacing the in-memory rate limiter with Redis, caching meal plan responses in S3 by calorie target, and adding a Stripe webhook endpoint to keep subscription state synchronized.

---

## C. Interview Bullet Points

### System Design
- Next.js 15 App Router — each `/api/*` path is an isolated serverless function deployed to Vercel
- Neon PostgreSQL with Drizzle ORM — serverless-native HTTP driver avoids connection pool exhaustion
- All tables keyed by `clerk_id` from Clerk's identity system — no internal user join overhead
- Workout data stored as JSONB for schema flexibility (variable exercises, sets, reps)
- Meal plans are stateless — generated fresh each request, not persisted (trade-off: latency vs storage)
- In-memory rate limiting is a known limitation — production path is Redis (Upstash or ElastiCache)

### LLM Integration
- Prompt-based pipeline (not RAG) — context assembled deterministically at request time from user DB data
- Groq Cloud API with `llama-3.3-70b-versatile` — chosen for speed and cost efficiency
- Two LLM surfaces: single-shot structured JSON (meal plans) and multi-turn conversational (chat)
- Macro math is calculated server-side before injection — LLM never derives targets from scratch
- JSON structure enforced via prompt instruction + server-side regex extraction + `validateResponse()` type guard
- Temperature: 0.7 for chat (coherent), 0.85 for meals (creative variety)
- Last 6 messages of conversation history passed as context for multi-turn coherence

### AI Architecture Trade-offs
- No LLM function calling/tool use — pure text constraint; simpler but less reliable at scale
- No vector DB or RAG — appropriate for this use case since all context fits in prompt
- No LLM observability layer yet (LangSmith, Helicone) — would add in production for cost tracking
- No fallback LLM provider — single point of failure on Groq; would add OpenAI/Bedrock fallback

### Productionization / AWS Path
- Rate limiting → Redis (ElastiCache or Upstash)
- Meal plan caching → S3 keyed by `hash(calories + preferences)` with TTL
- Async generation under load → SQS queue + Lambda consumer
- Secrets → AWS Secrets Manager
- LLM fallback → Bedrock as secondary provider with exponential backoff retry
- Stripe webhook → `/api/webhook/stripe` Lambda to sync subscription state
