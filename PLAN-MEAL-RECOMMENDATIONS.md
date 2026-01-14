# AI-Powered Meal Recommendations Plan

This document outlines the plan for implementing AI-powered meal recommendations on the `/Food` page of Macrotrue.

## Current State Analysis

The `/Food` page currently:
- Uses static meals from `/public/data/meals.json` (15 total meals - 5 breakfast, 5 lunch, 5 dinner)
- Picks random meals from this static list
- Scales portions to hit target calories (mathematical scaling only)
- Shows macros (calories, protein, carbs, fat) for each meal
- Has a refresh button to get new random meals (max 5 refreshes)
- Uses `localStorage` for refresh count tracking

**Problem**: Static meals don't actually add up to the user's daily calorie goal naturally—they're just scaled versions of the same recipes, which can lead to unrealistic portion sizes.

## Goal

Generate 3 meals (breakfast, lunch, dinner) that:
1. **Actually sum to the user's daily calorie goal** (not just scaled versions)
2. **Meet macro targets** (high protein focus)
3. **Are varied** (refresh gives completely different meals)
4. **Include real food portions** (not just scaled ingredients)

## Option Analysis

### Option 1: LLM API (Gemini/Grok/Groq)

**Free Tier Availability (2025)**:
- **Google Gemini 1.5 Flash**: 10 RPM, 250,000 TPM, 1,500 RPD (requests per day)
- **Groq**: Generous free tier - 14,400 requests/day, 500,000 tokens/day
- **OpenRouter Free**: 50 requests/day (or 1000/day with credits purchased)

**Pros**:
- Endless variety - never runs out of meal ideas
- Can optimize for exact calorie/macro targets
- Natural language understanding for preferences
- Can provide cooking instructions
- Free tier limits are generous enough for MVP

**Cons**:
- API reliability depends on external service
- Latency (500ms-2s per request)
- Cost adds up if you exceed free tier
- Requires prompt engineering for consistent output
- Risk of hallucination (wrong calorie counts)

**Technical Implementation**:
```javascript
// Example prompt structure
const prompt = `Generate 3 meals for a daily calorie target of ${calories} calories.
Breakdown:
- Breakfast: ~${calories/4} calories
- Lunch: ~${calories/3} calories  
- Dinner: ~${calories/3} calories

Each meal must have:
- name: string
- portions: string (ingredients with amounts)
- macros: { calories: number, protein: number, carbs: number, fat: number }

Return valid JSON only.`;
```

### Option 2: Food Database API (Edamam, Nutritionix, USDA)

**Free Tier**:
- **Edamam**: 10 requests/day free
- **Nutritionix**: 10 requests/day free
- **USDA FoodData Central**: Free but complex API

**Pros**:
- Accurate nutritional data (verified)
- Large food database
- No hallucination risk

**Cons**:
- Very low free tier limits (10 requests/day)
- Need to build meal combination algorithm yourself
- Returns individual foods, not complete meals
- Complex to optimize for calorie/macro targets

**Technical Challenge**: You'd need to build a Knapsack-style algorithm to find food combinations that sum to target calories.

### Option 3: Hybrid Approach (Small Static DB + LLM)

**Concept**: Maintain a database of 50-100 base recipes with verified macros, then use LLM to:
- Combine recipes intelligently
- Adjust portions
- Add variety

**Pros**:
- Base recipes are accurate (verified)
- LLM adds variety
- Faster responses (partial results from DB)

**Cons**:
- More complex implementation
- Still depends on LLM for final output
- Database maintenance overhead

### Option 4: Client-Side Meal Generator (No API)

**Concept**: Build a mathematical meal generator using:
- Pre-defined ingredient macros
- Template-based meal structures
- Randomization within constraints

**Pros**:
- No API costs
- Instant responses
- 100% reliable

**Cons**:
- Limited variety (still "static" feeling)
- Less realistic meals
- Complex to tune for macro targets

## Recommendation

**Use Groq API with a well-engineered prompt** (Option 1)

**Why Groq over Gemini?**
- Much higher free tier (14,400 requests/day vs 1,500 for Gemini)
- Faster inference (ideal for real-time UX)
- Excellent Next.js integration available
- Consistent pricing if you exceed free tier

## Implementation Plan

### Phase 1: API Setup
1. Create Groq account and get API key
2. Add `GROQ_API_KEY` to `.env.local`
3. Create new API route: `/api/meal-recommendations`
4. Implement LLM call with structured output

### Phase 2: Prompt Engineering
1. Design prompt for consistent JSON output
2. Add temperature control (0.7 for variety)
3. Include macro targets in prompt
4. Test output accuracy

### Phase 3: Frontend Integration
1. Update `MealData.tsx` to fetch from `/api/meal-recommendations`
2. Remove static meal data dependency
3. Add loading state for AI generation
4. Implement refresh button (new AI request)

### Phase 4: Fallback & Error Handling
1. Fallback to static meals if LLM fails
2. Rate limit handling
3. Timeout handling
4. Retry logic

