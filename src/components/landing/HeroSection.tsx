"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, PlayCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0A0F1C] py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tighter text-white md:text-6xl lg:text-7xl">
            AI-Powered Trader Intelligence
          </h1>
          <p className="mb-12 text-lg text-[rgba(255,255,255,0.8)] md:text-xl">
            Know your psychology. Master your discipline. Trade with clarity.
          </p>
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#00B4D8] hover:bg-[#0096C7] text-white px-8 py-3 gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="border-[#8A2BE2] hover:border-[#6A0DAD] text-[#8A2BE2] hover:text-white px-8 py-3 gap-2 transition-colors">
                See Demo
                <PlayCircle className="h-5 w-5 text-[#8A2BE2] hover:text-white" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}