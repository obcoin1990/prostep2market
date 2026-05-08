# Phase 8 - Plan 3: Legal Pages (Terms, Privacy, Disclaimer)

## Goal
Build legal pages required for launch.

## Requirements

### Terms of Service Page
**Path:** `src/app/legal/terms/page.tsx`

Sections:
1. Acceptance of Terms
2. Description of Service (ProStep2Market is a trading performance and behavioral analytics platform)
3. User Accounts (must provide accurate info, responsible for account security)
4. Prohibited Uses (no trading signals, financial advice, illegal activities)
5. Intellectual Property (platform content belongs to ProStep2Market)
6. Limitation of Liability (not responsible for trading losses)
7. Disclaimer (not a financial advisor, no investment advice)
8. Governing Law

### Privacy Policy Page
**Path:** `src/app/legal/privacy/page.tsx`

Sections:
1. Information We Collect (account info, trading data, usage data)
2. How We Use Your Information (analytics, personalization, improvement)
3. Data Security (encryption, access controls)
4. Data Sharing (we don't sell data, third-party service providers)
5. Your Rights (access, correction, deletion)
6. Cookies (analytics cookies only)
7. Contact Us

### Risk Disclaimer Page
**Path:** `src/app/legal/disclaimer/page.tsx`

Sections:
1. Not Financial Advice (clear statement: we don't provide investment advice)
2. No Guarantees (past performance doesn't guarantee future results)
3. Trading Risks (Forex/CFD trading involves substantial risk of loss)
4. User Responsibility (users are solely responsible for their trading decisions)
5. Third-Party Links (we're not responsible for external content)
6. Simulator Disclaimer (Strategy Lab simulations are for educational purposes only)

### Legal Layout
**Path:** `src/app/legal/layout.tsx`

Shared layout for all legal pages with:
- Back to Home link
- Legal page navigation (Terms | Privacy | Disclaimer)
- Consistent header/footer

### Implementation

Create:
- `src/app/legal/terms/page.tsx`
- `src/app/legal/privacy/page.tsx`
- `src/app/legal/disclaimer/page.tsx`
- `src/app/legal/layout.tsx`
- `src/components/legal/LegalLayout.tsx` - Shared legal page wrapper
- `src/components/legal/LegalNav.tsx` - Legal page navigation

## Verification
- All 3 legal pages render with proper content
- Navigation between legal pages works