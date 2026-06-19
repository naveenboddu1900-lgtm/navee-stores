import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { money } from '../utils/api'

function shortDate(value) {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AnalyticsCharts({ summary }) {
  const chart = summary?.chart || []
  const fulfillment = summary?.fulfillment || []

  return (
    <section className="analytics-grid">
      <div className="analytics-panel">
        <div className="panel-title">
          <span className="eyebrow">Revenue</span>
          <strong>7-day paid revenue</strong>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chart} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2f6f6a" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2f6f6a" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e5ded2" vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} width={52} />
            <Tooltip formatter={(value) => money(value)} labelFormatter={shortDate} />
            <Area type="monotone" dataKey="revenue" stroke="#2f6f6a" strokeWidth={2} fill="url(#revenueFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="analytics-panel">
        <div className="panel-title">
          <span className="eyebrow">Volume</span>
          <strong>Order flow by day</strong>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#e5ded2" vertical={false} />
            <XAxis dataKey="date" tickFormatter={shortDate} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={38} />
            <Tooltip labelFormatter={shortDate} />
            <Bar dataKey="orders" fill="#b46a3c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="analytics-panel analytics-panel--wide">
        <div className="panel-title">
          <span className="eyebrow">Fulfillment</span>
          <strong>Current order status</strong>
        </div>
        <div className="status-bars">
          {fulfillment.length ? fulfillment.map((item) => (
            <div className="status-bar" key={item.name}>
              <span>{item.name}</span>
              <strong style={{ width: `${Math.max(8, item.value * 18)}%` }}>{item.value}</strong>
            </div>
          )) : <p className="muted">No fulfillment data yet.</p>}
        </div>
      </div>
    </section>
  )
}
