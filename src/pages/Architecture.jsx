import {
  Database,
  Network,
  ShieldCheck,
  Server,
  HardDrive,
  GitBranch,
} from 'lucide-react'

const nodes = [
  {
    name: 'Node 1',
    address: '172.18.0.10',
    role: 'PRIMARY',
    detail: 'Leader · Timeline 6',
    primary: true,
  },
  {
    name: 'Node 2',
    address: '172.18.0.11',
    role: 'REPLICA',
    detail: 'Streaming replica',
  },
  {
    name: 'Node 3',
    address: '172.18.0.12',
    role: 'REPLICA',
    detail: 'Streaming replica',
  },
]

const services = [
  {
    icon: ShieldCheck,
    name: 'Patroni',
    description: 'Manages PostgreSQL roles, health checks and leader election.',
  },
  {
    icon: Network,
    name: 'etcd',
    description: 'Stores distributed cluster coordination and leader state.',
  },
  {
    icon: HardDrive,
    name: 'MinIO',
    description: 'Stores uploaded PostgreSQL backup objects.',
  },
]

export default function Architecture() {
  return (
    <div className="app-shell">
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">03 / SYSTEM DESIGN</span>
            <h2>Cluster Architecture</h2>
          </div>
          <span className="section-side-note">3-node PostgreSQL topology</span>
        </div>

        <p className="section-description">
          The application connects through HAProxy. Patroni manages PostgreSQL
          node roles, while etcd provides distributed coordination. MinIO
          stores database backup files.
        </p>

        <div className="architecture-card">
          <div className="arch-client">
            <div className="arch-icon"><Server size={22} /></div>
            <strong>Application / Client</strong>
            <small>Database requests</small>
          </div>

          <div className="arch-line">
            <span>SQL connection</span>
            <i />
          </div>

          <div className="arch-service haproxy">
            <div className="service-icon">⇄</div>
            <strong>HAProxy</strong>
            <small>Port 5000 · Primary routing</small>
          </div>

          <div className="arch-branch">
            <i /><i /><i />
          </div>

          <div className="node-architecture">
            {nodes.map((node) => (
              <div
                className={`arch-node ${node.primary ? 'primary-node' : 'replica-node'}`}
                key={node.name}
              >
                <span className="node-dot" />
                <strong>{node.name}</strong>
                <small>{node.address}</small>
                <em>{node.role} · {node.detail}</em>
              </div>
            ))}
          </div>

          <div className="support-services">
            {services.map(({ icon: Icon, name, description }) => (
              <div className="support-card" key={name}>
                <span><Icon size={21} /></span>
                <div>
                  <strong>{name}</strong>
                  <small>{description}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="arch-caption">
            Verified post-failover node roles · 10 November 2026
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">HOW THE COMPONENTS WORK</span>
            <h2>Request and replication flow</h2>
          </div>
        </div>

        <div className="architecture-flow-grid">
          <article className="architecture-flow-card">
            <Database size={23} />
            <h3>1. Client request</h3>
            <p>
              The application sends its database request to the HAProxy
              connection endpoint.
            </p>
          </article>

          <article className="architecture-flow-card">
            <GitBranch size={23} />
            <h3>2. Primary routing</h3>
            <p>
              HAProxy checks node availability and directs write traffic
              to the current primary.
            </p>
          </article>

          <article className="architecture-flow-card">
            <Network size={23} />
            <h3>3. Streaming replication</h3>
            <p>
              PostgreSQL replicas receive changes from the primary through
              streaming replication.
            </p>
          </article>
        </div>
      </section>

      <section className="architecture-note">
        <ShieldCheck size={22} />
        <div>
          <strong>Why three nodes?</strong>
          <p>
            A primary and two replicas provide alternative nodes for
            promotion when the current primary becomes unavailable. The
            latest local test verified Node 1 as leader and Node 2 and
            Node 3 as streaming replicas.
          </p>
        </div>
      </section>
    </div>
  )
}
