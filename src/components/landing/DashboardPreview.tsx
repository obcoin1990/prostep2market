"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Gauge, Bell, BarChart3 } from "lucide-react"

export function DashboardPreview() {
  return (
    <section className="bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Real Time Insights into Your Trading Behavior
          </h2>
          <p className="mb-10 text-lg text-gray-300 md:text-xl">
            Visualize Edge Score, Emotional Risk Meter, session analytics, and AI alerts on a single dashboard.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-white text-gray-900 hover:bg-gray-100">
              Explore Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        {/* Preview Cards */}
        <div className="mt-16 grid max-w-4xl gap-4 md:grid-cols-2 mx-auto">
          <div className="rounded-xl bg-gray-800 p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="h-5 w-5 text-[#E53935]" />
              <span className="font-semibold">Edge Score</span>
            </div>
            <div className="text-3xl font-bold text-[#E53935]">78</div>
            <p className="text-sm text-gray-400 mt-1">Top 20% of traders</p>
          </div>
          <div className="rounded-xl bg-gray-800 p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-[#E53935]" />
              <span className="font-semibold">Emotional Risk Meter</span>
            </div>
            <div className="text-3xl font-bold text-green-400">Low</div>
            <p className="text-sm text-gray-400 mt-1">Trading within parameters</p>
          </div>
          <div className="rounded-xl bg-gray-800 p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-[#E53935]" />
              <span className="font-semibold">Session Analytics</span>
            </div>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-gray-400 mt-1">Trades today</p>
          </div>
          <div className="rounded-xl bg-gray-800 p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="h-5 w-5 text-[#E53935]" />
              <span className="font-semibold">AI Alerts</span>
            </div>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-gray-400 mt-1">Active recommendations</p>
          </div>
        </div>
      </div>
    </section>
  )
}