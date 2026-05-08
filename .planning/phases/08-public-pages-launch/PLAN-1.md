# Phase 8 - Plan 1: Landing Page

## Goal
Build the public landing page (`src/app/page.tsx`) based on RESEURCES/home.md spec.

## Requirements

### Meta
- Title: "ProStep2Market — AI Powered Trader Development and Performance Intelligence"
- Description from RESEURCES/home.md

### Sections (in order)

1. **Hero Section**
   - Headline: "Become a Better Trader by Knowing Yourself First"
   - Subheadline: "AI powered trader development, behavioral analytics, and performance coaching that improves discipline, decision quality, and consistency."
   - Primary CTA button: "Get Started Free" → /signup
   - Secondary CTA button: "See Demo" → /demo or scroll to preview

2. **Problem Statement**
   - Headline: "Why Most Traders Fail"
   - Copy: "Most traders fail not because of tools or strategies but because of emotional trading, overtrading, revenge trading, poor risk management, and inconsistent discipline. ProStep2Market fixes the root cause by focusing on trader behavior and psychology."

3. **Solution Overview**
   - Headline: "What ProStep2Market Does"
   - 5 bullet points with icons (use Lucide icons):
     - Trader Intelligence Platform
     - AI Behavioral Analytics
     - Risk Guardian
     - Trade Journal and Edge Score
     - Education and Strategy Lab

4. **Key Features Snapshot**
   - Grid of 6 feature cards:
     - Trader DNA Assessment
     - AI Trade Intelligence Engine
     - Risk Guardian System
     - Trade Journal System
     - Edge Score System
     - Strategy Lab

5. **AI Dashboard Preview**
   - Headline: "Real Time Insights into Your Trading Behavior"
   - Copy about Edge Score, Emotional Risk Meter, session analytics, AI alerts
   - CTA: "Explore Dashboard" → /dashboard

6. **How It Works**
   - 6 numbered steps

7. **Testimonials**
   - Headline: "Traders Who Improved Their Discipline and Results"
   - 2 testimonial quotes

8. **Pricing Teaser**
   - Headline: "Plans for Traders and Institutions"
   - Copy about Free/Pro/Enterprise
   - CTA: "View Pricing" → /pricing

9. **Footer CTA**
   - Headline: "Ready to Trade Smarter Not Harder"
   - CTA: "Start Free Trial" → /signup

## Implementation

Replace `src/app/page.tsx` with a complete landing page component. Use existing UI components (Button, Card, Badge from `src/components/ui/`). Use Lucide React icons. Use Tailwind for styling.

## Files
- `src/app/page.tsx` - Replace/rewrite with full landing page
- `src/components/landing/HeroSection.tsx` - Hero component
- `src/components/landing/ProblemSection.tsx` - Problem statement
- `src/components/landing/SolutionSection.tsx` - Solution overview
- `src/components/landing/FeaturesGrid.tsx` - Features grid
- `src/components/landing/HowItWorks.tsx` - How it works steps
- `src/components/landing/Testimonials.tsx` - Testimonials section
- `src/components/landing/PricingTeaser.tsx` - Pricing teaser
- `src/components/landing/FooterCTA.tsx` - Footer CTA

## Verification
- Page loads without errors
- All sections render correctly
- CTAs navigate to correct routes