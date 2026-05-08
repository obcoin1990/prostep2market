"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "ProStep2Market changed how I trade. I stopped revenge trading and regained consistency.",
    author: "Trader A",
  },
  {
    quote: "The Edge Score made my progress measurable and addictive in a good way.",
    author: "Trader B",
  },
]

export function Testimonials() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#0B0B0B] md:text-4xl">
          Traders Who Improved Their Discipline and Results
        </h2>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="default">
              <CardContent className="pt-6">
                <Quote className="mb-4 h-8 w-8 text-[#E53935]/30" />
                <blockquote className="mb-4 text-lg text-gray-700">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-sm font-medium text-gray-500">
                  — {testimonial.author}
                </cite>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}