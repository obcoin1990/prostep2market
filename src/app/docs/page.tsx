'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Getting Started',
    description: 'Set up your account, connect your trading platform, and create your first journal entry.',
    href: '/docs/getting-started',
    items: ['Account Setup', 'Connect MT5', 'First Journal Entry', 'DNA Assessment'],
  },
  {
    title: 'User Guides',
    description: 'Deep dives into every feature — Dashboard, Journaling, Edge Score, Risk Guardian, and more.',
    href: '/docs/guides/dashboard',
    items: ['Dashboard', 'Journaling', 'Edge Score', 'Risk Guardian', 'Trader DNA', 'Analytics'],
  },
  {
    title: 'Admin Guides',
    description: 'Everything administrators need to manage users, billing, and security settings.',
    href: '/docs/admin/overview',
    items: ['User Management', 'Security & Compliance', 'Billing'],
  },
  {
    title: 'API Docs',
    description: 'Integrate with ProStep2Market programmatically — authentication, trades, analytics, webhooks, and SDKs.',
    href: '/docs/api/overview',
    items: ['Authentication', 'Trades API', 'Analytics API', 'Webhooks', 'SDKs'],
  },
  {
    title: 'Tutorials',
    description: 'Step-by-step walkthroughs, best practices, CSV import, performance analysis, and troubleshooting.',
    href: '/docs/tutorials',
    items: ['Best Practices', 'CSV Import Guide', 'Performance Analysis', 'Troubleshooting', 'FAQ'],
  },
]

export default function DocsOverview() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#eaecef]">ProStep2Market Documentation</h1>
        <p className="text-[#aeaeae] max-w-2xl">
          Everything you need to know about using ProStep2Market — from your first account setup to advanced
          analytics, API integration, and trader psychology. Use the sidebar or browse the sections below.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="border border-white/10 bg-white/5 rounded-xl p-5 space-y-3 hover:border-white/20 transition-colors"
          >
            <h2 className="text-lg font-semibold text-[#eaecef]">{section.title}</h2>
            <p className="text-sm text-[#aeaeae]">{section.description}</p>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item}>
                  <Link
                    href={section.href}
                    className="text-sm text-[#fcd535] hover:underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={section.href}
              className="inline-block text-sm font-medium text-[#fcd535] hover:underline pt-1"
            >
              View all →</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
