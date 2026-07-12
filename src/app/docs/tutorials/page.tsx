'use client'

import Link from 'next/link'
import { BookOpen, Star, Upload, BarChart3, AlertTriangle, HelpCircle } from 'lucide-react'

const TUTORIALS = [
  {
    icon: Star,
    title: 'Trading Best Practices',
    description: 'Learn the key habits and disciplines that separate consistent profitable traders from the rest.',
    duration: '10 min read',
    href: '/docs/tutorials/best-practices',
  },
  {
    icon: Upload,
    title: 'CSV Import Guide',
    description: 'Import your trades from any broker using our CSV import tool. Step-by-step format and field mapping.',
    duration: '8 min read',
    href: '/docs/tutorials/csv-import',
  },
  {
    icon: BarChart3,
    title: 'Performance Analysis',
    description: 'Understand your win rate, risk-reward ratios, drawdowns, and behavioral patterns with our analytics.',
    duration: '12 min read',
    href: '/docs/tutorials/performance-analysis',
  },
  {
    icon: AlertTriangle,
    title: 'Troubleshooting Guide',
    description: 'Solutions to common issues — MT5 connection failures, sync problems, login errors, and more.',
    duration: '7 min read',
    href: '/docs/tutorials/troubleshooting',
  },
  {
    icon: HelpCircle,
    title: 'Frequently Asked Questions',
    description: 'Quick answers to the most common questions about pricing, MT5, Edge Score, privacy, and support.',
    duration: '5 min read',
    href: '/docs/tutorials/faq',
  },
]

export default function TutorialsHub() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="h-6 w-6 text-[#fcd535]" />
        <h1 className="text-3xl font-bold text-white">Tutorials &amp; Best Practices</h1>
      </div>
      <p className="text-white/60 mb-10 max-w-2xl">
        Step-by-step guides, best practices, and reference material to help you get the most out of
        ProStep2Market. Pick a topic below to get started.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {TUTORIALS.map((tutorial) => {
          const Icon = tutorial.icon
          return (
            <Link key={tutorial.href} href={tutorial.href}>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3 hover:border-white/20 hover:bg-white/[0.07] transition-all h-full">
                <div className="flex items-start justify-between">
                  <Icon className="h-6 w-6 text-[#fcd535]" />
                  <span className="text-xs text-white/60">{tutorial.duration}</span>
                </div>
                <h2 className="text-lg font-semibold text-white">{tutorial.title}</h2>
                <p className="text-sm text-white/60">{tutorial.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
