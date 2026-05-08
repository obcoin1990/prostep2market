"use client"

import { Check, X, Minus } from "lucide-react"

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
            <Check className="w-5 h-5 text-[#2E7D32]" />
          </div>
        )
      case "no":
        return (
          <div className="flex justify-center">
            <X className="w-5 h-5 text-gray-300" />
          </div>
        )
      case "limited":
        return (
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 font-medium">Limited</span>
          </div>
        )
      case "preview":
        return (
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 font-medium">Preview</span>
          </div>
        )
      default:
        return <span className="text-sm text-gray-700">{value}</span>
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-semibold text-[#0B0B0B] w-1/4">
              Feature
            </th>
            <th className="text-center py-4 px-4 font-semibold text-[#0B0B0B]">
              Free
            </th>
            <th className="text-center py-4 px-4 font-semibold text-[#E53935]">
              Pro
            </th>
            <th className="text-center py-4 px-4 font-semibold text-[#0B0B0B]">
              Enterprise
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, index) => (
            <tr
              key={index}
              className={`border-b border-gray-100 ${
                index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
              }`}
            >
              <td className="py-3 px-4 text-sm text-gray-700">{row.feature}</td>
              <td className="py-3 px-4">{renderValue(row.free)}</td>
              <td className="py-3 px-4 bg-red-50/30">{renderValue(row.pro)}</td>
              <td className="py-3 px-4">{renderValue(row.enterprise)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
