import MetricCard from '../components/MetricCard'
import { money } from '../utils/api'

export default function AdminDashboard({ summary, users }) {
  return (
    <main className="workspace">
      <section className="section-head">
        <div>
          <span className="eyebrow">Super admin</span>
          <h2>Platform integrity and oversight</h2>
        </div>
      </section>
      <section className="metrics">
        <MetricCard label="Revenue" value={money(summary?.revenue)} sub="All tenants" />
        <MetricCard label="AOV" value={money(summary?.averageOrderValue)} sub="Average order value" />
        <MetricCard label="Users" value={summary?.users || users.length} sub="RBAC accounts" />
        <MetricCard label="Low Stock" value={summary?.lowStock || 0} sub="Needs vendor attention" />
      </section>
      <section className="analytics-grid">
        <div className="panel">
          <span className="eyebrow">Payment methods</span>
          <div className="mini-bars">
            {Object.entries(summary?.byPaymentMethod || {}).map(([method, count]) => (
              <div key={method}>
                <span>{method.replace('_', ' ')}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <span className="eyebrow">Fulfillment</span>
          <div className="mini-bars">
            {Object.entries(summary?.byFulfillment || {}).map(([status, count]) => (
              <div key={status}>
                <span>{status}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <span className="eyebrow">Top categories</span>
          <div className="mini-bars">
            {(summary?.topCategories || []).map((item) => (
              <div key={item.category}>
                <span>{item.category}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="two-col">
        <div className="panel">
          <span className="eyebrow">Users</span>
          <div className="table">
            {users.map((user) => (
              <div className="table-row" key={user.id || user._id}>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <span>{user.role}</span>
                <span>{user.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
