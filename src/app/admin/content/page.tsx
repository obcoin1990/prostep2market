import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { FileText, Plus, Calendar, CheckCircle2, Edit3, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminContentPage() {
  const adminUser = await getAdminUser()
  if (!adminUser) redirect('/admin/forbidden')

  const admin = createAdminClient()

  const { data: pages, count, error } = await admin
    .from('content_pages')
    .select('*', { count: 'exact' })
    .order('updated_at', { ascending: false })

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
        Failed to load content: {error.message}
      </div>
    )
  }

  const allPages = pages ?? []
  const published = allPages.filter((p) => p.status === 'Published').length
  const drafts = allPages.filter((p) => p.status === 'Draft').length
  const scheduled = allPages.filter((p) => p.status === 'Scheduled').length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Content CMS</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage website content, blog posts, and landing pages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Pages', value: String(count ?? 0), icon: FileText },
          { label: 'Published', value: String(published), icon: CheckCircle2, color: '#0ecb81' },
          { label: 'Drafts', value: String(drafts), icon: Edit3, color: '#FFC107' },
          { label: 'Scheduled', value: String(scheduled), icon: Calendar, color: '#8A2BE2' },
        ].map((s) => (
          <Card key={s.label} variant="light" className="border border-gray-200 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-700 mt-1" style={s.color ? { color: s.color } : {}}>{s.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card variant="light" className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-gray-700">Content Library</CardTitle>
          <p className="text-xs text-gray-400">All pages, blog posts, and content assets</p>
        </CardHeader>
        <CardContent>
          {allPages.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No content pages yet. Create your first page.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Title</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Type</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-400 text-xs uppercase tracking-wide">Author</th>
                    <th className="text-right py-2 font-medium text-gray-400 text-xs uppercase tracking-wide">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {allPages.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/60 transition-colors cursor-pointer">
                      <td className="py-3 pr-4 font-medium text-gray-700">{p.title}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs text-gray-500">{p.type}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant={p.status === 'Published' ? 'success' : p.status === 'Draft' ? 'default' : p.status === 'Review' ? 'info' : 'warning'}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-xs text-gray-400">{p.author_email ?? '—'}</td>
                      <td className="py-3 text-right text-xs text-gray-400">
                        {new Date(p.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
