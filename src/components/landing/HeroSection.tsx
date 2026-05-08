"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, PlayCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#0B0B0B] md:text-5xl lg:text-6xl">
            Become a Better Trader by Knowing Yourself First
          </h1>
          <p className="mb-10 text-lg text-gray-600 md:text-xl">
            AI powered trader development, behavioral analytics, and performance coaching that improves discipline, decision quality, and consistency.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                See Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}