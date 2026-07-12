'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface Step {
  id: string
  title: string
  description?: string
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  className?: string
  variant?: "horizontal" | "vertical"
}

const Stepper = ({ steps, currentStep, onStepClick, className, variant = "horizontal" }: StepperProps) => {
  return (
    <div
      className={cn(
        variant === "horizontal"
          ? "flex items-center"
          : "flex flex-col gap-0",
        className
      )}
      role="navigation"
      aria-label="Progress"
    >
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep
        const isUpcoming = i > currentStep

        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              "flex items-center gap-3",
              variant === "vertical" && "mb-0"
            )}>
              <button
                type="button"
                disabled={isUpcoming && !onStepClick}
                onClick={() => onStepClick?.(i)}
                aria-label={`Step ${i + 1}${isCompleted ? ' - completed' : isCurrent ? ' - current' : ''}`}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium shrink-0 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fcd535]/60",
                  isCompleted && "bg-[#0ecb81] text-white",
                  isCurrent && "bg-[#fcd535] text-[#181a20]",
                  isUpcoming && "bg-[#2b3139] text-[#848e9c]",
                  onStepClick && !isUpcoming && "cursor-pointer hover:opacity-80"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>
              {(variant === "vertical" || isCurrent) && (
                <div className={cn(variant === "vertical" ? "block" : "hidden group-hover:block")}>
                  <div className={cn("text-sm", isCurrent ? "text-white font-medium" : "text-[#848e9c]")}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-[#9ea3ad]">{step.description}</div>
                  )}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  variant === "horizontal"
                    ? "flex-1 h-0.5 mx-2"
                    : "w-0.5 h-6 ml-4",
                  isCompleted ? "bg-[#0ecb81]" : "bg-[#2b3139]"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export interface WizardProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  className?: string
}

const Wizard = ({ steps, currentStep, onStepChange, children, className }: WizardProps) => {
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className={cn("space-y-6", className)}>
      <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepChange} />
      <div className="rounded-xl border border-[#2b3139] bg-[#1e2329] p-6">
        {children}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onStepChange(currentStep - 1)}
          className="px-4 py-2 text-sm rounded-lg text-white/80 bg-[#2b3139] hover:bg-[#3a4250] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>
        <span className="text-xs text-[#848e9c]">
          Step {currentStep + 1} of {steps.length}
        </span>
        <button
          type="button"
          disabled={isLast}
          onClick={() => onStepChange(currentStep + 1)}
          className="px-4 py-2 text-sm rounded-lg bg-[#fcd535] text-[#181a20] font-medium hover:bg-[#f0b90b] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export { Stepper, Wizard }
