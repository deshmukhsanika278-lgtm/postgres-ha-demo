
import { useEffect, useState } from 'react'

function LiveCluster() {
  const [cluster, setCluster] = useState(null)
  const [health, setHealth] = useState(null)
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  // Fetch live dashboard data
  async function refreshDashboard() {
    try {
      const [clusterResponse, healthResponse, recordsResponse] =
        await Promise.all([
          fetch('/api/cluster'),
          fetch('/api/health'),
          fetch('/api/records')
        ])

      if (!clusterResponse.ok ||
          !healthResponse.ok ||
          !recordsResponse.ok) {
        throw new Error('One or more monitoring APIs are unavailable')
      }

      const [clusterData, healthData, recordsData] =
        await Promise.all([
          clusterResponse.json(),
          healthResponse.json(),
          recordsResponse.json()
        ])

      setCluster(clusterData)
      setHealth(healthData)
      setRecords(recordsData)
      setError('')

    } catch (err) {
      setError(err.message)
    }
  }

  // Automatic refresh every 5 seconds
  useEffect(() => {
    refreshDashboard()

    const interval = setInterval(refreshDashboard, 5000)

    return () => clearInterval(interval)
  }, [])

  // Insert record into PostgreSQL
  async function handleSubmit(event) {
    event.preventDefault()

    if (!message.trim()) {
      setError('Please enter a message.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Could not insert record')
      }

      setSuccess(
        `Record #${data.record.id} inserted successfully!`
      )

      setMessage('')

      await refreshDashboard()

    } catch (err) {
      setError(err.message)

    } finally {
      setSaving(false)
    }
  }

  const nodes = cluster?.members || []

  return (
    <section className="section" id="cluster">

      {/* Heading */}
      <div className="section-heading">
        <div>
          <span className="section-kicker">
            02 / LIVE CLUSTER MONITORING
          </span>
          <h2>PostgreSQL node status</h2>
        </div>

        <span className="status-pill">
          <i />
          {error ? 'CONNECTION ISSUE' : 'AUTO REFRESH · 5 SEC'}
        </span>
      </div>

      {/* Database overview */}
      <div className="live-overview">

        <div>
          <span>DATABASE CONNECTION</span>
          <strong className={
            health?.status === 'connected'
              ? 'live-green'
              : 'live-red'
          }>
            {health?.status || 'Checking...'}
          </strong>
        </div>

        <div>
          <span>CLUSTER</span>
          <strong>
            {cluster?.cluster_name || 'Checking...'}
          </strong>
        </div>

        <div>
          <span>CONNECTED SERVER</span>
          <strong>
            {health?.database?.server_ip || '—'}
          </strong>
        </div>

        <div>
          <span>CONNECTED ROLE</span>
          <strong>
            {health?.database
              ? health.database.is_replica
                ? 'REPLICA'
                : 'PRIMARY'
              : '—'}
          </strong>
        </div>

      </div>

      {/* Error message */}
      {error && (
        <p className="live-error">
          {error}. Dashboard will retry automatically.
        </p>
      )}

      {/* PostgreSQL node cards */}
      <div className="node-grid">

        {nodes.map(node => {
          const isPrimary =
            node.role === 'leader' || node.role === 'primary'

          return (
            <article
              className={`node-card ${isPrimary ? 'active-node' : ''}`}
              key={node.name}
            >

              <div className="node-card-top">
                <span className="node-card-icon">▦</span>

                <span className={
                  isPrimary ? 'role-primary' : 'role-replica'
                }>
                  {isPrimary ? 'PRIMARY' : 'REPLICA'}
                </span>
              </div>

              <h3>{node.name.toUpperCase()}</h3>

              <p className="node-ip">
                {node.host}
              </p>

              <div className="node-state">
                <span className="pulse-dot" />
                {node.state}
              </div>

              <div className="node-details">
                <span>Timeline</span>
                <strong>{node.timeline ?? '—'}</strong>
              </div>

              <div className="node-details">
                <span>Replication lag</span>
                <strong>
                  {node.lag !== undefined
                    ? `${node.lag} bytes`
                    : '—'}
                </strong>
              </div>

              <p className="node-note">
                {isPrimary
                  ? 'Current Patroni leader'
                  : 'Streaming replica'}
              </p>

            </article>
          )
        })}

      </div>

      {nodes.length === 0 && (
        <p className="live-error">
          Waiting for cluster information...
        </p>
      )}

      {/* Insert record section */}
      <div className="live-records">

        <div className="section-heading">
          <div>
            <span className="section-kicker">
              DATABASE WRITE OPERATION
            </span>
            <h2>Insert a test record</h2>
          </div>
        </div>

        <p className="section-description">
          Insert a new recovery test message directly into
          PostgreSQL through the backend API and HAProxy.
        </p>

        <form
          className="record-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enter your recovery test message..."
            maxLength={500}
            disabled={saving}
          />

          <button
            type="submit"
            disabled={saving || !message.trim()}
          >
            {saving ? 'Saving...' : 'Insert Record'}
          </button>

        </form>

        {success && (
          <p className="record-success">
            ✓ {success}
          </p>
        )}

        {/* Records list */}
        <div className="section-heading record-heading">
          <div>
            <span className="section-kicker">
              LIVE DATABASE CONTENT
            </span>
            <h2>Recovery test records</h2>
          </div>

          <span className="section-side-note">
            {records.length} records retrieved
          </span>
        </div>

        {records.length > 0 ? (

          <div className="live-record-list">

            {records.map(record => (
              <div
                className="live-record"
                key={record.id}
              >

                <span>#{record.id}</span>

                <strong>{record.message}</strong>

                <small>
                  {new Date(record.created_at).toLocaleString()}
                </small>

              </div>
            ))}

          </div>

        ) : (

          <p className="section-description">
            No records found.
          </p>

        )}

      </div>

      {/* Last updated */}
      <p className="footnote">
        Live information retrieved from Patroni and PostgreSQL APIs.
        Last successful refresh:{' '}
        {cluster?.fetched_at
          ? new Date(cluster.fetched_at).toLocaleTimeString()
          : 'Waiting...'}
      </p>

    </section>
  )
}

export default LiveCluster
