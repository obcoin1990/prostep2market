import { createClient } from '@/lib/supabase/server'
import { Timeline } from '@/components/journal/Timeline'

export default async function JournalPage() {
  // Check authentication and fetch initial trades server-side
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let trades: any[] = []
  let count = 0

  if (user) {
    // Fetch initial trades (page 1)
    const { data, count: totalCount } = await supabase
      .from('trades')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('entry_time', { ascending: false })
      .range(0, 19)
    
    trades = data || []
    count = totalCount || 0
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trade Journal</h1>
          <p className="text-gray-600">
            Track and analyze your trading performance
          </p>
        </div>
        <div className="flex gap-2">
          <a 
            href="/journal/import"
            className="py-2 px-4 border border-gray-800 text-gray-800 text-sm font-medium rounded hover:bg-gray-50"
          >
            Import CSV
          </a>
          <a 
            href="/journal/entry"
            className="py-2 px-4 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600"
          >
            + Log Trade
          </a>
        </div>
      </div>
      
      {/* Best Practices Reminder */}
      <div className="p-4 bg-green-50 border border-green-500 rounded-lg mb-6">
        <h3 className="font-medium text-green-700 mb-1">Best Practices</h3>
        <ul className="text-sm text-gray-600 list-disc list-inside">
          <li>Log trades within 24 hours</li>
          <li>Attach screenshots for losing trades</li>
          <li>Rate pre-trade plan adherence on every trade</li>
        </ul>
      </div>
      
      {/* Timeline */}
      <Timeline 
        initialTrades={trades} 
        initialPage={1}
        initialTotal={count}
      />
    </main>
  )
}