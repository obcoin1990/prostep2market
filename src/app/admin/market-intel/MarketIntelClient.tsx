'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
  Globe,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Newspaper,
  Settings,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Post {
  id: string
  title: string
  content: string
  category: string
  currency_pairs: string[]
  impact: string
  source: string
  external_url: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

interface Config {
  id?: string
  provider: string
  api_key: string
  api_endpoint: string
  refresh_interval_minutes: number
  active: boolean
  updated_at?: string
}

interface Props {
  initialPosts: Post[]
  initialConfig: Config | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['general', 'forex', 'session', 'volatility', 'news', 'alert']
const IMPACTS = ['low', 'medium', 'high']
const PROVIDERS = ['alpha_vantage', 'fxstreet', 'newsapi', 'custom']

// ─── Impact badge ─────────────────────────────────────────────────────────────

function impactClass(impact: string) {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-700'
    case 'medium': return 'bg-amber-100 text-amber-700'
    case 'low': return 'bg-emerald-100 text-emerald-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function categoryClass(category: string) {
  const map: Record<string, string> = {
    general: 'bg-gray-100 text-gray-700',
    forex: 'bg-blue-100 text-blue-700',
    session: 'bg-violet-100 text-violet-700',
    volatility: 'bg-orange-100 text-orange-700',
    news: 'bg-teal-100 text-teal-700',
    alert: 'bg-red-100 text-red-700',
  }
  return map[category] ?? 'bg-gray-100 text-gray-700'
}

// ─── Post Form ────────────────────────────────────────────────────────────────

interface PostFormData {
  title: string
  content: string
  category: string
  impact: string
  currency_pairs_raw: string
  source: string
  external_url: string
  published: boolean
}

function emptyPostForm(): PostFormData {
  return {
    title: '',
    content: '',
    category: 'general',
    impact: 'medium',
    currency_pairs_raw: '',
    source: '',
    external_url: '',
    published: false,
  }
}

function postToFormData(post: Post): PostFormData {
  return {
    title: post.title,
    content: post.content,
    category: post.category,
    impact: post.impact,
    currency_pairs_raw: (post.currency_pairs ?? []).join(', '),
    source: post.source ?? '',
    external_url: post.external_url ?? '',
    published: post.published,
  }
}

function PostForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial?: Partial<PostFormData>
  onSave: (data: PostFormData) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<PostFormData>({ ...emptyPostForm(), ...initial })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Post title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.impact}
            onChange={(e) => setForm((f) => ({ ...f, impact: e.target.value }))}
          >
            {IMPACTS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency Pairs (comma-separated)</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.currency_pairs_raw}
            onChange={(e) => setForm((f) => ({ ...f, currency_pairs_raw: e.target.value }))}
            placeholder="EUR/USD, GBP/USD"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.source}
            onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
            placeholder="Reuters, Bloomberg…"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">External URL</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
            value={form.external_url}
            onChange={(e) => setForm((f) => ({ ...f, external_url: e.target.value }))}
            placeholder="https://…"
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="published"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 accent-[#E53935]"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
        <textarea
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Post content…"
        />
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          <X className="h-4 w-4 mr-1" /> Cancel
        </Button>
        <Button
          onClick={() => onSave(form)}
          disabled={loading || !form.title || !form.content}
          className="bg-[#E53935] hover:bg-[#C62828] text-white"
        >
          {loading ? 'Saving…' : 'Save Post'}
        </Button>
      </div>
    </div>
  )
}

// ─── Config Tab ───────────────────────────────────────────────────────────────

const defaultConfig: Config = {
  provider: 'newsapi',
  api_key: '',
  api_endpoint: '',
  refresh_interval_minutes: 60,
  active: false,
}

