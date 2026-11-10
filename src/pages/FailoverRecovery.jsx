import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Server,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Node 3 stopped',
    description: 'The original primary PostgreSQL container was stopped to simulate a failure.',
    status: 'FAILURE SIMULATED',
  },
  {
    number: '02',
    title: 'Failure detected',
    description: 'Patroni detected that the primary was unavailable and initiated leader election.',
    status: 'DETECTED',
  },
  {
    number: '03',
    title: 'Node 1 promoted',
    description: 'Node 1 became the new primary on timeline 6.',
    status: 'PROMOTION VERIFIED',
  },
  {
    number: '04',
    title: 'Replicas rejoined',
    description: 'Node 2 and Node 3 returned as streaming replicas on timeline 6.',
    status: 'REPLICATION VERIFIED',
  },
  {
    number: '05',
    title: 'HAProxy verified',
    description: 'The application connection through HAProxy reached the new primary at 172.18.0.10.',
    status: 'CONNECTION VERIFIED',
  },
]

const nodes = [
  { name: 'Node 1', role: 'PRIMARY', address: '172.18.0.10' },
  { name: 'Node 2', role: 'REPLICA', address: '172.18.0.11' },
  { name: 'Node 3', role: 'REPLICA', address: '172.18.0.12' },
]

export default function FailoverRecovery() {
  return (
    <div className="app-shell">
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">04 / HIGH AVAILABILITY</span>
            <h2>Failover & Recovery</h2>
          </div>
          <span className="status-pill"><i /> TEST PASSED</span>
        </div>

        <p className="section-description">
          A primary database failure was simulated to verify automatic
          promotion, replica synchronization and application connectivity.
        </p>

        <div className="failover-summary">
          <article className="failover-summary-card">
            <span>BEFORE FAILURE</span>
            <div className="failover-summary-node">
              <Server size={22} />
              <strong>Node 3</strong>
            </div>
            <small>Original primary</small>
          </article>

          <div className="failover-summary-arrow">
            <ArrowRight size={25} />
            <small>FAILOVER</small>
          </div>

          <article className="failover-summary-card success-card">
            <span>AFTER FAILOVER</span>
            <div className="failover-summary-node">
              <ShieldCheck size={22} />
              <strong>Node 1</strong>
            </div>
            <small>New primary · Timeline 6</small>
          </article>

          <article className="failover-duration">
            <Activity size={23} />
            <strong>~10 sec</strong>
            <small>Observed test duration</small>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">FAILOVER SEQUENCE</span>
            <h2>What happened?</h2>
          </div>
        </div>

        <div className="failover-timeline">
          {steps.map((step, index) => (
            <article className="failover-step" key={step.number}>
              <div className="failover-step-marker">
                {index === 0 ? <AlertTriangle size={19} /> : <CheckCircle2 size={19} />}
              </div>
              <div className="failover-step-content">
                <div className="failover-step-top">
                  <span className="step-number">{step.number}</span>
                  <span className="step-status">{step.status}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="failover-footnote">
          The approximately 10-second figure is the observed duration of this
          local test, including the Docker stop operation. It is not a
          separately benchmarked Patroni promotion time.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">VERIFIED CLUSTER STATE</span>
            <h2>After failover</h2>
          </div>
          <span className="status-pill"><i /> VERIFIED</span>
        </div>

        <div className="failover-node-grid">
          {nodes.map((node) => (
            <article className="failover-node-card" key={node.name}>
              <div className="failover-node-header">
                <Server size={21} />
                <span className={node.role === 'PRIMARY' ? 'node-primary' : 'node-replica'}>
                  {node.role}
                </span>
              </div>
              <h3>{node.name}</h3>
              <p>{node.address}</p>
              <div className="node-detail-row">
                <span>Timeline</span>
                <strong>6</strong>
              </div>
              <div className="node-detail-row">
                <span>Replication lag</span>
                <strong>0</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">RECOVERY BEHAVIOUR</span>
            <h2>How the system responds</h2>
          </div>
        </div>

        <div className="recovery-behaviour-grid">
          <article className="recovery-behaviour-card">
            <ShieldCheck size={23} />
            <h3>Automatic promotion</h3>
            <p>Patroni coordinates leader election and promotes an eligible replica when the primary becomes unavailable.</p>
          </article>

          <article className="recovery-behaviour-card">
            <RefreshCw size={23} />
            <h3>Replica synchronization</h3>
            <p>The remaining nodes follow the new primary through PostgreSQL streaming replication.</p>
          </article>

          <article className="recovery-behaviour-card">
            <Activity size={23} />
            <h3>Application connectivity</h3>
            <p>HAProxy provides the application connection endpoint and was verified against the promoted primary.</p>
          </article>
        </div>
      </section>

      <div className="architecture-note">
        <strong>Test scope:</strong> This result was verified in a local Docker-based environment. It demonstrates database failover on the local cluster, not a cloud-hosted deployment.
      </div>

      <div className="architecture-note recovery-warning">
        <strong>Important:</strong> Failover and backup restoration are separate mechanisms. Failover promotes a replica; backups are used to recover data after accidental deletion or data loss.
      </div>
    </div>
  )
}
