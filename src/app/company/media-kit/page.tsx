import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Download, Image, FileText, Edit, Palette, Monitor } from "lucide-react"

export const metadata: Metadata = {
  title: "Media Kit — ProStep2Market",
  description: "Download ProStep2Market brand assets, logos, product screenshots, and brand guidelines for media and partnership use.",
  openGraph: { title: "ProStep2Market Media Kit", description: "Brand assets and guidelines." },
}

const brandAssets = [
  { icon: Image, title: "Logo Package", desc: "Primary logo, icon mark, and wordmark in PNG, SVG, and EPS formats. Dark and light variants included.", format: "Request via email" },
  { icon: Palette, title: "Brand Guidelines", desc: "Complete brand identity guide including color palette, typography, spacing, and usage rules.", format: "Request via email" },
  { icon: Monitor, title: "Product Screenshots", desc: "High-resolution product screenshots across dashboard, analytics, and mobile views. 16:9 and 9:16 formats.", format: "Request via email" },
  { icon: Edit, title: "Logo Usage Examples", desc: "Approved logo placements on dark and light backgrounds, social media avatars, and favicon assets.", format: "Request via email" },
  { icon: FileText, title: "Brand Story Deck", desc: "Executive presentation covering company overview, mission, product, and market opportunity.", format: "Request via email" },
]

const colorPalette = [
  { name: "Brand Yellow", hex: "#FCD535", use: "Primary CTAs, highlights, accents" },
  { name: "Brand Yellow Hover", hex: "#F0B90B", use: "Button hover states" },
  { name: "Dark Canvas", hex: "#0B0E11", use: "Primary background" },
  { name: "Dark Card", hex: "#1E2329", use: "Card and surface backgrounds" },
  { name: "Dark Elevated", hex: "#2B3139", use: "Elevated surfaces, hover states" },
  { name: "Text Primary", hex: "#EAECEF", use: "Primary text on dark backgrounds" },
  { name: "Text Muted", hex: "#848E9C", use: "Secondary text, labels" },
  { name: "Trading Green", hex: "#0ECB81", use: "Profitable trades, positive metrics" },
  { name: "Trading Red", hex: "#F6465D", use: "Losses, negative metrics, alerts" },
  { name: "White", hex: "#FFFFFF", use: "Light mode backgrounds" },
]

export default function MediaKitPage() {
  return (
    <div className="bg-[#0b0e11] text-[#eaecef]">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h1 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            <span className="text-[#fcd535]">Media Kit</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-[#848e9c] md:text-xl">
            Download official ProStep2Market brand assets, logos, product imagery, and brand guidelines. 
            All assets are free to use for media coverage, partnerships, and approved collaborations.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="mailto:brand@prostep2market.com?subject=Brand%20Asset%20Request" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-6 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
              <Download className="h-4 w-4" /> Request All Assets
            </Link>
            <Link href="/company/press" className="inline-flex items-center gap-2 rounded-[6px] border border-[#2b3139] px-6 py-3 text-sm font-medium text-[#eaecef] transition-colors hover:bg-[#1e2329]">
              Press Inquiries
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Brand Assets</h2>
          <p className="mb-16 text-center text-[#848e9c]">Download individual asset packages below.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brandAssets.map((asset) => (
              <div key={asset.title} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-6 transition-colors hover:border-[#3a3a5c]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[8px] bg-yellow-500/10">
                  <asset.icon className="h-5 w-5 text-[#fcd535]" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{asset.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-[#848e9c]">{asset.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#848e9c]">{asset.format}</span>
                  <Link href={`mailto:brand@prostep2market.com?subject=Asset Request: ${encodeURIComponent(asset.title)}`} className="inline-flex items-center gap-1 text-xs font-medium text-[#fcd535] transition-colors hover:text-[#f0b90b]">
                    <Download className="h-3 w-3" /> Request
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Color Palette</h2>
          <p className="mb-16 text-center text-[#848e9c]">Our brand color system for digital and print use.</p>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {colorPalette.map((c) => (
                <div key={c.hex} className="rounded-[12px] border border-[#2b3139] bg-[#1e2329] p-4">
                  <div className="mb-3 h-16 w-full rounded-[8px]" style={{ backgroundColor: c.hex }} />
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  <p className="text-xs text-[#fcd535] font-mono">{c.hex}</p>
                  <p className="mt-1 text-xs text-[#848e9c]">{c.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo Preview */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Logo Usage</h2>
          <p className="mb-16 text-center text-[#848e9c]">Preferred logo variants for different backgrounds.</p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-[12px] border border-[#2b3139] bg-[#0b0e11] p-12">
              <div className="text-center">
                <div className="text-4xl font-bold tracking-tight text-[#fcd535]">P2M</div>
                <p className="mt-2 text-xs text-[#848e9c]">Dark Background Variant</p>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-[12px] border border-[#d1d5db] bg-white p-12">
              <div className="text-center">
                <div className="text-4xl font-bold tracking-tight" style={{ color: "#fcd535" }}>P2M</div>
                <p className="mt-2 text-xs text-gray-500">Light Background Variant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guidelines */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">Usage Guidelines</h2>
            <div className="space-y-4 text-sm leading-relaxed text-[#848e9c]">
              <p><strong className="text-white">Do:</strong> Use our logo to link to prostep2market.com. Maintain clear space around the logo (minimum 1x the height of the mark). Use the appropriate variant for the background color.</p>
              <p><strong className="text-white">Don't:</strong> Modify, rotate, or recolor the logo. Place it on busy backgrounds without sufficient contrast. Use the dark variant on dark backgrounds.</p>
              <p className="mt-6">For questions about brand usage, contact <Link href="mailto:brand@prostep2market.com" className="text-[#fcd535] underline">brand@prostep2market.com</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2b3139] py-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Need Something Else?</h2>
          <p className="mb-8 text-[#848e9c]">Contact our brand team for custom asset requests or partnership inquiries.</p>
          <Link href="mailto:brand@prostep2market.com" className="inline-flex items-center gap-2 rounded-[6px] bg-[#fcd535] px-8 py-3 text-sm font-semibold text-[#181a20] transition-colors hover:bg-[#f0b90b]">
            brand@prostep2market.com <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
