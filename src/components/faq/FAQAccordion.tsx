"use client"

import { FAQItem } from "./FAQItem"

interface FAQ {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQ[]
  defaultOpenIndex?: number
}

export function FAQAccordion({ items, defaultOpenIndex }: FAQAccordionProps) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-100 px-4 md:px-6">
      {items.map((item, index) => (
        <FAQItem
          key={index}
          question={item.question}
          answer={item.answer}
          defaultOpen={index === defaultOpenIndex}
        />
      ))}
    </div>
  )
}
