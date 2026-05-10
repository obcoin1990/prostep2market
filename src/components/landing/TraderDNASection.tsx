"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, Shield, Brain, Activity } from "lucide-react"

export function TraderDNASection() {
  return (
    <section className="bg-[#0A0F1C] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
            Discover Your Trader DNA
          </h2>
          <p className="mb-12 text-lg text-[rgba(255,255,255,0.7)] md:text-xl">
            Uncover your psychological profile, behavioral patterns, and decision-making tendencies with our AI-powered assessment.
          </p>
        </div>
        
        {/* Trader DNA Grid */}
        <div className="mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
          
          {/* Left: Assessment Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Brain className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Psychological Profile</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Understand your risk tolerance, decision-making style, and emotional triggers through scientifically-backed assessments.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Behavioral Analysis</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Identify patterns in your trading behavior that impact performance, from overtrading to revenge trading tendencies.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Activity className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Performance Patterns</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  See how your psychology correlates with trading outcomes across different market conditions and strategies.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Zap className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Personalized Insights</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Get tailored recommendations for improving discipline, consistency, and emotional regulation based on your unique profile.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: Assessment Preview */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-8">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-white">Trader DNA Assessment</h3>
              <p className="mt-2 text-[rgba(255,255,255,0.6)]">
                12-minute psychological evaluation used by professional traders
              </p>
            </div>
            
            {/* Sample radar chart container */}
            <div className="h-64 w-full bg-[rgba(0,0,0,0.2)] rounded-xl mb-6 flex items-center justify-center">
              <span className="text-[rgba(255,255,255,0.3)] text-sm">Psychology Radar Chart</span>
            </div>
            
            {/* Assessment buttons */}
            <div className="space-y-4">
              <Link href="/trader-dna">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full gap-3"
                >
                  Take the Assessment
                  <Activity className="h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full gap-3 text-[rgba(255,255,255,0.7)] hover:text-white border-[rgba(255,255,255,0.2)] hover:border-white"
              >
                View Sample Report
                <Zap className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}