'use client'

const VERSIONS = [
  {
    version: 'v2.4.0',
    date: 'July 1, 2026',
    changes: [
      'Added behavioral analytics endpoint: GET /analytics/behavioral.',
      'New trade filtering parameters: by_entry_date, by_exit_date, by_tags.',
      'Webhook signatures now use HMAC-SHA256 with a configurable secret.',
      'Deprecated v1 SDK load method — migrate to new SDK constructor.',
      'Rate limits increased from 60 to 100 req/min for standard tier.',
    ],
  },
  {
    version: 'v2.3.0',
    date: 'April 15, 2026',
    changes: [
      'Introduced webhook retry policy with exponential backoff (up to 5 retries).',
      'Added PUT /trades/:id support for partial trade updates.',
      'New pagination metadata in list responses: total, page, has_more.',
      'Python SDK now supports async context manager for connection pooling.',
      'Improved error messages for rate limit violations with Retry-After header.',
    ],
  },
  {
    version: 'v2.2.0',
    date: 'January 20, 2026',
    changes: [
      'Launched analytics endpoints: summary, performance, and risk.',
      'Added time-series data support with daily, weekly, and monthly granularity.',
      'New JavaScript SDK with full TypeScript definitions and ESM support.',
      'API keys now support scoped permissions: read, write, admin.',
      'OpenAPI specification published at /docs/api/openapi.json.',
    ],
  },
  {
    version: 'v2.1.0',
    date: 'October 5, 2025',
    changes: [
      'Added DELETE /trades/:id endpoint for permanent trade removal.',
      'JWT tokens now include user role in payload for authorization checks.',
      'Introduced test mode for API keys — use sk_test_ prefix for sandbox.',
      'Webhook test event (webhook.test) for endpoint verification.',
      'New IP allowlist support for admin API access restrictions.',
    ],
  },
  {
    version: 'v2.0.0',
    date: 'July 1, 2025',
    changes: [
      'Major API overhaul with RESTful resource-based endpoints.',
      'Replaced /api/v1/getTrades with GET /trades, POST /trades, GET /trades/:id.',
      'Authentication migrated from query parameters to Authorization header.',
      'Standardized error response format across all endpoints.',
      'Official JavaScript and Python SDKs released.',
      'Rate limiting introduced with per-key tracking and headers.',
      'Base URL changed to https://api.prostep2market.com/v1.',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-4">API Changelog</h1>
      <p className="text-white/60 mb-8">
        Track changes, new features, and breaking updates to the ProStep2Market API.
      </p>

      <div className="space-y-8">
        {VERSIONS.map((v) => (
          <div key={v.version} className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#fcd535]/20 text-[#fcd535] border border-[#fcd535]/30">
                {v.version}
              </span>
              <span className="text-white/60 text-sm">{v.date}</span>
            </div>
            <ul className="space-y-2">
              {v.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-white/60">
                  <span className="text-[#fcd535] mt-1.5 shrink-0">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
