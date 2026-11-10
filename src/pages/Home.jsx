import { Link } from 'react-router-dom'
import {
  Database,
  Network,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> DATABASE RELIABILITY ENGINEERING
          </div>

          <h1>
            PostgreSQL High Availability <span>& Recovery</span>
          </h1>

          <p className="hero-description">
            A fault-tolerant PostgreSQL cluster with automated failover,
            streaming replication, HAProxy routing and MinIO-based backup
            recovery.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/architecture">
              Explore architecture <span>↗</span>
            </Link>

            <Link className="secondary-button" to="/dashboard">
              View live dashboard
            </Link>
          </div>

          <p className="honesty-note">
            ● Local Docker-based implementation · Results verified on 10 Nov 2026
          </p>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />

          <div className="database-core">
            <span className="db-symbol">◈</span>
            <strong>POSTGRES</strong>
            <small>HIGH AVAILABILITY</small>
          </div>

          <div className="orbit-tag tag-top">PATRONI</div>
          <div className="orbit-tag tag-left">ETCD</div>
          <div className="orbit-tag tag-right">MINIO</div>
          <div className="orbit-tag tag-bottom">HAPROXY</div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Project metrics">
        <article className="metric-card">
          <span className="metric-icon purple">
            <Database size={20} />
          </span>
          <p>POSTGRESQL NODES</p>
          <strong>03</strong>
          <small>1 primary + 2 replicas</small>
        </article>

        <article className="metric-card">
          <span className="metric-icon green">
            <Clock size={20} />
          </span>
          <p>OBSERVED FAILOVER</p>
          <strong>~10 <em>sec</em></strong>
          <small>Includes container stop operation</small>
        </article>

        <article className="metric-card">
          <span className="metric-icon blue">
            <Network size={20} />
          </span>
          <p>LATEST BACKUP</p>
          <strong>~80 <em>KB</em></strong>
          <small>81,382 bytes · MinIO verified</small>
        </article>

        <article className="metric-card">
          <span className="metric-icon orange">
            <CheckCircle2 size={20} />
          </span>
          <p>RECOVERY TEST</p>
          <strong>Passed</strong>
          <small>Dropped table data restored</small>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PROJECT OVERVIEW</span>
            <h2>Built for database resilience</h2>
          </div>
        </div>

        <p className="section-description">
          This project demonstrates how a PostgreSQL cluster can maintain
          database availability when a primary node fails, and how backed-up
          data can be restored after accidental deletion.
        </p>

        <div className="closing-banner">
          <div>
            <span className="section-kicker">PROJECT OUTCOME</span>
            <h2>Resilience tested. Recovery verified.</h2>
            <p>
              Demonstrating automated failover, replica rejoining, backup
              validation and table-level recovery in a local three-node
              PostgreSQL environment.
            </p>
            <Link className="primary-button" to="/failover-recovery">
              View test evidence <ArrowUpRight size={16} />
            </Link>
          </div>

          <span className="closing-symbol">
            <ShieldCheck size={54} />
          </span>
        </div>
      </section>
    </div>
  )
}