### Phase 5: Optimization
1. Add caching (redis or in-memory) for same-day requests
2. Prompt caching if available
3. Compress prompts for token efficiency

## Technical Specifications

### New API Route: `/api/meal-recommendations`

**GET Parameters**:
- `calories` (required): Daily calorie target
- `preferences` (optional): Dietary restrictions (vegetarian, etc.)
- `refreshId` (optional): For caching

**Response**:
```json
{
  "breakfast": {
    "name": "Protein Oatmeal Bowl",
    "portions": "1 cup cooked oats (80g dry), 1 scoop vanilla protein powder (30g), 1/2 banana (50g), 1 tbsp chia seeds (12g)",
    "macros": { "calories": 420, "protein": 32, "carbs": 52, "fat": 10 }
  },
  "lunch": {
    "name": "Grilled Chicken Salad",
    "portions": "6 oz grilled chicken breast (170g), 2 cups mixed greens (60g), 1 cup cherry tomatoes (150g), 2 tbsp olive oil dressing (30ml)",
    "macros": { "calories": 480, "protein": 45, "carbs": 18, "fat": 26 }
  },
  "dinner": {
    "name": "Salmon with Sweet Potato",
    "portions": "6 oz salmon fillet (170g), 1 medium sweet potato (150g), 1 cup steamed broccoli (150g), 1 tbsp butter (14g)",
    "macros": { "calories": 520, "protein": 40, "carbs": 45, "fat": 22 }
  },
  "total": { "calories": 1420, "protein": 117, "carbs": 115, "fat": 58 }
}
```

### Prompt Template

```
You are a professional nutritionist. Generate 3 meals that sum exactly to {calories} calories per day.

MACRO TARGETS:
- Protein: {protein}g (high protein is priority)
- Carbs: {carbs}g
- Fat: {fat}g
- Total: {calories} calories

MEAL BREAKDOWN:
- Breakfast: {breakfastCalories} calories (25% of daily)
- Lunch: {lunchCalories} calories (35% of daily)
- Dinner: {dinnerCalories} calories (40% of daily)

REQUIREMENTS:
1. Each meal must have realistic portions with specific amounts
2. Include protein source in every meal
3. Use common, affordable ingredients
4. Provide accurate macro calculations
5. Return ONLY valid JSON (no markdown, no comments)

JSON FORMAT:
{
  "breakfast": {
    "name": "Meal name",
    "portions": "Ingredient 1 (amount), Ingredient 2 (amount), ...",
    "macros": { "calories": number, "protein": number, "carbs": number, "fat": number }
  },
  "lunch": { ... },
  "dinner": { ... },
  "total": { "calories": number, "protein": number, "carbs": number, "fat": number }
}
```

## Estimated Costs (if exceeding free tier)

**Groq Pricing** (if you exceed free tier):
- Llama models: ~$0.10-0.20 per million tokens
- Per meal generation: ~500-1000 tokens = ~$0.0001 per request
- 1000 users x 5 refreshes = 5000 requests/month = ~$0.50/month

**Gemini Pricing**:
- Gemini 1.5 Flash: $0.10 per million input tokens, $0.40 per million output
- Similar cost structure

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API rate limits exceeded | Low | Medium | Fallback to static meals |
| LLM hallucination (wrong macros) | Medium | High | Validate output before returning |
| High latency | Medium | Low | Add loading skeleton |
| API cost overruns | Low | High | Set usage alerts, implement caching |
| JSON parse errors | Medium | Medium | Retry with corrected prompt |

## Success Metrics

1. **Response time**: < 2 seconds for meal generation
2. **Accuracy**: Total calories within 50 of target
3. **Uptime**: 99% availability (with fallback)
4. **User satisfaction**: Track refresh usage patterns

## Files to Create/Modify

### New Files:
- `/src/app/api/meal-recommendations/route.ts` - API endpoint
- `/src/lib/groq.ts` - Groq client wrapper (optional)

### Modified Files:
- `/src/app/components/MealData.tsx` - Replace static fetch with LLM call
- `/src/app/Food/page.tsx` - May need updates for new flow
- `/src/app/types/meals.ts` - Add new types if needed
- `.env.local` - Add `GROQ_API_KEY`

### Delete (later):
- `/public/data/meals.json` - No longer needed
- `/src/app/utils/mealUtils.ts` - Portion scaling logic replaced

## Next Steps

1. **Get Groq API Key**: https://console.groq.com/
2. **Add to .env.local**: `GROQ_API_KEY=your_key_here`
3. **Create API route** with prompt engineering
4. **Test with curl**: `curl "http://localhost:3000/api/meal-recommendations?calories=2000"`
5. **Update frontend** to use new endpoint
6. **Implement fallback** to static meals if LLM fails

## Alternative: Gradual Rollout

If you want to test without full commitment:

1. Keep static meals as primary
2. Add "AI Upgrade" button that calls LLM for premium users
3. A/B test response quality
4. Roll out to all users once validated

This gives you real user feedback before fully replacing the static system.
