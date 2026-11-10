import { Activity, Database, RefreshCw } from 'lucide-react'
import LiveCluster from '../LiveCluster'

export default function Dashboard() {
  return (
    <div className="app-shell">
      <section className="section dashboard-page">
        <div className="section-heading">
          <div>
            <span className="section-kicker">02 / LIVE MONITORING</span>
            <h2>Cluster Dashboard</h2>
          </div>

          <span className="status-pill">
            <i /> LIVE MONITORING
          </span>
        </div>

        <p className="section-description">
          Monitor PostgreSQL node roles, cluster health and database records.
          The dashboard fetches information from your Node.js backend and
          PostgreSQL cluster.
        </p>

        <div className="dashboard-info-grid">
          <article className="dashboard-info-card">
            <Database size={21} />
            <div>
              <strong>3 PostgreSQL nodes</strong>
              <small>One primary and two replicas</small>
            </div>
          </article>

          <article className="dashboard-info-card">
            <Activity size={21} />
            <div>
              <strong>Automatic health checks</strong>
              <small>Cluster information refreshed periodically</small>
            </div>
          </article>

          <article className="dashboard-info-card">
            <RefreshCw size={21} />
            <div>
              <strong>API-connected status</strong>
              <small>Data supplied by the Express backend</small>
            </div>
          </article>
        </div>

        <LiveCluster />
      </section>
    </div>
  )
}
