'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Users, Building2, CheckCircle2, Monitor, Phone } from "lucide-react"

export default function DemoRequestPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "", interest: "", date: "", time: "" })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const isValid = form.name && form.email && form.company

  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#eaecef]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Info */}
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tighter text-white md:text-5xl">
              See ProStep2Market <span className="text-[#fcd535]">in Action</span>
            </h1>
            <p className="mb-8 text-lg text-[#848e9c]">
              Schedule a personalized demo with our team. We&apos;ll walk you through the platform, 
              answer your questions, and help you find the right solution.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Monitor, title: "Live Platform Walkthrough", desc: "See every module in action with a real demonstration." },
                { icon: Users, title: "Tailored to Your Needs", desc: "We focus on the features most relevant to your use case." },
                { icon: Phone, title: "Q&A Session", desc: "Get all your questions answered by our product experts." },
                { icon: Calendar, title: "30 Minutes", desc: "A focused, efficient demo that respects your time." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[rgba(252,213,53,0.12)]">
                    <item.icon className="h-4 w-4 text-[#fcd535]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-[#848e9c]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[10px] border border-[#2b3139] bg-[#1e2329] p-4">
              <p className="text-sm text-[#848e9c]">
                Already have an account? <Link href="/dashboard" className="text-[#fcd535] hover:underline">Go to Dashboard</Link>
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 md:p-8">
            {/* Step indicator */}
            <div className="mb-6 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    step === s ? "bg-[#fcd535] text-[#181a20]" :
                    step > s ? "bg-[#10b981] text-white" : "bg-[#2b3139] text-[#848e9c]"
                  }`}>
                    {step > s ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
                  </div>
                  {s < 3 && <div className={`h-px w-8 ${step > s ? "bg-[#10b981]" : "bg-[#2b3139]"}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <h2 className="mb-1 text-lg font-semibold text-white">Your Information</h2>
                <p className="mb-6 text-sm text-[#848e9c]">Tell us about yourself.</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">Full name *</label>
                    <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="John Smith" className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-white placeholder-[#848e9c] outline-none focus:border-[#fcd535]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">Work email *</label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="john@company.com" className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-white placeholder-[#848e9c] outline-none focus:border-[#fcd535]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">Company name *</label>
                    <input type="text" value={form.company} onChange={e => update("company", e.target.value)} placeholder="Acme Trading" className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-white placeholder-[#848e9c] outline-none focus:border-[#fcd535]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">Company size</label>
                    <select value={form.size} onChange={e => update("size", e.target.value)} className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-[#848e9c] outline-none focus:border-[#fcd535]">
                      <option value="">Select...</option>
                      <option value="1">Just me</option>
                      <option value="2-10">2-10 traders</option>
                      <option value="11-50">11-50 traders</option>
                      <option value="51-200">51-200 traders</option>
                      <option value="200+">200+ traders</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">I&apos;m interested in</label>
                    <select value={form.interest} onChange={e => update("interest", e.target.value)} className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-[#848e9c] outline-none focus:border-[#fcd535]">
                      <option value="">Select...</option>
                      <option value="retail">Retail trading</option>
                      <option value="prop">Prop firm</option>
                      <option value="coach">Trading coaching</option>
                      <option value="brokerage">Brokerage</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!isValid} className="mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#fcd535] px-4 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b] disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-1 text-lg font-semibold text-white">Schedule Your Demo</h2>
                <p className="mb-6 text-sm text-[#848e9c]">Pick a date and time that works for you.</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">Preferred date</label>
                    <input type="date" value={form.date} onChange={e => update("date", e.target.value)} className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-white outline-none focus:border-[#fcd535]" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-[#848e9c]">Preferred time</label>
                    <select value={form.time} onChange={e => update("time", e.target.value)} className="w-full rounded-[8px] border border-[#2b3139] bg-[#0b0e11] px-4 py-2.5 text-sm text-[#848e9c] outline-none focus:border-[#fcd535]">
                      <option value="">Select...</option>
                      <option value="9-10">9:00 AM - 10:00 AM EST</option>
                      <option value="10-11">10:00 AM - 11:00 AM EST</option>
                      <option value="11-12">11:00 AM - 12:00 PM EST</option>
                      <option value="12-1">12:00 PM - 1:00 PM EST</option>
                      <option value="1-2">1:00 PM - 2:00 PM EST</option>
                      <option value="2-3">2:00 PM - 3:00 PM EST</option>
                      <option value="3-4">3:00 PM - 4:00 PM EST</option>
                      <option value="4-5">4:00 PM - 5:00 PM EST</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-[6px] border border-[#2b3139] px-4 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#2b3139]">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 rounded-[6px] bg-[#fcd535] px-4 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="h-8 w-8 text-[#10b981]" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-white">Demo Scheduled!</h2>
                <p className="mb-6 text-sm text-[#848e9c]">
                  We&apos;ve received your request. A member of our team will confirm your demo time 
                  within 24 hours. You&apos;ll receive a calendar invitation with the meeting link.
                </p>
                <div className="rounded-[10px] border border-[#2b3139] bg-[#0b0e11] p-4 text-left text-sm text-[#848e9c]">
                  <p><strong className="text-white">Name:</strong> {form.name}</p>
                  <p><strong className="text-white">Email:</strong> {form.email}</p>
                  <p><strong className="text-white">Company:</strong> {form.company}</p>
                  {form.date && <p><strong className="text-white">Date:</strong> {form.date}</p>}
                  {form.time && <p><strong className="text-white">Time:</strong> {form.time}</p>}
                </div>
                <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
                  Back to Home <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
