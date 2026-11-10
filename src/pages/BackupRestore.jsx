import {
  DatabaseBackup,
  HardDrive,
  CloudUpload,
  ShieldCheck,
  RefreshCw,
  FileArchive,
  CheckCircle2,
  Terminal,
  ArrowDownToLine,
} from 'lucide-react'

const backupFiles = [
  {
    name: 'postgres_20261110_111658.dump',
    size: '81,382 bytes',
    detail: 'Latest backup · After failover',
  },
  {
    name: 'postgres_20261110_110510.dump',
    size: '81,693 bytes',
    detail: 'Contains recovery test table',
  },
  {
    name: 'postgres_20261110_110414.dump',
    size: '80,673 bytes',
    detail: 'Custom-format backup',
  },
  {
    name: 'postgres_20261110_105851.dump',
    size: '80,673 bytes',
    detail: 'Initial validated backup',
  },
]

const backupSteps = [
  {
    number: '01',
    title: 'Connect to PostgreSQL',
    description: 'The backup process connects to the database and reads its data.',
  },
  {
    number: '02',
    title: 'Create a backup',
    description: 'pg_dump creates a custom-format database backup using the -Fc option.',
  },
  {
    number: '03',
    title: 'Store the backup',
    description: 'The backup file can be uploaded to MinIO object storage.',
  },
  {
    number: '04',
    title: 'Restore when needed',
    description: 'pg_restore can restore database objects and data from a valid backup.',
  },
]

export default function BackupRestore() {
  return (
    <div className="app-shell">
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">05 / DATA PROTECTION</span>
            <h2>Backup & Storage</h2>
          </div>
          <span className="status-pill">
            <i />
            BACKUP VERIFIED
          </span>
        </div>

        <p className="section-description">
          Protect PostgreSQL data with logical database backups and object
          storage. Explore the backup workflow, available backup files and
          restoration process.
        </p>

        <div className="backup-overview-grid">
          <article className="backup-overview-card">
            <div className="backup-overview-icon"><DatabaseBackup size={23} /></div>
            <span>BACKUP METHOD</span>
            <h3>pg_dump -Fc</h3>
            <p>PostgreSQL custom-format logical backup</p>
          </article>

          <article className="backup-overview-card">
            <div className="backup-overview-icon"><FileArchive size={23} /></div>
            <span>VERIFIED FILES</span>
            <h3>4 backup files</h3>
            <p>Created and checked during local testing</p>
          </article>

          <article className="backup-overview-card">
            <div className="backup-overview-icon"><HardDrive size={23} /></div>
            <span>STORAGE</span>
            <h3>MinIO</h3>
            <p>S3-compatible object storage component</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">BACKUP INVENTORY</span>
            <h2>Available backup files</h2>
          </div>
          <span className="backup-count">04 FILES</span>
        </div>

        <div className="backup-file-list">
          {backupFiles.map((file) => (
            <article className="backup-file-row" key={file.name}>
              <div className="backup-file-icon">
                <FileArchive size={21} />
              </div>
              <div className="backup-file-info">
                <strong>{file.name}</strong>
                <small>{file.detail}</small>
              </div>
              <span className="backup-file-size">{file.size}</span>
              <CheckCircle2 className="backup-file-check" size={19} />
            </article>
          ))}
        </div>

        <p className="backup-footnote">
          These are verified local backup files from the project tests.
          Their presence does not by itself confirm a successful remote upload
          to MinIO.
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">BACKUP PIPELINE</span>
            <h2>How backup works</h2>
          </div>
        </div>

        <div className="backup-process-grid">
          {backupSteps.map((step, index) => (
            <article className="backup-process-card" key={step.number}>
              <span className="backup-process-number">{step.number}</span>
              {index === 0 && <DatabaseBackup size={23} />}
              {index === 1 && <FileArchive size={23} />}
              {index === 2 && <CloudUpload size={23} />}
              {index === 3 && <RefreshCw size={23} />}
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">STORAGE ARCHITECTURE</span>
            <h2>Backup to object storage</h2>
          </div>
        </div>

        <div className="storage-flow">
          <article className="storage-flow-card">
            <DatabaseBackup size={27} />
            <strong>PostgreSQL</strong>
            <small>Database source</small>
          </article>
          <div className="storage-flow-arrow">→</div>
          <article className="storage-flow-card">
            <Terminal size={27} />
            <strong>Backup script</strong>
            <small>pg_dump -Fc</small>
          </article>
          <div className="storage-flow-arrow">→</div>
          <article className="storage-flow-card">
            <CloudUpload size={27} />
            <strong>MinIO</strong>
            <small>Object storage</small>
          </article>
        </div>

        <div className="architecture-note">
          <strong>Storage note:</strong> MinIO is the project's object-storage
          component. The local backup files are verified; remote upload
          verification should be demonstrated separately.
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">RESTORE WORKFLOW</span>
            <h2>Recover database data</h2>
          </div>
          <span className="status-pill">
            <i />
            RESTORE TESTED
          </span>
        </div>

        <div className="restore-panel">
          <div className="restore-panel-icon">
            <ShieldCheck size={27} />
          </div>
          <div>
            <h3>Restore from a backup file</h3>
            <p>
              A test table was dropped and its data was restored from a
              PostgreSQL backup. This validates the tested table-and-data
              recovery scenario.
            </p>
          </div>
        </div>

        <div className="restore-command-card">
          <div className="restore-command-heading">
            <span><Terminal size={17} /> RESTORE COMMAND EXAMPLE</span>
            <span>POSTGRESQL</span>
          </div>
          <pre><code>{'pg_restore -d target_database postgres_backup.dump'}</code></pre>
          <p>
            Example command only. The target database and connection settings
            must be configured before running it.
          </p>
        </div>

        <div className="architecture-note recovery-warning">
          <strong>Current scope:</strong> This project demonstrates logical
          backups and a tested table-and-data restore. It does not yet
          demonstrate physical snapshots, continuous WAL archiving or
          point-in-time recovery (PITR).
        </div>
      </section>
    </div>
  )
}
