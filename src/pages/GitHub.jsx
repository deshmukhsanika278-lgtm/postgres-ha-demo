import {
  Code2,
  ExternalLink,
  GitBranch,
  Database,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react'

export default function GitHub() {
  return (
    <div className="app-shell">
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">07 / SOURCE CODE</span>
            <h2>GitHub Repository</h2>
          </div>
          <span className="status-pill">
            <i />
            PROJECT WORKSPACE
          </span>
        </div>

        <p className="section-description">
          Explore the implementation of the PostgreSQL High Availability
          and Recovery project, including the database cluster, automatic
          failover configuration, backend API and frontend dashboard.
        </p>

        <div className="github-hero-card">
          <div className="github-card-icon">
            <Code2 size={34} />
          </div>

          <span className="section-kicker">PROJECT REPOSITORY</span>
          <h3>PostgreSQL HA & Recovery</h3>

          <p>
            A fault-tolerant PostgreSQL architecture using streaming
            replication, Patroni, etcd and HAProxy, with backup and
            restoration capabilities.
          </p>

          <div className="github-feature-list">
            <div>
              <Database size={19} />
              <span>3-node PostgreSQL cluster</span>
            </div>
            <div>
              <ShieldCheck size={19} />
              <span>Automatic failover with Patroni</span>
            </div>
            <div>
              <GitBranch size={19} />
              <span>Replication and recovery testing</span>
            </div>
          </div>

          <div className="github-action-area">
            <a
              className="primary-button"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={18} />
              Open GitHub
              <ArrowUpRight size={17} />
            </a>
          </div>

          <p className="github-note">
            Replace the GitHub homepage link with your actual repository URL
            after publishing the project.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PROJECT DOCUMENTATION</span>
            <h2>What the repository contains</h2>
          </div>
        </div>

        <div className="technology-grid">
          <article className="technology-card">
            <Database size={22} />
            <h3>Database infrastructure</h3>
            <p>
              PostgreSQL nodes, streaming replication and cluster
              configuration.
            </p>
          </article>

          <article className="technology-card">
            <ShieldCheck size={22} />
            <h3>High availability</h3>
            <p>
              Patroni leader management, etcd coordination and HAProxy
              routing.
            </p>
          </article>

          <article className="technology-card">
            <Code2 size={22} />
            <h3>Application</h3>
            <p>
              React frontend and Node.js backend for monitoring cluster
              status and database records.
            </p>
          </article>

          <article className="technology-card">
            <GitBranch size={22} />
            <h3>Backup and recovery</h3>
            <p>
              PostgreSQL logical backups and tested restoration workflow.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}
