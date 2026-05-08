# Phase 8 - Plan 2: Pricing & FAQ Pages

## Goal
Build pricing and FAQ pages based on RESEURCES/pricing.md and RESEURCES/faq.md specs.

## Requirements

### Pricing Page

**Path:** `src/app/pricing/page.tsx`

**Tiers:**
| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Journal | limited | full | full |
| AI Analysis | limited | full | full |
| Edge Score | preview | full | full |
| Risk Guardian | no | full | full |
| Strategy Lab | no | no | full; white label |

**Pro Plan Price:** Show monthly subscription placeholder
**Enterprise:** "Contact us for custom pricing"

**Sections:**
1. Headline: "Plans for Traders and Institutions"
2. 3 tier cards (Free/Pro/Enterprise)
3. Feature comparison table
4. CTA: "Choose the Plan That Matches Your Growth" → /signup

### FAQ Page

**Path:** `src/app/faq/page.tsx`

**Questions:**
1. "What does ProStep2Market do" → analyzes trader behavior and performance
2. "Do you provide trading signals" → No, no signals, copy trading, or financial advice
3. "How do I connect my account" → MT5 read only or CSV import
4. "Is my data secure" → Encrypted in transit and at rest
5. "Can I use the platform without connecting MT5" → Yes, manual/CSV supported
6. "What is Edge Score" → Gamified performance score measuring discipline, risk, emotional stability, execution
7. "Can brokers use this platform" → Yes, Enterprise plan available

**Design:** Accordion-style FAQ with smooth open/close animations

### Implementation

Use existing UI components. Create:
- `src/app/pricing/page.tsx` - Pricing page
- `src/app/faq/page.tsx` - FAQ page
- `src/components/pricing/PricingCard.tsx` - Tier card component
- `src/components/pricing/ComparisonTable.tsx` - Feature table
- `src/components/faq/FAQAccordion.tsx` - Accordion component
- `src/components/faq/FAQItem.tsx` - Individual FAQ item

## Verification
- Pricing page shows 3 tiers with correct features
- FAQ page shows all 7 questions with accordion behavior