"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Brain, Activity } from "lucide-react"

export function AIRiskGuardianSection() {
  return (
    <section className="bg-[#0A0F1C] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tighter text-white md:text-4xl">
            AI Risk Guardian
          </h2>
          <p className="mb-12 text-lg text-[rgba(255,255,255,0.7)] md:text-xl">
            Real-time behavioral monitoring that alerts you to psychological risks before they impact your trading.
          </p>
        </div>
        
        {/* How it works */}
        <div className="mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
          
          {/* Left: Guardian explanation */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Real-Time Monitoring</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Continuously analyzes your trading behavior, emotional state, and decision patterns to detect risk signals.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Zap className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Instant Alerts</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Get notified when you're approaching psychological danger zones like revenge trading, overtrading, or fatigue.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Brain className="h-8 w-8 text-[#00B4D8]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Psychological Coaching</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Receive personalized interventions and coping strategies based on your unique trader psychology.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <Activity className="h-8 w-8 text-[#8A2BE2]" />
              <div>
                <h3 className="text-xl font-semibold text-white">Preventive Action</h3>
                <p className="text-[rgba(255,255,255,0.6)]">
                  Automatically suggests breaks, position reductions, or strategy adjustments when risk levels rise.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: Alert preview */}
          <div className="relative rounded-xl bg-[rgba(10,15,28,0.6)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] p-8">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-white">Risk Alert System</h3>
              <p className="mt-2 text-[rgba(255,255,255,0.6)]">
                Protecting your capital by protecting your psychology
              </p>
            </div>
            
            {/* Alert cards */}
            <div className="space-y-4">
              {/* Revenge Trading Alert */}
              <div className="rounded-lg bg-[rgba(229,57,53,0.1)] border border-[rgba(229,57,53,0.2)] p-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-[#E53935] flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Revenge Trading Detected</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-sm">
                      After 3 consecutive losses, you increased position size by 300%. Consider taking a break.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-[rgba(255,255,255,0.6)] hover:text-white border-[#E53935] hover:border-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Overtrading Alert */}
              <div className="rounded-lg bg-[rgba(255,193,7,0.1)] border border-[rgba(255,193,7,0.2)] p-4">
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-[#FFC107] flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Overtrading Warning</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-sm">
                      You've executed 12 trades today (80% above your 60-day average). Consider reducing frequency.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-[rgba(255,255,255,0.6)] hover:text-white border-[rgba(255,193,7,0.6)] hover:border-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Fatigue Alert */}
              <div className="rounded-lg bg-[rgba(156,39,176,0.1)] border border-[rgba(156,39,176,0.2)] p-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-[#9C27B0] flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Fatigue Risk Elevated</h4>
                    <p className="text-[rgba(255,255,255,0.7)] text-sm">
                      Trading for 4+ hours without breaks detected. Decision quality may be impaired.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-[rgba(255,255,255,0.6)] hover:text-white border-[rgba(156,39,176,0.6)] hover:border-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enable Guardian button */}
            <div className="mt-6 text-center">
              <Link href="/risk-guardian">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full gap-3"
                >
                  Enable AI Risk Guardian
                  <Shield className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}