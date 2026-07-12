import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail, Phone, MapPin, MessageSquare, Shield, Building2, Headphones, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us — ProStep2Market",
  description: "Get in touch with ProStep2Market. Sales inquiries, support requests, partnership opportunities, and general questions.",
  openGraph: {
    title: "Contact Us — ProStep2Market",
    description: "Get in touch with ProStep2Market. Sales inquiries, support requests, partnership opportunities, and general questions.",
  },
}

const contactMethods = [
  { icon: Mail, title: "General Inquiries", value: "hello@prostep2market.com", href: "mailto:hello@prostep2market.com", color: "#3b82f6" },
  { icon: MessageSquare, title: "Sales", value: "sales@prostep2market.com", href: "mailto:sales@prostep2market.com", color: "#fcd535" },
  { icon: Headphones, title: "Support", value: "support@prostep2market.com", href: "mailto:support@prostep2market.com", color: "#10b981" },
  { icon: Shield, title: "Security", value: "security@prostep2market.com", href: "mailto:security@prostep2market.com", color: "#ef4444" },
  { icon: Building2, title: "Partnerships", value: "partners@prostep2market.com", href: "mailto:partners@prostep2market.com", color: "#8b5cf6" },
]

const faqs = [
  { q: "How quickly do you respond?", a: "We typically respond within 2 hours during business hours (Mon-Fri, 9 AM - 6 PM EST). Enterprise customers receive priority response within 30 minutes." },
  { q: "Do you offer phone support?", a: "Phone support is available for Enterprise customers. All other inquiries are handled via email with fast response times." },
  { q: "Can I schedule a call?", a: "Yes! Use our Demo Request form to schedule a personalized walkthrough with our team." },
]

export default function ContactPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Get in <span className="text-[#fcd535]">Touch</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Have a question about ProStep2Market? Want to discuss enterprise pricing? 
            Our team is ready to help.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/demo-request" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Schedule a Demo <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Contact Methods</h2>
          <p className="mb-16 text-center text-[#848e9c]">Choose the right channel for your inquiry.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {contactMethods.map((m) => (
              <a key={m.title} href={m.href} className="group rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 text-center transition-all hover:border-[#3a3a5c] hover:-translate-y-0.5">
                <div className="mb-3 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px]" style={{ backgroundColor: `${m.color}1A` }}>
                    <m.icon className="h-5 w-5" style={{ color: m.color }} />
                  </div>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white group-hover:text-[#fcd535] transition-colors">{m.title}</h3>
                <p className="text-xs text-[#848e9c] break-all">{m.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Form */}
      <section className="border-t border-[#2b3139] py-20 bg-[#0d1015]">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Send Us a Message</h2>
          <p className="mb-12 text-center text-[#848e9c]">Fill out the form and we&apos;ll get back to you within 2 hours.</p>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input type="text" placeholder="Your name" aria-label="Your name" className="w-full rounded-[8px] border border-[#2b3139] bg-[#1e2329] px-4 py-3 text-sm text-white placeholder-[#848e9c] outline-none focus:border-[#fcd535]" />
              </div>
              <div>
                <input type="email" placeholder="Your email" aria-label="Your email" className="w-full rounded-[8px] border border-[#2b3139] bg-[#1e2329] px-4 py-3 text-sm text-white placeholder-[#848e9c] outline-none focus:border-[#fcd535]" />
              </div>
            </div>
            <div>
              <select aria-label="Subject" className="w-full rounded-[8px] border border-[#2b3139] bg-[#1e2329] px-4 py-3 text-sm text-[#848e9c] outline-none focus:border-[#fcd535]">
                <option value="">Select subject...</option>
                <option value="sales">Sales inquiry</option>
                <option value="support">Technical support</option>
                <option value="partnership">Partnership opportunity</option>
                <option value="security">Security report</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <textarea rows={4} placeholder="Your message" aria-label="Your message" className="w-full rounded-[8px] border border-[#2b3139] bg-[#1e2329] px-4 py-3 text-sm text-white placeholder-[#848e9c] outline-none focus:border-[#fcd535] resize-none" />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#fcd535] px-4 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              Send Message <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="mb-12 text-center text-2xl font-bold text-white">Quick Answers</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-5">
                <h3 className="mb-1 text-sm font-semibold text-white">{faq.q}</h3>
                <p className="text-sm text-[#848e9c]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
