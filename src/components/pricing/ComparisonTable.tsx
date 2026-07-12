"use client"

import { Check, X } from "lucide-react"

interface FeatureRow {
  feature: string
  free: string
  pro: string
  enterprise: string
}

interface ComparisonTableProps {
  features: FeatureRow[]
}

export function ComparisonTable({ features }: ComparisonTableProps) {
  const renderValue = (value: string) => {
    switch (value) {
      case "yes":
      case "full":
        return (
          <div className="flex justify-center">
            <Check className="w-5 h-5 text-[#0ecb81]" />
          </div>
        )
      case "no":
        return (
          <div className="flex justify-center">
            <X className="w-5 h-5 text-[#6b7280]" />
          </div>
        )
      case "limited":
        return (
          <div className="flex justify-center">
            <span className="text-xs text-[#848e9c] font-medium">Limited</span>
          </div>
        )
      case "preview":
        return (
          <div className="flex justify-center">
            <span className="text-xs text-[#848e9c] font-medium">Preview</span>
          </div>
        )
      default:
        return <span className="text-sm text-[#c9d1d9]">{value}</span>
    }
  }

  return (
    <div className="overflow-x-auto rounded-[12px] border border-[#2b3139]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2b3139]">
            <th className="text-left py-4 px-4 font-semibold text-[#848e9c] w-1/4 text-xs uppercase tracking-wider">
              Feature
            </th>
            <th className="text-center py-4 px-4 font-semibold text-white text-xs uppercase tracking-wider">
              Free
            </th>
            <th className="text-center py-4 px-4 font-semibold text-[#fcd535] text-xs uppercase tracking-wider">
              Pro
            </th>
            <th className="text-center py-4 px-4 font-semibold text-white text-xs uppercase tracking-wider">
              Enterprise
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, index) => (
            <tr
              key={index}
              className={`border-b border-[#2b3139] ${
                index % 2 === 0 ? "bg-[rgba(255,255,255,0.015)]" : "bg-transparent"
              }`}
            >
              <td className="py-3 px-4 text-sm text-[#c9d1d9]">{row.feature}</td>
              <td className="py-3 px-4">{renderValue(row.free)}</td>
              <td className="py-3 px-4 bg-[rgba(252,213,53,0.04)]">{renderValue(row.pro)}</td>
              <td className="py-3 px-4">{renderValue(row.enterprise)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
