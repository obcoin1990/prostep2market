'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tradeSchema, type TradeInput } from '@/lib/validation'
import { useState } from 'react'
import { ScreenshotUpload } from './ScreenshotUpload'

const MAJOR_PAIRS = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 
  'AUDUSD', 'USDCAD', 'NZDUSD',
  'EURGBP', 'EURJPY', 'GBPJPY'
]

const EMOTIONAL_STATES = [
  { value: 'calm', label: 'Calm' },
  { value: 'excited', label: 'Excited' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'greedy', label: 'Greedy' },
]

const TRIGGERS = [
  { value: 'FOMO', label: 'FOMO' },
  { value: 'revenge', label: 'Revenge Trading' },
  { value: 'overconfidence', label: 'Overconfidence' },
  { value: 'boredom', label: 'Boredom' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'news', label: 'News Event' },
  { value: 'signal', label: 'Trading Signal' },
  { value: 'other', label: 'Other' },
]

interface TradeFormProps {
  initialData?: Partial<TradeInput>
  onSubmitSuccess?: (trade: any) => void
}

export function TradeForm({ initialData, onSubmitSuccess }: TradeFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [screenshotUrl, setScreenshotUrl] = useState(initialData?.screenshotUrl || '')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    watch,
  } = useForm<TradeInput>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      session: 'london',
      confidenceScore: 3,
      stressScore: 3,
      preTradePlanAdherence: 3,
      ...initialData,
    },
  })

  const onSubmit = async (data: TradeInput) => {
    setSubmitting(true)
    setSubmitError(null)
    
    try {
      // Include screenshot URL if uploaded
      const payload = {
        ...data,
        screenshotUrl: screenshotUrl || undefined,
      }

      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save trade')
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(result.trade)
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  // Watch emotional state for conditional triggers
  const emotionalState = watch('emotionalState')
  const showTriggers = ['frustrated', 'fearful', 'greedy'].includes(emotionalState || '')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Submit Error */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-500 rounded-md">
          <p className="text-red-500 text-sm">{submitError}</p>
        </div>
      )}

      {/* Symbol */}
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium mb-1">
          Symbol <span className="text-red-500">*</span>
        </label>
        <select
          {...register('symbol')}
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="">Select symbol...</option>
          {MAJOR_PAIRS.map(pair => (
            <option key={pair} value={pair}>{pair}</option>
          ))}
        </select>
        {errors.symbol && (
          <p className="text-red-500 text-sm mt-1">{errors.symbol.message}</p>
        )}
      </div>

      {/* Entry/Exit Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="entryPrice" className="block text-sm font-medium mb-1">
            Entry Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.00001"
            {...register('entryPrice', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="1.23456"
          />
          {errors.entryPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.entryPrice.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="exitPrice" className="block text-sm font-medium mb-1">
            Exit Price
          </label>
          <input
            type="number"
            step="0.00001"
            {...register('exitPrice', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="1.23500"
          />
          {errors.exitPrice && (
            <p className="text-red-500 text-sm mt-1">{errors.exitPrice.message}</p>
          )}
        </div>
      </div>

      {/* Stop Loss / Take Profit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="stopLoss" className="block text-sm font-medium mb-1">
            Stop Loss <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.00001"
            {...register('stopLoss', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="1.23300"
          />
          {errors.stopLoss && (
            <p className="text-red-500 text-sm mt-1">{errors.stopLoss.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="takeProfit" className="block text-sm font-medium mb-1">
            Take Profit <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.00001"
            {...register('takeProfit', { valueAsNumber: true })}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="1.23800"
          />
          {errors.takeProfit && (
            <p className="text-red-500 text-sm mt-1">{errors.takeProfit.message}</p>
          )}
        </div>
      </div>

      {/* Lot Size */}
      <div>
        <label htmlFor="lotSize" className="block text-sm font-medium mb-1">
          Lot Size <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          {...register('lotSize', { valueAsNumber: true })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="0.10"
        />
        {errors.lotSize && (
          <p className="text-red-500 text-sm mt-1">{errors.lotSize.message}</p>
        )}
      </div>

      {/* Entry/Exit Times */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="entryTime" className="block text-sm font-medium mb-1">
            Entry Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            {...register('entryTime')}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.entryTime && (
            <p className="text-red-500 text-sm mt-1">{errors.entryTime.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="exitTime" className="block text-sm font-medium mb-1">
            Exit Time
          </label>
          <input
            type="datetime-local"
            {...register('exitTime')}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.exitTime && (
            <p className="text-red-500 text-sm mt-1">{errors.exitTime.message}</p>
          )}
        </div>
      </div>

      {/* Session */}
      <div>
        <label htmlFor="session" className="block text-sm font-medium mb-1">
          Session
        </label>
        <select {...register('session')} className="w-full p-2 border border-gray-300 rounded-md bg-white">
          <option value="asian">Asian</option>
          <option value="london">London</option>
          <option value="newyork">New York</option>
          <option value="sydney">Sydney</option>
        </select>
        <p className="text-gray-500 text-xs mt-1">Leave empty to auto-detect from entry time</p>
      </div>

      {/* Screenshot Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Screenshot
        </label>
        <ScreenshotUpload
          onUploadComplete={(url) => setScreenshotUrl(url)}
          initialUrl={screenshotUrl}
        />
      </div>

      {/* Emotional Tracking Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Emotional State</h3>
        
        {/* Confidence & Stress Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="confidenceScore" className="block text-sm font-medium mb-1">
              Confidence (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              {...register('confidenceScore', { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 - Low</span>
              <span>5 - High</span>
            </div>
          </div>
          <div>
            <label htmlFor="stressScore" className="block text-sm font-medium mb-1">
              Stress Level (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              {...register('stressScore', { valueAsNumber: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 - Calm</span>
              <span>5 - High</span>
            </div>
          </div>
        </div>

        {/* Emotional State */}
        <div className="mt-4">
          <label htmlFor="emotionalState" className="block text-sm font-medium mb-1">
            Emotional State
          </label>
          <select
            {...register('emotionalState')}
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">Select...</option>
            {EMOTIONAL_STATES.map(state => (
              <option key={state.value} value={state.value}>{state.label}</option>
            ))}
          </select>
        </div>

        {/* Triggers (shown when stressed/negative emotion) */}
        {showTriggers && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              What triggered this trade?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TRIGGERS.map(trigger => (
                <label key={trigger.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={trigger.value}
                    {...register('triggers')}
                  />
                  <span className="text-sm">{trigger.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pre-Trade Plan Adherence */}
      <div className="border-t pt-6">
        <label htmlFor="preTradePlanAdherence" className="block text-sm font-medium mb-1">
          Pre-Trade Plan Adherence (1-5)
        </label>
        <input
          type="number"
          min="1"
          max="5"
          {...register('preTradePlanAdherence', { valueAsNumber: true })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 - Ignored plan completely</span>
          <span>5 - Followed plan perfectly</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Any additional notes about this trade..."
        />
        <p className="text-gray-500 text-xs mt-1">Max 2000 characters</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || isFormSubmitting}
        className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:opacity-50"
      >
        {submitting || isFormSubmitting ? 'Saving...' : 'Save Trade'}
      </button>
    </form>
  )
}