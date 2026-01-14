# Features Section Redesign Specification

## Overview

Redesign the Features component from a 2x2 card grid to a horizontal **image-left, description-right** layout for each of the 4 features.

---

## Current State

**File**: `src/app/components/Features.tsx`

**Current Layout**: 2x2 grid with cards
- Each feature displayed as a card with icon, title, and description
- Icons in colored circles
- Hover effects with side accent bar

**Current Features Data**:
| # | Feature Name | Description |
|---|--------------|-------------|
| 1 | Lightning Fast | Optimized for speed, quick load times, responsive interactions |
| 2 | Food Recommendations | Choose from variety of foods while maintaining diet |
| 3 | Workout Tracker | User-friendly interface for tracking workouts efficiently |
| 4 | Calorie Calculator | Insights into body and how much to eat to reach goals |

---

## Target State

### Layout Requirements

Each feature should display as a **horizontal row**:

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                   │
│  │  IMAGE  │    Feature Title                                  │
│  │(Placeholder)│                                               │
│  │  PLACE  │    Feature description text goes here.            │
│  │  HERE   │    Multiple lines of description.                 │
│  └─────────┘                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Changes

1. **Layout**: Change from `grid grid-cols-1 md:grid-cols-2` to vertical stack of horizontal rows
2. **Image**: Left side - placeholder div or image component
3. **Content**: Right side - title + description
4. **Icon**: Keep as decorative element or move to content area
5. **Spacing**: Adequate gap between image and content
6. **Responsive**: Stack vertically on mobile (image on top, content below)

### Visual Requirements

- Clean, modern look
- Smooth transitions/animations (keep framer-motion)
- Consistent spacing between features
- Alternating layout (image left, image right) for visual interest - optional
- Rounded corners on image container
- Subtle shadow or border

### Technical Requirements

**File to Modify**: `src/app/components/Features.tsx`

**New Component Structure**:

```typescript
interface Feature {
  title: string
  description: string
  icon: React.ComponentType
  imagePlaceholder?: string  // Color or gradient for placeholder
}

const features: Feature[] = [
  { /* ... */ },
  { /* ... */ },
  { /* ... */ },
  { /* ... */ },
]

export default function Features() {
  return (
    <section id="features">
      {/* Existing background elements */}
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Existing header */}
        
        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureRow
              key={feature.title}
              feature={feature}
              index={index}
              // Alternating layout: even = image left, odd = image right
              imageOnLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ feature, index, imageOnLeft }: FeatureRowProps) {
  return (
    <motion.div
      className={`flex flex-col md:flex-row items-center gap-8 ${
        imageOnLeft ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* Image/Placeholder */}
      <div className="w-full md:w-1/2">
        <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
          <span className="text-muted-foreground">Placeholder: {feature.title}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="w-full md:w-1/2">
        <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
        {/* Keep icon as decorative element if desired */}
      </div>
    </motion.div>
  )
}
```

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Stacked: Image top, content bottom |
| Desktop (≥ 768px) | Horizontal: Image left/right, content opposite |

### Animation Requirements

- Staggered fade-in on scroll (existing)
- Subtle hover effect on image (scale or shadow)
- Optional: Parallax effect on images

---

## Implementation Steps

1. Create `FeatureRow` component
2. Update `Features` component to use vertical stack of `FeatureRow`
3. Add image placeholder styling
4. Implement alternating layout (optional for visual interest)
5. Ensure mobile responsiveness
6. Keep existing framer-motion animations
7. Test all 4 features display correctly

---

## Files to Modify

- `src/app/components/Features.tsx`

---

## Optional Enhancements

- Add actual Next.js Image component when images are ready
- Add subtle gradient background to placeholders
- Add icon integration into content area
- Add "Learn More" link or CTA button per feature
- Alternating layout (left/right) for visual rhythm

---

## Definition of Done

- [ ] All 4 features display in horizontal image-left/description-right layout
- [ ] Mobile responsive (stacked layout)
- [ ] Smooth framer-motion animations preserved
- [ ] Placeholder for images (colored div or gradient)
- [ ] Clean, modern appearance
- [ ] No console errors
- [ ] TypeScript passes
