"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { useT } from "@/contexts/LanguageContext"

export function Testimonials() {
  const t = useT()
  const testimonials = [
    { quote: t('marketing.testimonial1Quote'), author: t('marketing.testimonial1Author') },
    { quote: t('marketing.testimonial2Quote'), author: t('marketing.testimonial2Author') },
  ]

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#0B0B0B] md:mb-12 md:text-4xl">
          {t('marketing.testimonialsHeading')}
        </h2>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="light">
              <CardContent className="pt-6">
                <Quote className="mb-4 h-8 w-8 text-[#E53935]/30" />
                <blockquote className="mb-4 text-lg text-gray-700">
                  &ldquo;{testimonial.quote}&rdquo;
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
