import {
  Database,
  Network,
  ShieldCheck,
  Server,
  HardDrive,
  Container,
  Code2,
  Terminal,
  Layers3,
  Activity,
} from 'lucide-react'

const technologies = [
  {
    name: 'PostgreSQL',
    category: 'DATABASE',
    version: '17.5',
    icon: Database,
    description:
      'Relational database that stores application records and replicates data between cluster nodes.',
    role: 'Database engine',
  },
  {
    name: 'Patroni',
    category: 'HIGH AVAILABILITY',
    version: '4.0.4',
    icon: ShieldCheck,
    description:
      'Manages PostgreSQL cluster health, leader election, replica management and automatic failover.',
    role: 'Failover management',
  },
  {
    name: 'etcd',
    category: 'DISTRIBUTED COORDINATION',
    version: '3.5.18',
    icon: Network,
    description:
      'Provides distributed configuration storage and coordination for Patroni leader election.',
    role: 'Distributed consensus store',
  },
  {
    name: 'HAProxy',
    category: 'LOAD BALANCING',
    version: '3.2',
    icon: Activity,
    description:
      'Provides a stable connection endpoint and routes application traffic to the available primary.',
    role: 'Database traffic routing',
  },
  {
    name: 'MinIO',
    category: 'OBJECT STORAGE',
    version: 'S3 compatible',
    icon: HardDrive,
    description:
      'Provides S3-compatible object storage for database backup files.',
    role: 'Backup storage',
  },
  {
    name: 'Docker Compose',
    category: 'CONTAINERS',
    version: 'v5.3.1 CLI',
    icon: Container,
    description:
      'Runs and manages the multi-container PostgreSQL high-availability environment.',
    role: 'Container orchestration',
  },
  {
    name: 'Node.js & Express',
    category: 'BACKEND',
    version: 'Node.js',
    icon: Server,
    description:
      'Provides REST API endpoints used by the frontend to retrieve cluster health and database records.',
    role: 'Backend API',
  },
  {
    name: 'React',
    category: 'FRONTEND',
    version: '19',
    icon: Code2,
    description:
      'Builds the project website and interactive monitoring dashboard.',
    role: 'User interface',
  },
  {
    name: 'Vite',
    category: 'BUILD TOOL',
    version: '8',
    icon: Layers3,
    description:
      'Provides the frontend development server and production build process.',
    role: 'Frontend tooling',
  },
  {
    name: 'Ubuntu on WSL2',
    category: 'DEVELOPMENT ENVIRONMENT',
    version: 'WSL 2',
    icon: Terminal,
    description:
      'Provides the Linux environment used to develop and run the local project.',
    role: 'Development environment',
  },
]

export default function Technology() {
  return (
    <div className="app-shell">
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">06 / ENGINEERING STACK</span>
            <h2>Technology Stack</h2>
          </div>
          <span className="status-pill">
            <i />
            PROJECT STACK
          </span>
        </div>

        <p className="section-description">
          A combination of database, high-availability, infrastructure and
          web technologies powers this PostgreSQL failover and recovery
          demonstration.
        </p>

        <div className="technology-overview">
          <div>
            <strong>10</strong>
            <span>Technologies</span>
          </div>
          <div>
            <strong>3</strong>
            <span>Database nodes</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Main application layers</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">TOOLS & FRAMEWORKS</span>
            <h2>What powers the project?</h2>
          </div>
        </div>

        <div className="technology-grid">
          {technologies.map((tech) => {
            const Icon = tech.icon

            return (
              <article className="technology-card" key={tech.name}>
                <div className="technology-card-top">
                  <div className="technology-icon">
                    <Icon size={23} />
                  </div>
                  <span className="technology-version">{tech.version}</span>
                </div>

                <span className="technology-category">{tech.category}</span>
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>

                <div className="technology-role">
                  <span>PROJECT ROLE</span>
                  <strong>{tech.role}</strong>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">SYSTEM DESIGN</span>
            <h2>How the technologies work together</h2>
          </div>
        </div>

        <div className="technology-layers">
          <article>
            <span>01</span>
            <div>
              <h3>Frontend layer</h3>
              <p>React and Vite provide the project website and dashboard.</p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <h3>Application layer</h3>
              <p>Node.js and Express expose API endpoints to the frontend.</p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <h3>High-availability layer</h3>
              <p>PostgreSQL, Patroni and etcd manage database replication and failover.</p>
            </div>
          </article>

          <article>
            <span>04</span>
            <div>
              <h3>Infrastructure layer</h3>
              <p>HAProxy routes database connections while Docker Compose runs the local services.</p>
            </div>
          </article>

          <article>
            <span>05</span>
            <div>
              <h3>Backup layer</h3>
              <p>PostgreSQL backup tools create logical backups for storage and recovery.</p>
            </div>
          </article>
        </div>
      </section>

      <div className="architecture-note">
        <strong>Environment:</strong> The current demonstration runs locally
        using Docker containers in Ubuntu on WSL2. The technology list
        describes the project implementation, not a production cloud
        deployment.
      </div>
    </div>
  )
}
