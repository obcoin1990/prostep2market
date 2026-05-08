# Phase 8 - Plan 4: Navigation, Footer & Final Integration

## Goal
Ensure consistent navigation, footer, and public page routing across all public pages. Update the dashboard layout to include all new module links.

## Requirements

### Dashboard Sidebar Navigation
Update `src/components/dashboard/sidebar.tsx` to include links to all modules:
- Dashboard (/)
- Trade Journal (/journal)
- AI Analysis (/analysis)
- Education (/education)
- Strategy Lab (/strategy-lab)
- Pricing (/pricing) - optional
- Legal links in footer

### Dashboard Header
Update `src/components/dashboard/header.tsx`:
- User menu with profile link, settings, sign out
- Notification bell (placeholder)

### Public Page Layout
Create `src/app/(public)/layout.tsx` for public pages:
- No auth required
- Public navigation with "Sign In" / "Get Started" buttons
- Footer with links

### Footer Component
Create `src/components/landing/Footer.tsx`:
- Logo
- Navigation columns:
  - Product (Features, Pricing, API)
  - Resources (Blog, FAQ, Documentation)
  - Company (About, Contact, Legal)
  - Social links (Twitter, LinkedIn)
- Copyright line: "© 2025 ProStep2Market. All rights reserved."
- Links to /legal/terms, /legal/privacy, /legal/disclaimer

### Public Navigation
Create `src/components/landing/Navbar.tsx`:
- Logo "ProStep2Market"
- Links: Features, How It Works, Pricing
- CTAs: "Sign In" → /login, "Get Started" → /signup
- Mobile responsive hamburger menu

### Page Routes
Ensure these routes work:
- `/` - Landing page
- `/pricing` - Pricing page
- `/faq` - FAQ page
- `/legal/terms` - Terms
- `/legal/privacy` - Privacy
- `/legal/disclaimer` - Disclaimer
- `/login` - Sign in
- `/signup` - Sign up

### Environment Variables Check
Create `.env.example` with:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Files
- `src/app/(public)/layout.tsx` - Public pages layout
- `src/components/landing/Navbar.tsx` - Public navigation
- `src/components/landing/Footer.tsx` - Shared footer
- `src/components/dashboard/sidebar.tsx` - Updated sidebar with all module links
- `.env.example`

## Verification
- Public pages have consistent nav and footer
- Dashboard sidebar has all module links
- All routes are accessible