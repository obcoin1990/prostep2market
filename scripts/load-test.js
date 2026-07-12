#!/usr/bin/env node
/**
 * ProStep2Market Load Test
 * 
 * Runs concurrent load against key public endpoints using autocannon.
 * 
 * Usage:
 *   1. npm run build && npm run start &
 *   2. sleep 5
 *   3. node scripts/load-test.js
 * 
 * Or with custom options:
 *   AUTOCANNON_CONNECTIONS=100 AUTOCANNON_DURATION=60 node scripts/load-test.js
 */

import autocannon from 'autocannon'

const BASE_URL = process.env.LOAD_TEST_BASE_URL || 'http://localhost:3000'
const CONNECTIONS = parseInt(process.env.AUTOCANNON_CONNECTIONS || '50', 10)
const DURATION = parseInt(process.env.AUTOCANNON_DURATION || '30', 10)
const PIPELINING = parseInt(process.env.AUTOCANNON_PIPELINING || '1', 10)

const endpoints = [
  { name: 'Homepage', path: '/', method: 'GET' },
  { name: 'Pricing', path: '/pricing', method: 'GET' },
  { name: 'Leaderboard', path: '/leaderboard', method: 'GET' },
  { name: 'Blog Index', path: '/resources/blog', method: 'GET' },
  { name: 'API: Leaderboard', path: '/api/leaderboard', method: 'GET' },
  { name: 'API: Analytics Dashboard', path: '/api/analytics/dashboard?days=30', method: 'GET' },
  { name: 'API: MT Status', path: '/api/mt/status', method: 'GET' },
  { name: 'API: Scores', path: '/api/scores', method: 'GET' },
  { name: 'API: Analytics', path: '/api/analytics', method: 'GET' },
]

async function runLoadTest(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`
  
  console.log(`\n🔄 Testing: ${endpoint.name} (${endpoint.method} ${url})`)
  console.log(`   Connections: ${CONNECTIONS} | Duration: ${DURATION}s | Pipelining: ${PIPELINING}`)
  
  const result = await autocannon({
    url,
    method: endpoint.method,
    connections: CONNECTIONS,
    duration: DURATION,
    pipelining: PIPELINING,
    headers: {
      'User-Agent': 'ProStep2Market-LoadTest/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  })
  
  const reqPerSec = result.requests.mean
  const latencyMs = result.latency.mean
  const p99Latency = result.latency.p99
  const errors = result.errors
  const timeouts = result.timeouts
  const non2xx = result.non2xx
  
  console.log(`   ✅ Requests/sec: ${reqPerSec.toFixed(2)}`)
  console.log(`   ⚡ Latency (mean): ${latencyMs.toFixed(2)}ms | p99: ${p99Latency.toFixed(2)}ms`)
  console.log(`   📊 Throughput: ${(result.throughput.mean / 1024 / 1024).toFixed(2)} MB/s`)
  console.log(`   ❌ Errors: ${errors} | Timeouts: ${timeouts} | Non-2xx: ${non2xx}`)
  
  return {
    name: endpoint.name,
    url,
    reqPerSec,
    latencyMs,
    p99Latency,
    errors,
    timeouts,
    non2xx,
    passed: errors === 0 && timeouts === 0 && non2xx === 0,
  }
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════════════╗')
  console.log('║              ProStep2Market Load Test Suite                         ║')
  console.log('╚══════════════════════════════════════════════════════════════════════╝')
  console.log(`\nTarget: ${BASE_URL}`)
  console.log(`Config: ${CONNECTIONS} concurrent connections, ${DURATION}s duration`)
  
  const results = []
  
  for (const endpoint of endpoints) {
    try {
      const result = await runLoadTest(endpoint)
      results.push(result)
    } catch (err) {
      console.error(`   💥 Failed: ${err.message}`)
      results.push({
        name: endpoint.name,
        url: `${BASE_URL}${endpoint.path}`,
        passed: false,
        error: err.message,
      })
    }
  }
  
  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════════════╗')
  console.log('║                         SUMMARY                                     ║')
  console.log('╚══════════════════════════════════════════════════════════════════════╝')
  
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  
  console.log(`\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`)
  
  for (const r of results) {
    const status = r.passed ? '✅ PASS' : '❌ FAIL'
    const metrics = r.reqPerSec ? ` | ${r.reqPerSec.toFixed(1)} req/s | ${r.latencyMs.toFixed(1)}ms` : ''
    console.log(`  ${status} ${r.name}${metrics}`)
    if (r.error) console.log(`      Error: ${r.error}`)
  }
  
  if (failed > 0) {
    console.log('\n⚠️  Some endpoints failed. Check server logs for details.')
    process.exit(1)
  } else {
    console.log('\n🎉 All endpoints passed load test!')
    process.exit(0)
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})