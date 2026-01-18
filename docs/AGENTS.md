# Agent Guidelines for Macrotrue

This document provides guidelines for AI agents operating in this repository.

## Build Commands

```bash
# Development
npm run dev          # Start development server (port 3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting & Type Checking
npm run lint         # Run ESLint

# Database (Drizzle ORM)
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:generate  # Generate migration files
```

## Code Style Guidelines

### TypeScript

- **Strict Mode Enabled**: All TypeScript code must be type-safe. Never use `any`, `@ts-ignore`, or type assertions to suppress errors.
- **Explicit Types**: Always define types for function parameters and return values.
- **Interfaces over Types**: Prefer interfaces for object shapes, use type for unions/intersections.
- **Avoid `any`**: Use `unknown` when type is uncertain, then narrow with type guards.

### Imports & Path Aliases

```typescript
// Path aliases (defined in tsconfig.json)
import { something } from "@/lib/utils";      // src/lib/utils
import Button from "@/components/ui/button";   // src/components/ui/button
import { workouts } from "@/db/schema";        // src/db/schema

// Import order (recommended):
// 1. React imports
// 2. External library imports
// 3. Path alias imports (@/*)
// 4. Relative imports (./, ../)
```

### Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Components | PascalCase | `Button`, `UserProfile`, `WorkoutCard` |
| Functions | camelCase | `getCurrentUserId`, `validateResponse` |
| Variables | camelCase | `isLoading`, `userWorkouts` |
| Constants | UPPER_SNAKE_CASE or camelCase | `RATE_LIMIT_MAX`, `GROQ_API_URL` |
| Database columns | snake_case | `clerk_id`, `created_at`, `workout_type` |
| Props interfaces | PascalCase + Props suffix | `ButtonProps`, `CardProps` |

### Component Patterns

**React Server Components by Default**: Use RSC for all page components. Only add `"use client"` when interactivity is needed.

**UI Components (shadcn/ui style)**:
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Class Composition**: Use `cn()` utility (clsx + tailwind-merge) for class merging:
```typescript
import { cn } from "@/lib/utils"

function Component({ className }: { className?: string }) {
  return <div className={cn("base-class", className)} />
}
```

### API Routes (Next.js App Router)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Handle request...
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

**API Route Guidelines**:
- Always check authentication first with `auth()` from `@clerk/nextjs/server`
- Validate request body/query parameters
- Use proper HTTP status codes (200, 400, 401, 500, etc.)
- Always include error handling with try-catch

### Database (Drizzle ORM)

```typescript
import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const workouts = pgTable("workouts", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull(),
  workoutType: text("workout_type").notNull(),
  exercises: jsonb("exercises").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
```

**Database Guidelines**:
- Use snake_case for column names
- Always include `createdAt` and `updatedAt` timestamps
- Export `$inferSelect` and `$inferInsert` types
- Use Drizzle operators: `eq`, `ne`, `gt`, `lt`, `desc`, `asc`, etc.

### Tailwind CSS

- Use CSS variables for theming (defined in `globals.css`)
- Follow shadcn/ui color palette: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`
- Custom colors defined in `tailwind.config.ts` with `primary-light`, `secondary-light`
- Use `cn()` utility to merge Tailwind classes

### Error Handling

- **API Routes**: Try-catch with console.error logging, return JSON error responses with appropriate status codes
- **Components**: Use error boundaries for unexpected errors, handle loading states
- **Never suppress errors**: Never use empty catch blocks `catch(e) {}`
- **Never delete tests** to make them pass

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── components/        # Page-specific components
│   └── (routes)/          # Route pages
├── components/
│   ├── ui/               # shadcn/ui base components
│   └── blocks/           # Reusable block components
├── db/                   # Database
│   ├── schema.ts         # Drizzle schema
│   └── index.ts          # DB connection
├── lib/                  # Utilities
│   ├── utils.ts          # cn() utility
│   ├── auth.ts           # Auth helpers
│   └── api.ts            # API helpers
└── middleware.ts         # Next.js middleware
```

### Security

- Never expose secret keys in client-side code
- Always validate and sanitize user inputs
- Use Clerk for authentication
- Environment variables: `.env` for local, Vercel for production

### Testing

This project uses a minimal test setup. When adding tests:
- Place tests alongside source files: `Component.tsx` → `Component.test.tsx`
- Use React Testing Library for component tests
- Mock external services (Clerk, database, APIs)

## Key Dependencies

- **Framework**: Next.js 15 (App Router)
- **Database**: Drizzle ORM + Neon (PostgreSQL serverless)
- **Auth**: Clerk
- **UI**: shadcn/ui + Radix UI primitives
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **API Calls**: Native `fetch` (no axios)
- **Validation**: Zod recommended for complex validation
