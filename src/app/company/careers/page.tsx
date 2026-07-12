import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Clock, Users, Zap, Globe, Coffee, Heart, GraduationCap, Laptop } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers — ProStep2Market",
  description: "Join the team building the future of trader development. Remote-first culture, competitive benefits, and a mission that matters.",
  openGraph: { title: "Careers at ProStep2Market", description: "Build the future of trader development with us." },
}

const benefits = [
  { icon: Globe, title: "Remote-First", desc: "Work from anywhere. We hire across time zones and trust our team to deliver." },
  { icon: Laptop, title: "Equipment Budget", desc: "$5,000 annual budget for your ideal workstation. You choose what you need." },
  { icon: Heart, title: "Health & Wellness", desc: "Comprehensive medical, dental, and vision coverage. Mental health support included." },
  { icon: Coffee, title: "Unlimited PTO", desc: "Take the time you need. We trust you to manage your energy and output." },
  { icon: GraduationCap, title: "Learning Fund", desc: "$3,000 annual budget for courses, conferences, books, and certifications." },
  { icon: Users, title: "Equity Package", desc: "Every full-time employee receives stock options. We succeed together." },
]

const openRoles = [
  { title: "Senior Frontend Engineer", dept: "Engineering", location: "Remote (EMEA/Americas)", type: "Full-time", slug: "sr-frontend-engineer" },
  { title: "ML Engineer — Behavioral Analytics", dept: "AI/ML", location: "Remote (Global)", type: "Full-time", slug: "ml-engineer" },
  { title: "Product Designer", dept: "Design", location: "Remote (Americas)", type: "Full-time", slug: "product-designer" },
  { title: "Customer Success Manager", dept: "Revenue", location: "Remote (Global)", type: "Full-time", slug: "customer-success" },
  { title: "Technical Writer — Documentation", dept: "Product", location: "Remote (Global)", type: "Contract", slug: "technical-writer" },
  { title: "Trading Psychology Researcher", dept: "Behavioral Science", location: "Remote (Global)", type: "Full-time", slug: "trading-psychology-researcher" },
]

const culturePillars = [
  { icon: Users, title: "Mission-Driven", desc: "Every line of code, every design decision, every conversation traces back to our mission: helping traders understand themselves." },
  { icon: Zap, title: "High Agency", desc: "We hire adults and get out of their way. You own your work, your decisions, and your outcomes." },
  { icon: Heart, title: "Psychological Safety", desc: "We practice what we preach. Our culture prioritizes honest feedback, vulnerability, and growth over being right." },
]

export default function CareersPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Build the Future of{" "}
            <span className="text-[#fcd535]">Trader Development</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            We're looking for people who want to solve the most important problem in trading: 
            the human behind the screen. If you care about psychology, data, and real impact, 
            you'll fit right in.
          </p>
          <Link href="#open-roles" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            View Open Roles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Culture */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">How We Work</h2>
          <p className="mb-16 text-center text-[#848e9c]">Our culture is our product. Here's what makes ProStep2Market different.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {culturePillars.map((p) => (
              <div key={p.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                  <p.icon className="h-6 w-6 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{p.title}</h3>
                <p className="text-sm leading-relaxed text-[#848e9c]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Benefits & Perks</h2>
          <p className="mb-16 text-center text-[#848e9c]">We invest in our team because they invest in our mission.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4 rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-yellow-500/10">
                  <b.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{b.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#848e9c]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Open Positions</h2>
          <p className="mb-16 text-center text-[#848e9c]">We're growing. Join us.</p>
          <div className="mx-auto max-w-4xl">
            {openRoles.map((role) => (
              <div key={role.slug} className="flex flex-col gap-4 border-b border-[#2b3139] px-4 py-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">{role.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-xs text-[#fcd535]">
                      <Users className="h-3 w-3" /> {role.dept}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#848e9c]">
                      <MapPin className="h-3 w-3" /> {role.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#848e9c]">
                      <Clock className="h-3 w-3" /> {role.type}
                    </span>
                  </div>
                </div>
                <Link
                  href={`mailto:careers@prostep2market.com?subject=Application: ${encodeURIComponent(role.title)}`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-[6px] border border-[#2b3139] px-4 py-2 text-xs font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]"
                >
                  Apply Now <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="mb-4 text-sm text-[#848e9c]">Don't see a role that fits? We're always looking for great people.</p>
            <Link href="mailto:careers@prostep2market.com?subject=General%20Application" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Send Us Your Resume
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Make an Impact?</h2>
          <p className="mb-8 text-[#848e9c]">Join a team that's genuinely changing how traders approach their craft.</p>
          <Link href="#open-roles" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            View All Openings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
