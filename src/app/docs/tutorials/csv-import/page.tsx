'use client'

import { Upload } from 'lucide-react'

const CSV_COLUMNS = [
  { header: 'symbol', description: 'Ticker symbol of the traded instrument (e.g., EURUSD, AAPL, BTCUSD)' },
  { header: 'action', description: 'Trade direction: buy or sell' },
  { header: 'entry_price', description: 'Price at which the trade was opened' },
  { header: 'exit_price', description: 'Price at which the trade was closed' },
  { header: 'volume', description: 'Trade size in lots or units' },
  { header: 'entry_time', description: 'Open timestamp in YYYY-MM-DD HH:mm:ss format' },
  { header: 'exit_time', description: 'Close timestamp in YYYY-MM-DD HH:mm:ss format' },
  { header: 'pnl', description: 'Profit or loss in account currency (positive or negative number)' },
  { header: 'commission', description: 'Total commission charged for the trade (optional)' },
  { header: 'swap', description: 'Overnight swap/rollover fee (optional)' },
  { header: 'comment', description: 'Optional note or trade identifier (optional)' },
]

export default function CsvImportGuide() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <Upload className="h-6 w-6 text-[#fcd535]" />
        <h1 className="text-3xl font-bold text-white">CSV Import Guide</h1>
      </div>
      <p className="text-white/60 mb-10 max-w-2xl">
        Import your trade history from any broker or platform using our CSV import tool. Follow this
        guide to format your file correctly and map your fields.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Prerequisites</h2>
      <ul className="list-disc list-inside text-white/60 space-y-1 mb-8">
        <li>A CSV file containing your trade history (exported from your broker)</li>
        <li>File must be in UTF-8 encoding</li>
        <li>Maximum file size: 10 MB</li>
        <li>Maximum 10,000 rows per import</li>
      </ul>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Format Requirements</h2>
      <p className="text-white/60 mb-4">
        Your CSV file should include a header row. Below are the supported columns:
      </p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-sm font-semibold text-white py-3 pr-4">Column Header</th>
              <th className="text-left text-sm font-semibold text-white py-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {CSV_COLUMNS.map((col) => (
              <tr key={col.header} className="border-b border-white/10">
                <td className="py-3 pr-4">
                  <code className="text-sm text-[#fcd535]">{col.header}</code>
                </td>
                <td className="py-3 text-sm text-white/60">{col.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Import Steps</h2>
      <ol className="list-decimal list-inside text-white/60 space-y-2 mb-8">
        <li>Navigate to <strong className="text-white">Settings &rarr; Import Trades</strong> in your dashboard.</li>
        <li>Click <strong className="text-white">Choose File</strong> and select your CSV file.</li>
        <li>The system will preview the first 5 rows of your data.</li>
        <li>Map your CSV columns to the required fields using the dropdown selectors.</li>
        <li>Review the mapping summary and click <strong className="text-white">Import</strong>.</li>
        <li>Wait for the import to complete. You will receive a confirmation with the number of trades imported.</li>
      </ol>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Mapping Fields</h2>
      <p className="text-white/60 mb-4">
        If your CSV uses different column names, use the mapping interface to match your columns to
        ProStep2Market fields. The system remembers your mappings for future imports.
      </p>
      <div className="border-l-4 border-[#fcd535] bg-[#fcd535]/5 p-4 rounded mb-8">
        <p className="text-white/80 text-sm">
          <span className="font-semibold text-[#fcd535]">Tip:</span> If your broker exports dates in a
          different format, use the date format option during mapping. Supported formats:
          MM/dd/yyyy, dd/MM/yyyy, yyyy-MM-dd.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Validation</h2>
      <p className="text-white/60 mb-4">
        Before finalizing, the system validates every row. Common validation checks include:
      </p>
      <ul className="list-disc list-inside text-white/60 space-y-1 mb-8">
        <li>All required fields are present and non-empty</li>
        <li>Prices and P&amp;L are valid numbers</li>
        <li>Timestamps are in a recognized date format</li>
        <li>Action is either &quot;buy&quot; or &quot;sell&quot;</li>
        <li>Volume is a positive number</li>
      </ul>
      <p className="text-white/60 mb-8">
        Rows that fail validation are listed in an error report. You can download the error report,
        fix the issues, and re-upload the corrected rows.
      </p>

      <h2 className="text-xl font-semibold text-white mt-10 mb-3">Troubleshooting</h2>
      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">File not uploading</h3>
          <p className="text-sm text-white/60">Check that your file is under 10 MB and in CSV format with a .csv extension.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">No data preview shown</h3>
          <p className="text-sm text-white/60">Ensure your CSV has a header row and at least one data row. Verify the file is UTF-8 encoded.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-white font-medium mb-1">Date parsing errors</h3>
          <p className="text-sm text-white/60">Select the correct date format in the mapping step. If your dates include timestamps, ensure they use HH:mm:ss notation.</p>
        </div>
      </div>
    </div>
  )
}
