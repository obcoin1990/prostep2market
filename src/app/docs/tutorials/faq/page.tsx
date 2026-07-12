'use client'

import { HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'How much does ProStep2Market cost?',
    a: 'We offer a free tier with limited journal entries and analytics. Premium plans start at $29/month and include unlimited trades, advanced analytics, Trader DNA, and priority support. Annual plans come with a 20% discount. Visit our Pricing page for full details.',
  },
  {
    q: 'How do I connect my MT5 account?',
    a: 'Go to Settings &rarr; Platform Connection, enter your MT5 server address, login ID, and password. Ensure your MT5 terminal is running and connected to your broker. Click Connect and your trades will start syncing automatically.',
  },
  {
    q: 'Is my trading data private and secure?',
    a: 'Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never share your trading data with third parties. You can delete your data at any time from Settings &rarr; Privacy. See our Privacy Policy for more details.',
  },
  {
    q: 'How is the Edge Score calculated?',
    a: 'The Edge Score (0–100) is a composite metric across five dimensions: consistency, risk management, emotional discipline, strategy adherence, and profitability. Each dimension is weighted and scored based on your trade history and journal entries. A score above 75 indicates healthy trading habits.',
  },
  {
    q: 'Can I use ProStep2Market with my team?',
    a: 'Yes. Our Team plan lets you add up to 10 members, share trade reviews, and compare performance analytics. Team admins can manage permissions and view aggregated reports. Contact sales for custom team pricing.',
  },
  {
    q: 'Is there an API limit?',
    a: 'Free tier accounts have a rate limit of 100 requests per hour. Premium accounts get 1,000 requests per hour. If you need higher limits, contact our support team to discuss enterprise options.',
  },
  {
    q: 'Does ProStep2Market offer educational resources?',
    a: 'Yes. The Education tab includes curated articles, video tutorials, and interactive courses covering trading psychology, risk management, strategy development, and platform tutorials. New content is added weekly.',
  },
  {
    q: 'What support options are available?',
    a: 'Free tier users have access to our knowledge base and community forum. Premium users get email support with a 2-hour response window during business hours. Enterprise customers receive dedicated account management and phone support.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Go to Settings &rarr; Account &rarr; Delete Account. You will be asked to confirm your password. All your data will be permanently deleted within 30 days. You can cancel the deletion request within 7 days by contacting support.',
  },
  {
    q: 'Can I access ProStep2Market on mobile?',
    a: 'Yes. ProStep2Market is fully responsive and works on any modern mobile browser. We also offer native iOS and Android apps available on the App Store and Google Play Store. Mobile apps include all core features including journaling, analytics, and notifications.',
  },
  {
    q: 'What brokers are supported?',
    a: 'We support direct MT5 integration for any broker using the MetaTrader 5 platform. For other brokers, you can use our CSV import tool to upload your trade history. We are actively working on additional direct integrations.',
  },
]

export default function FAQ() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <HelpCircle className="h-6 w-6 text-[#fcd535]" />
        <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
      </div>
      <p className="text-white/60 mb-10 max-w-2xl">
        Quick answers to the most common questions about ProStep2Market. If you cannot find what
        you are looking for, contact our support team.
      </p>

      <div className="space-y-6">
        {FAQS.map((faq) => (
          <div
            key={faq.q}
            className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2"
          >
            <h2 className="text-lg font-semibold text-white">{faq.q}</h2>
            <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
