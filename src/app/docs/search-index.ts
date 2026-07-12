export interface SearchEntry {
  path: string
  title: string
  section: string
  excerpt: string
}

export const DOCS_SEARCH_INDEX: SearchEntry[] = [
  { path: '/docs', title: 'Documentation Overview', section: 'Getting Started', excerpt: 'Welcome to ProStep2Market documentation. Learn how to get started with our AI-powered trader development platform.' },
  { path: '/docs/getting-started', title: 'Account Setup', section: 'Getting Started', excerpt: 'Create your account, choose your plan, and configure your profile settings including notification preferences.' },
  { path: '/docs/getting-started/connect-mt5', title: 'Connect MT5', section: 'Getting Started', excerpt: 'Connect your MetaTrader 5 account to ProStep2Market. Step-by-step guide for broker setup and API connection.' },
  { path: '/docs/getting-started/first-journal', title: 'First Journal Entry', section: 'Getting Started', excerpt: 'Log your first trade in the journal. Add emotions, screenshots, and notes to start building your trading record.' },
  { path: '/docs/getting-started/assessment', title: 'DNA Assessment', section: 'Getting Started', excerpt: 'Take your initial Trader DNA assessment to discover your psychological trading profile and strengths.' },
  { path: '/docs/guides/dashboard', title: 'Dashboard Guide', section: 'User Guides', excerpt: 'Navigate your personalized dashboard. Understand widgets, metrics, Edge Score, and activity tracking.' },
  { path: '/docs/guides/journaling', title: 'Journaling Guide', section: 'User Guides', excerpt: 'Master the trade journal. Learn about tags, emotions, screenshots, and how to review your trade history.' },
  { path: '/docs/guides/edge-score', title: 'Edge Score Guide', section: 'User Guides', excerpt: 'Understand your Edge Score calculation across discipline, risk, emotional stability, consistency, and strategy adherence.' },
  { path: '/docs/guides/risk-guardian', title: 'Risk Guardian Guide', section: 'User Guides', excerpt: 'Configure and interpret Risk Guardian alerts for real-time behavioral risk monitoring during trading.' },
  { path: '/docs/guides/trader-dna', title: 'Trader DNA Guide', section: 'User Guides', excerpt: 'Explore your Trader DNA profile archetypes and learn how to leverage your psychological strengths.' },
  { path: '/docs/guides/analytics', title: 'Analytics Guide', section: 'User Guides', excerpt: 'Deep-dive into trade analytics, behavioral patterns, risk metrics, and performance reports.' },
  { path: '/docs/guides/strategy-lab', title: 'Strategy Lab Guide', section: 'User Guides', excerpt: 'Build, backtest, and refine trading strategies using the Strategy Lab with entry/exit rules.' },
  { path: '/docs/guides/education', title: 'Education Guide', section: 'User Guides', excerpt: 'Track your learning journey through courses, certifications, and quizzes on trading psychology.' },
  { path: '/docs/admin/overview', title: 'Admin Overview', section: 'Admin Guides', excerpt: 'Complete guide to the admin dashboard covering user management, system health, and platform configuration.' },
  { path: '/docs/admin/user-management', title: 'User Management', section: 'Admin Guides', excerpt: 'Manage users, roles, permissions, and enterprise tenants from the admin panel.' },
  { path: '/docs/admin/security-compliance', title: 'Security & Compliance', section: 'Admin Guides', excerpt: 'Configure security settings, audit logs, compliance rules, and access controls for your platform.' },
  { path: '/docs/admin/billing', title: 'Billing Guide', section: 'Admin Guides', excerpt: 'Manage subscriptions, invoices, payment gateways, and billing history across all tenants.' },
  { path: '/docs/api/overview', title: 'API Overview', section: 'API Docs', excerpt: 'Introduction to the ProStep2Market API. Base URL, authentication, rate limits, and response formats.' },
  { path: '/docs/api/auth', title: 'API Authentication', section: 'API Docs', excerpt: 'Authenticate with API keys or JWT tokens. Code examples in cURL, JavaScript, and Python.' },
  { path: '/docs/api/trades', title: 'Trades API', section: 'API Docs', excerpt: 'CRUD operations for trades. List, create, update, and delete trades with filtering and pagination.' },
  { path: '/docs/api/analytics', title: 'Analytics API', section: 'API Docs', excerpt: 'Access trade analytics, behavioral patterns, Edge Score history, and performance metrics programmatically.' },
  { path: '/docs/api/webhooks', title: 'Webhooks', section: 'API Docs', excerpt: 'Configure webhooks for real-time trade events, alert notifications, and data synchronization.' },
  { path: '/docs/api/sdks', title: 'SDKs & Libraries', section: 'API Docs', excerpt: 'Official SDKs for JavaScript, Python, and other languages to integrate with the ProStep2Market API.' },
  { path: '/docs/api/changelog', title: 'API Changelog', section: 'API Docs', excerpt: 'Version history, breaking changes, deprecation notices, and migration guides for the API.' },
  { path: '/docs/tutorials', title: 'Tutorials Hub', section: 'Tutorials', excerpt: 'Step-by-step tutorials for common tasks including CSV import, performance analysis, and troubleshooting.' },
  { path: '/docs/tutorials/best-practices', title: 'Best Practices', section: 'Tutorials', excerpt: 'Trading journal best practices, consistent logging habits, and maximizing platform features.' },
  { path: '/docs/tutorials/csv-import', title: 'CSV Import Guide', section: 'Tutorials', excerpt: 'Import your trade history from any broker using CSV files. Field mapping, formatting, and troubleshooting.' },
  { path: '/docs/tutorials/performance-analysis', title: 'Performance Analysis', section: 'Tutorials', excerpt: 'Analyze your trading performance using Edge Score trends, behavioral patterns, and comparative metrics.' },
  { path: '/docs/tutorials/troubleshooting', title: 'Troubleshooting Guide', section: 'Tutorials', excerpt: 'Common issues and solutions for MT5 connection, CSV import, data synchronization, and account access.' },
  { path: '/docs/tutorials/faq', title: 'Frequently Asked Questions', section: 'Tutorials', excerpt: 'Answers to common questions about platform features, billing, data privacy, and technical requirements.' },
]
