'use client'

import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

// ─── Completion Trend ──────────────────────────────────────────
interface TrendProps {
  data: { completedAt: string | null; _count: { completedAt: number } }[]
}

export function CompletionTrendChart({ data }: TrendProps) {
  const formatted = data.map(d => ({
    date:  d.completedAt ? new Date(d.completedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '',
    count: d._count.completedAt,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          name="Completions"
          stroke="#6366f1"
          fill="url(#colorComp)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Top Courses Bar Chart ──────────────────────────────────────
interface TopCoursesProps {
  data: { title: string; _count: { enrollments: number } }[]
}

export function TopCoursesChart({ data }: TopCoursesProps) {
  const formatted = data.map(d => ({
    name:        d.title.length > 20 ? d.title.slice(0, 20) + '…' : d.title,
    enrollments: d._count.enrollments,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={formatted} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 11 }} />
        <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="enrollments" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Active vs Inactive Pie ────────────────────────────────────
interface ActivePieProps {
  active:   number
  inactive: number
}

const PIE_COLORS = ['#6366f1', '#e5e7eb']

export function ActiveUsersPie({ active, inactive }: ActivePieProps) {
  const data = [
    { name: 'Active',   value: active },
    { name: 'Inactive', value: inactive },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i]} />
          ))}
        </Pie>
        <Legend iconType="circle" iconSize={10} />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
