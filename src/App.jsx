import './App.css'

const nodes = [
  { name: 'Node 1', ip: '172.18.0.10', role: 'REPLICA', state: 'Streaming', timeline: '5', detail: 'Rejoined successfully' },
  { name: 'Node 2', ip: '172.18.0.11', role: 'REPLICA', state: 'Streaming', timeline: '5', detail: 'Original primary; rejoined' },
  { name: 'Node 3', ip: '172.18.0.12', role: 'PRIMARY', state: 'Leader', timeline: '5', detail: 'Promoted after Node 2 failure' },
]

const backups = [
  { file: 'postgres_20261110_111658.dump', size: '81,382 bytes', status: 'Verified', note: 'Latest backup after failover' },
  { file: 'postgres_20261110_110510.dump', size: '81,693 bytes', status: 'Verified', note: 'Contains recovery test table' },
  { file: 'postgres_20261110_110414.dump', size: '80,673 bytes', status: 'Verified', note: 'Custom-format backup' },
  { file: 'postgres_20261110_105851.dump', size: '80,673 bytes', status: 'Verified', note: 'Initial validated backup' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">PG</span>
          <span>HA<span className="brand-muted"> / RECOVERY</span></span>
        </a>
        <nav>
          <a href="#architecture">Architecture</a>
          <a href="#failover">Failover</a>
          <a href="#backups">Backups</a>
          <a href="#recovery">Recovery</a>
        </nav>
        <span className="recorded-label"><i /> RECORDED TEST RESULTS</span>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> DATABASE RELIABILITY ENGINEERING</div>
            <h1>PostgreSQL High Availability <span>& Recovery</span></h1>
            <p className="hero-description">
              A fault-tolerant PostgreSQL cluster with automated failover,
              streaming replication, HAProxy routing and MinIO-based backup recovery.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#architecture">Explore architecture <span>↗</span></a>
              <a className="secondary-button" href="#failover">View failover test</a>
            </div>
            <p className="honesty-note">● Local Docker-based implementation · Results verified on 10 Nov 2026</p>
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
            <span className="metric-icon purple">▦</span>
            <p>POSTGRESQL NODES</p>
            <strong>03</strong>
            <small>1 primary + 2 replicas</small>
          </article>
          <article className="metric-card">
            <span className="metric-icon green">↗</span>
            <p>OBSERVED FAILOVER</p>
            <strong>~10 <em>sec</em></strong>
            <small>Includes container stop operation</small>
          </article>
          <article className="metric-card">
            <span className="metric-icon blue">◉</span>
            <p>LATEST BACKUP</p>
            <strong>~80 <em>KB</em></strong>
            <small>81,382 bytes · MinIO verified</small>
          </article>
          <article className="metric-card">
            <span className="metric-icon orange">✓</span>
            <p>RECOVERY TEST</p>
            <strong>Passed</strong>
            <small>Dropped table restored</small>
          </article>
        </section>

        <section className="section" id="architecture">
          <div className="section-heading">
            <div><span className="section-kicker">01 / SYSTEM DESIGN</span><h2>Cluster architecture</h2></div>
            <span className="section-side-note">3-node PostgreSQL topology</span>
          </div>
          <p className="section-description">Patroni manages PostgreSQL roles, etcd stores distributed coordination state, and HAProxy directs client connections to the current primary.</p>
          <div className="architecture-card">
            <div className="arch-client">
              <div className="arch-icon">⌘</div><strong>Application / Client</strong><small>Database requests</small>
            </div>
            <div className="arch-line"><span>SQL connection</span><i /></div>
            <div className="arch-service haproxy">
              <div className="service-icon">⇄</div><strong>HAProxy</strong><small>Port 5000 · Primary routing</small>
            </div>
            <div className="arch-branch"><i /><i /><i /></div>
            <div className="node-architecture">
              <div className="arch-node replica-node"><span className="node-dot" /><strong>Node 1</strong><small>Replica · 172.18.0.10</small><em>Streaming</em></div>
              <div className="arch-node primary-node"><span className="node-dot" /><strong>Node 3</strong><small>Primary · 172.18.0.12</small><em>Leader · Timeline 5</em></div>
              <div className="arch-node replica-node"><span className="node-dot" /><strong>Node 2</strong><small>Replica · 172.18.0.11</small><em>Streaming</em></div>
            </div>
            <div className="support-services">
              <div className="support-card"><span>◉</span><div><strong>Patroni</strong><small>Role management & failover</small></div></div>
              <div className="support-card"><span>◇</span><div><strong>etcd</strong><small>Distributed configuration store</small></div></div>
              <div className="support-card"><span>▤</span><div><strong>MinIO</strong><small>Backup object storage</small></div></div>
            </div>
            <div className="arch-caption">Conceptual architecture · Node roles shown from the verified post-failover test</div>
          </div>
        </section>

        <section className="section" id="cluster">
          <div className="section-heading">
            <div><span className="section-kicker">02 / CLUSTER STATUS</span><h2>Post-failover node state</h2></div>
            <span className="status-pill"><i /> VERIFIED AFTER REJOIN</span>
          </div>
          <div className="node-grid">
            {nodes.map(node => (
              <article className={`node-card ${node.role === 'PRIMARY' ? 'active-node' : ''}`} key={node.name}>
                <div className="node-card-top"><span className="node-card-icon">▦</span><span className={node.role === 'PRIMARY' ? 'role-primary' : 'role-replica'}>{node.role}</span></div>
                <h3>{node.name}</h3><p className="node-ip">{node.ip}</p>
                <div className="node-state"><span className="pulse-dot" />{node.state}</div>
                <div className="node-details"><span>Timeline</span><strong>{node.timeline}</strong></div>
                <p className="node-note">{node.detail}</p>
              </article>
            ))}
          </div>
          <p className="footnote">Recorded from Patroni cluster status after Node 2 restarted and rejoined as a replica. This is not a live connection to the local cluster.</p>
        </section>

        <section className="section" id="failover">
          <div className="section-heading">
            <div><span className="section-kicker">03 / AUTOMATED FAILOVER</span><h2>When the primary goes down</h2></div>
            <span className="status-pill"><i /> TEST PASSED</span>
          </div>
          <p className="section-description">The original primary was stopped. Patroni detected the failure and promoted Node 3. The previous primary later rejoined as a replica.</p>
          <div className="failover-card">
            <div className="failover-summary">
              <div><span className="mini-label">BEFORE FAILURE</span><strong>Node 2</strong><small>Primary · Timeline 4</small></div>
              <div className="transition-arrow">→</div>
              <div><span className="mini-label">AFTER FAILOVER</span><strong className="green-text">Node 3</strong><small>New primary · Timeline 5</small></div>
              <div className="failover-time"><strong>~10s</strong><small>Observed test time*</small></div>
            </div>
            <div className="timeline">
              <div className="timeline-item"><span className="timeline-point" /><div><strong>Node 2 stopped</strong><p>Simulated primary failure using Docker Compose.</p></div><time>01</time></div>
              <div className="timeline-item"><span className="timeline-point" /><div><strong>Failure detected</strong><p>Patroni monitored cluster health and initiated leader election.</p></div><time>02</time></div>
              <div className="timeline-item"><span className="timeline-point success-point" /><div><strong>Node 3 promoted</strong><p>Node 3 became leader on timeline 5.</p></div><time>03</time></div>
              <div className="timeline-item"><span className="timeline-point success-point" /><div><strong>Node 2 rejoined</strong><p>Node 2 returned as a streaming replica alongside Node 1.</p></div><time>04</time></div>
              <div className="timeline-item"><span className="timeline-point success-point" /><div><strong>HAProxy verified</strong><p>Client connection routed to 172.18.0.12, the new primary.</p></div><time>05</time></div>
            </div>
            <p className="footnote">* Approximately 10 seconds measured during the test, including the Docker stop operation; not a benchmark of Patroni promotion time alone.</p>
          </div>
        </section>

        <section className="section" id="backups">
          <div className="section-heading">
            <div><span className="section-kicker">04 / BACKUP STORAGE</span><h2>MinIO backup repository</h2></div>
            <span className="status-pill"><i /> UPLOADS VERIFIED</span>
          </div>
          <p className="section-description">PostgreSQL logical backups are created in custom dump format using pg_dump and uploaded to the MinIO object-storage bucket.</p>
          <div className="backup-panel">
            <div className="backup-panel-head"><div><span className="storage-icon">▤</span><div><strong>postgres-backups</strong><small>MinIO bucket · Object storage</small></div></div><span className="object-count">4 verified objects</span></div>
            <div className="backup-table">
              <div className="backup-row backup-header"><span>BACKUP FILE</span><span>SIZE</span><span>STATUS</span></div>
              {backups.map(backup => <div className="backup-row" key={backup.file}><span className="file-name"><b>▧</b><span>{backup.file}<small>{backup.note}</small></span></span><span>{backup.size}</span><span className="verified-tag">✓ {backup.status}</span></div>)}
            </div>
            <div className="backup-method"><span>i</span><p><strong>Backup method:</strong> Logical backup using <code>pg_dump -Fc</code>. These are not physical snapshots or point-in-time recovery archives.</p></div>
          </div>
        </section>

        <section className="section" id="recovery">
          <div className="section-heading">
            <div><span className="section-kicker">05 / DATA RECOVERY</span><h2>Dropped-table restoration</h2></div>
            <span className="status-pill"><i /> TEST PASSED</span>
          </div>
          <p className="section-description">A test table was backed up, deliberately dropped, and restored from a verified dump. The restored data was then checked across the cluster.</p>
          <div className="recovery-card">
            <div className="recovery-code-head"><span>RECOVERY WORKFLOW</span><span>POSTGRESQL · CUSTOM DUMP</span></div>
            <div className="recovery-steps">
              <div><b>01</b><span><strong>Create test table</strong><small>ha_recovery_test</small></span><em>✓</em></div>
              <div><b>02</b><span><strong>Create and upload backup</strong><small>pg_dump custom-format archive</small></span><em>✓</em></div>
              <div><b>03</b><span><strong>Drop the test table</strong><small>Drop verified across replicas</small></span><em>✓</em></div>
              <div><b>04</b><span><strong>Restore from backup</strong><small>pg_restore table and data</small></span><em>✓</em></div>
              <div><b>05</b><span><strong>Verify restored data</strong><small>Restored rows visible on all 3 nodes</small></span><em>✓</em></div>
            </div>
            <div className="recovered-record"><span className="record-check">✓</span><div><small>VERIFIED TEST RECORD</small><strong>PostgreSQL HA recovery test successful</strong><p>Test data was restored and observed on the primary and both replicas.</p></div></div>
          </div>
        </section>

        <section className="section technology-section">
          <div className="section-heading"><div><span className="section-kicker">06 / TECHNOLOGY STACK</span><h2>Tools behind the system</h2></div></div>
          <div className="technology-grid">
            {['PostgreSQL 17.5','Patroni 4.0.4','etcd 3.5.18','HAProxy 3.2','MinIO','Docker Compose','Ubuntu on WSL2','Python'].map((tool, i) => <span className="tech-chip" key={tool}><i>{['◈','⚙','◇','⇄','▤','▣','⌘','⌁'][i]}</i>{tool}</span>)}
          </div>
        </section>

        <section className="closing-banner">
          <div><span className="section-kicker">PROJECT OUTCOME</span><h2>Resilience tested. Recovery verified.</h2><p>Demonstrating automated failover, replica rejoining, backup validation and table-level recovery in a local three-node PostgreSQL environment.</p></div>
          <span className="closing-symbol">◈</span>
        </section>
      </main>

      <footer><a className="brand" href="#home"><span className="brand-icon">PG</span><span>HA<span className="brand-muted"> / RECOVERY</span></span></a><p>PostgreSQL HA & Recovery · Project demonstration</p><span>Test evidence recorded 10 Nov 2026</span></footer>
    </div>
  )
}

export default App
