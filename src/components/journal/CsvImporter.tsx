'use client'

import { useState, useCallback, useRef } from 'react'
import Papa from 'papaparse'
import { tradeSchema } from '@/lib/validation'

interface ParsedRow {
  symbol: string
  entry_price: string
  exit_price?: string
  stop_loss: string
  take_profit: string
  lot_size: string
  entry_time: string
  exit_time?: string
  session?: string
}

interface ValidationError {
  row: number
  field: string
  message: string
}

type ImportStep = 'upload' | 'preview' | 'validate' | 'import' | 'complete'

const REQUIRED_COLUMNS = [
  'symbol',
  'entry_price',
  'stop_loss',
  'take_profit',
  'lot_size',
  'entry_time',
]

const EXPECTED_COLUMNS = [
  'symbol',
  'entry_price',
  'exit_price',
  'stop_loss',
  'take_profit',
  'lot_size',
  'entry_time',
  'exit_time',
  'session',
]

interface CsvImporterProps {
  onImportComplete?: (imported: number) => void
}

export function CsvImporter({ onImportComplete }: CsvImporterProps) {
  const [step, setStep] = useState<ImportStep>('upload')
  const [rawData, setRawData] = useState<ParsedRow[]>([])
  const [validation, setValidation] = useState<{ valid: ParsedRow[]; errors: ValidationError[] }>()
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; failed: number; errors: any[] }>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validate columns
  const validateColumns = (headers: string[]): string[] => {
    const missing: string[] = []
    REQUIRED_COLUMNS.forEach(col => {
      if (!headers.includes(col.toLowerCase())) {
        missing.push(col)
      }
    })
    return missing
  }

  // Parse and validate CSV
  const handleFileAccepted = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (header) => header.trim().toLowerCase().replace(' ', '_'),
      complete: (results) => {
        // Check for parsing errors
        if (results.errors.length > 0) {
          alert('CSV parsing error: ' + results.errors[0].message)
          return
        }

        const headers = results.meta.fields || []
        const missing = validateColumns(headers)
        
        if (missing.length > 0) {
          alert('Missing required columns: ' + missing.join(', '))
          return
        }

        setRawData(results.data as ParsedRow[])
        setStep('preview')
      },
      error: (error) => {
        alert('Error parsing CSV: ' + error.message)
      },
    })
  }, [])

  // Validate all rows
  const validateData = useCallback(() => {
    const errors: ValidationError[] = []
    const valid: ParsedRow[] = []

    rawData.forEach((row, index) => {
      // Map to trade format
      const trade = {
        symbol: row.symbol,
        entryPrice: parseFloat(row.entry_price),
        exitPrice: row.exit_price ? parseFloat(row.exit_price) : undefined,
        stopLoss: parseFloat(row.stop_loss),
        takeProfit: parseFloat(row.take_profit),
        lotSize: parseFloat(row.lot_size),
        entryTime: row.entry_time,
        exitTime: row.exit_time || undefined,
        session: row.session as 'asian' | 'london' | 'newyork' | 'sydney' | undefined,
      }

      // Validate with Zod
      const result = tradeSchema.safeParse(trade)
      if (result.success) {
        valid.push(row)
      } else {
        result.error.issues.forEach((issue) => {
          errors.push({
            row: index + 2, // +2 for 1-based and header row
            field: issue.path.join('.'),
            message: issue.message,
          })
        })
      }
    })

    setValidation({ valid, errors })
    setStep('validate')
  }, [rawData])

  // Batch import
  const handleImport = async () => {
    setImporting(true)
    setStep('import')
    
    try {
      const response = await fetch('/api/trades/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation?.valid),
      })

      const result = await response.json()
      
      setImportResult({
        imported: result.imported || 0,
        failed: result.failed || 0,
        errors: result.errors || [],
      })
      
      setStep('complete')
      
      if (onImportComplete) {
        onImportComplete(result.imported || 0)
      }
    } catch (err: any) {
      alert('Import failed: ' + err.message)
      setStep('validate')
    } finally {
      setImporting(false)
    }
  }

  // Reset flow
  const handleReset = () => {
    setStep('upload')
    setRawData([])
    setValidation(undefined)
    setImportResult(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Step */}
      {step === 'upload' && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFileAccepted(e.target.files[0])}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="text-gray-600 mb-2">
              Click to upload CSV file
            </p>
            <p className="text-gray-500 text-sm">
              Required columns: {REQUIRED_COLUMNS.join(', ')}
            </p>
          </label>
        </div>
      )}

      {/* Preview Step */}
      {step === 'preview' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Preview ({rawData.length} rows)
            </h3>
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              &times; Cancel
            </button>
          </div>
          
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  {EXPECTED_COLUMNS.map(col => (
                    <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rawData.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-xs text-gray-500">{i + 2}</td>
                    <td className="px-3 py-2 text-xs">{row.symbol}</td>
                    <td className="px-3 py-2 text-xs">{row.entry_price}</td>
                    <td className="px-3 py-2 text-xs">{row.exit_price || '-'}</td>
                    <td className="px-3 py-2 text-xs">{row.stop_loss}</td>
                    <td className="px-3 py-2 text-xs">{row.take_profit}</td>
                    <td className="px-3 py-2 text-xs">{row.lot_size}</td>
                    <td className="px-3 py-2 text-xs">{row.entry_time}</td>
                    <td className="px-3 py-2 text-xs">{row.exit_time || '-'}</td>
                    <td className="px-3 py-2 text-xs">{row.session || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {rawData.length > 10 && (
            <p className="text-gray-500 text-sm mt-2">
              Showing 10 of {rawData.length} rows
            </p>
          )}

          <button
            onClick={validateData}
            className="mt-4 w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Validate ({rawData.length} rows)
          </button>
        </div>
      )}

      {/* Validate Step */}
      {step === 'validate' && validation && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Validation Results</h3>
            <button
              onClick={handleReset}
              className="text-gray-500 hover:text-gray-700"
            >
              &times; Cancel
            </button>
          </div>
          
          {validation.errors.length === 0 ? (
            <div className="p-4 bg-green-50 border border-green-500 rounded-lg mb-4">
              <p className="text-green-700 font-medium">
                All {validation.valid.length} rows valid
              </p>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-500 rounded-lg mb-4">
              <p className="text-red-700 font-medium">
                {validation.errors.length} errors found
              </p>
              <div className="mt-2 max-h-48 overflow-y-auto">
                {validation.errors.slice(0, 10).map((err, i) => (
                  <p key={i} className="text-sm text-red-600">
                    Row {err.row}, {err.field}: {err.message}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={handleImport}
            disabled={importing || validation.valid.length === 0}
            className="w-full py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            {importing ? 'Importing...' : `Import ${validation.valid.length} trades`}
          </button>
        </div>
      )}

      {/* Import Step */}
      {step === 'import' && (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Importing trades...</p>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && importResult && (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg 
              className="mx-auto h-16 w-16 text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Import Complete</h3>
          <p className="text-gray-600 mb-4">
            {importResult.imported} trades imported successfully
          </p>
          
          {importResult.failed > 0 && (
            <p className="text-red-500 mb-4">
              {importResult.failed} trades failed
            </p>
          )}
          
          <button
            onClick={handleReset}
            className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Import More
          </button>
        </div>
      )}
    </div>
  )
}