function ConfigTab({ initialConfig }: { initialConfig: Config | null }) {
  const [config, setConfig] = useState<Config>(initialConfig ?? defaultConfig)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/market-intel/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: config.provider,
          api_key: config.api_key,
          api_endpoint: config.api_endpoint,
          refresh_interval_minutes: config.refresh_interval_minutes,
          active: config.active,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setConfig(json.data)
        toast.success('API config saved')
      } else {
        toast.error(json.error ?? 'Failed to save config')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest() {
    if (!config.api_endpoint && !config.api_key) {
      toast.error('Provide at least an API endpoint or key before testing')
      return
    }
    setTesting(true)
    setTestResult(null)
    try {
      // Quick ping to the configured endpoint
      const endpoint = config.api_endpoint || 'https://httpbin.org/get'
      const res = await fetch(endpoint, { method: 'GET', signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        setTestResult({ ok: true, message: `Connection successful (HTTP ${res.status})` })
        toast.success('Connection test passed')
      } else {
        setTestResult({ ok: false, message: `Received HTTP ${res.status}` })
        toast.error(`Connection test failed: HTTP ${res.status}`)
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setTestResult({ ok: false, message: msg })
      toast.error(`Connection test failed: ${msg}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Market Data API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              value={config.provider}
              onChange={(e) => setConfig((c) => ({ ...c, provider: e.target.value }))}
            >
              {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Interval (minutes)</label>
            <input
              type="number"
              min={1}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              value={config.refresh_interval_minutes}
              onChange={(e) => setConfig((c) => ({ ...c, refresh_interval_minutes: Number(e.target.value) }))}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <div className="flex">
              <input
                type={showKey ? 'text' : 'password'}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
                value={config.api_key}
                onChange={(e) => setConfig((c) => ({ ...c, api_key: e.target.value }))}
                placeholder="sk-…"
              />
              <button
                type="button"
                className="border border-l-0 border-gray-300 rounded-r-md px-3 hover:bg-gray-50"
                onClick={() => setShowKey((v) => !v)}
              >
                {showKey ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Endpoint</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]"
              value={config.api_endpoint}
              onChange={(e) => setConfig((c) => ({ ...c, api_endpoint: e.target.value }))}
              placeholder="https://api.example.com/v1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active-toggle"
            checked={config.active}
            onChange={(e) => setConfig((c) => ({ ...c, active: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 accent-[#E53935]"
          />
          <label htmlFor="active-toggle" className="text-sm font-medium text-gray-700">
            Active (enable automatic data fetching)
          </label>
        </div>

        {testResult && (
          <Alert className={testResult.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}>
            {testResult.ok ? <Wifi className="h-4 w-4 inline mr-2" /> : <WifiOff className="h-4 w-4 inline mr-2" />}
            {testResult.message}
          </Alert>
        )}

        {config.updated_at && (
          <p className="text-xs text-gray-400">Last updated: {new Date(config.updated_at).toLocaleString()}</p>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleTest}
            disabled={testing || saving}
            variant="outline"
            className="border-[#E53935] text-[#E53935] hover:bg-[#E53935]/5"
          >
            {testing ? 'Testing…' : <><Wifi className="h-4 w-4 mr-1" /> Test Connection</>}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || testing}
            className="bg-[#E53935] hover:bg-[#C62828] text-white"
          >
            {saving ? 'Saving…' : <><Save className="h-4 w-4 mr-1" /> Save Config</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Client ──────────────────────────────────────────────────────────────

export function MarketIntelClient({ initialPosts, initialConfig }: Props) {
  const [tab, setTab] = useState('posts')
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [postFormLoading, setPostFormLoading] = useState(false)

  function parseCurrencyPairs(raw: string): string[] {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  async function handleCreatePost(data: PostFormData) {
    setPostFormLoading(true)
    try {
      const res = await fetch('/api/admin/market-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          category: data.category,
          impact: data.impact,
          currency_pairs: parseCurrencyPairs(data.currency_pairs_raw),
          source: data.source,
          external_url: data.external_url,
          published: data.published,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setPosts((prev) => [json.data, ...prev])
        setShowPostForm(false)
        toast.success('Post created')
      } else {
        toast.error(json.error ?? 'Failed to create post')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setPostFormLoading(false)
    }
  }

  async function handleUpdatePost(data: PostFormData) {
    if (!editingPost) return
    setPostFormLoading(true)
    try {
      const res = await fetch(`/api/admin/market-intel/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          category: data.category,
          impact: data.impact,
          currency_pairs: parseCurrencyPairs(data.currency_pairs_raw),
          source: data.source,
          external_url: data.external_url,
          published: data.published,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? json.data : p)))
        setEditingPost(null)
        toast.success('Post updated')
      } else {
        toast.error(json.error ?? 'Failed to update post')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setPostFormLoading(false)
    }
  }

  async function handleDeletePost(id: string) {
    if (!confirm('Delete this post?')) return
    try {
      const res = await fetch(`/api/admin/market-intel/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        toast.success('Post deleted')
      } else {
        toast.error(json.error ?? 'Failed to delete post')
      }
    } catch {
      toast.error('Network error')
    }
  }

  async function handleTogglePublished(post: Post) {
    try {
      const res = await fetch(`/api/admin/market-intel/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          category: post.category,
          impact: post.impact,
          currency_pairs: post.currency_pairs,
          source: post.source,
          external_url: post.external_url,
          published: !post.published,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? json.data : p)))
        toast.success(json.data.published ? 'Post published' : 'Post unpublished')
      } else {
        toast.error(json.error ?? 'Failed to update post')
      }
    } catch {
      toast.error('Network error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#E53935]/10 rounded-lg">
          <Globe className="h-6 w-6 text-[#E53935]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0A0F1C]">Market Intelligence Manager</h1>
          <p className="text-sm text-gray-500">Manage market posts and API configuration</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="posts">
            <Newspaper className="h-4 w-4 mr-2" /> Posts
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" /> API Config
          </TabsTrigger>
        </TabsList>

        {/* ── Posts Tab ── */}
        <TabsContent value="posts">
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Market Intelligence Posts</CardTitle>
              <Button
                className="bg-[#E53935] hover:bg-[#C62828] text-white"
                onClick={() => { setShowPostForm(true); setEditingPost(null) }}
              >
                <Plus className="h-4 w-4 mr-1" /> New Post
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showPostForm && !editingPost && (
                <PostForm
                  onSave={handleCreatePost}
                  onCancel={() => setShowPostForm(false)}
                  loading={postFormLoading}
                />
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Impact</th>
                      <th className="text-left py-3 px-4">Pairs</th>
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-center py-3 px-4">Published</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-400">
                          No posts yet. Create the first one.
                        </td>
                      </tr>
                    )}
                    {posts.map((post) => (
                      <>
                        <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-[#0A0F1C] max-w-[200px] truncate">{post.title}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryClass(post.category)}`}>
                              {post.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${impactClass(post.impact)}`}>
                              {post.impact}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {(post.currency_pairs ?? []).slice(0, 2).map((pair) => (
                                <span key={pair} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                  {pair}
                                </span>
                              ))}
                              {(post.currency_pairs ?? []).length > 2 && (
                                <span className="text-xs text-gray-400">+{(post.currency_pairs ?? []).length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 max-w-[100px] truncate">{post.source || '—'}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleTogglePublished(post)}
                              className="focus:outline-none"
                              title={post.published ? 'Click to unpublish' : 'Click to publish'}
                            >
                              {post.published ? (
                                <Eye className="h-4 w-4 text-emerald-600 mx-auto" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400 mx-auto" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                            {post.published_at
                              ? new Date(post.published_at).toLocaleDateString()
                              : new Date(post.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                className="h-8 px-3 text-xs"
                                onClick={() => {
                                  setEditingPost(post)
                                  setShowPostForm(false)
                                }}
                              >
                                <Pencil className="h-3 w-3 mr-1" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="h-8 px-3 text-xs text-[#E53935] border-[#E53935] hover:bg-[#E53935]/5"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {editingPost?.id === post.id && (
                          <tr key={`${post.id}-edit`}>
                            <td colSpan={8} className="py-2 px-4">
                              <PostForm
                                initial={postToFormData(editingPost)}
                                onSave={handleUpdatePost}
                                onCancel={() => setEditingPost(null)}
                                loading={postFormLoading}
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Config Tab ── */}
        <TabsContent value="config">
          <ConfigTab initialConfig={initialConfig} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
