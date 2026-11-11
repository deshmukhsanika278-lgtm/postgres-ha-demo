import express from 'express'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT || 3001)

app.use(express.json({ limit: '1mb' }))

// ==========================================
// POSTGRESQL DATABASE CONNECTION
// ==========================================

const pool = new pg.Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 5000),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,

  // Enable SSL when required by PostgreSQL pg_hba.conf.
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false
})

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message)
})

// ==========================================
// PATRONI CLUSTER CONFIGURATION
// ==========================================

const patroniEndpoints = (
  process.env.PATRONI_ENDPOINTS ||
  'http://127.0.0.1:8008/cluster,http://127.0.0.1:8009/cluster,http://127.0.0.1:8010/cluster'
)
  .split(',')
  .map(endpoint => endpoint.trim())
  .filter(Boolean)

// ==========================================
// API 1: DATABASE HEALTH CHECK
// ==========================================

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        inet_server_addr() AS server_ip,
        pg_is_in_recovery() AS is_replica,
        current_database() AS database_name,
        NOW() AS checked_at
    `)

    res.json({
      status: 'connected',
      message: 'PostgreSQL connection successful',
      database: result.rows[0]
    })

  } catch (error) {
    console.error('Health check error:', error.message)

    res.status(500).json({
      status: 'disconnected',
      error: 'Unable to connect to PostgreSQL'
    })
  }
})

// ==========================================
// API 2: GET RECOVERY TEST RECORDS
// ==========================================

app.get('/api/records', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        message,
        created_at
      FROM public.ha_recovery_test
      ORDER BY id DESC
      LIMIT 50
    `)

    res.json({
      status: 'success',
      count: result.rowCount,
      records: result.rows
    })

  } catch (error) {
    console.error('Fetch records error:', error.message)

    res.status(500).json({
      status: 'error',
      error: 'Could not fetch database records'
    })
  }
})

// ==========================================
// API 3: INSERT A RECOVERY TEST RECORD
// ==========================================

app.post('/api/records', async (req, res) => {
  try {
    const { message } = req.body

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        status: 'error',
        error: 'Message cannot be empty'
      })
    }

    const result = await pool.query(
      `
        INSERT INTO public.ha_recovery_test (message)
        VALUES ($1)
        RETURNING id, message, created_at
      `,
      [message.trim()]
    )

    res.status(201).json({
      status: 'success',
      message: 'Record inserted successfully',
      record: result.rows[0]
    })

  } catch (error) {
    console.error('Insert record error:', error.message)

    res.status(500).json({
      status: 'error',
      error: 'Could not insert database record'
    })
  }
})

// ==========================================
// API 4: LIVE PATRONI CLUSTER MONITORING
// ==========================================

app.get('/api/cluster', async (req, res) => {

  for (const endpoint of patroniEndpoints) {

    try {
      const response = await fetch(endpoint, {
        signal: AbortSignal.timeout(2500)
      })

      if (!response.ok) {
        continue
      }

      const data = await response.json()

      const members = (data.members || []).map(member => ({
        name: member.name,
        role: member.role,
        state: member.state,
        host: member.host,
        port: member.port,
        timeline: member.timeline,
        lag: member.lag
      }))

      return res.json({
        status: 'connected',
        cluster_name: data.scope || 'postgres-ha',
        fetched_at: new Date().toISOString(),
        total_nodes: members.length,
        members
      })

    } catch (error) {
      console.log(`Patroni endpoint unavailable: ${endpoint}`)
    }
  }

  res.status(503).json({
    status: 'disconnected',
    error: 'Unable to contact any Patroni endpoint'
  })
})

// ==========================================
// API 5: BASIC API INFORMATION
// ==========================================

app.get('/', (req, res) => {
  res.json({
    project: 'PostgreSQL High Availability and Recovery',
    status: 'running',
    endpoints: [
      'GET /api/health',
      'GET /api/cluster',
      'GET /api/records',
      'POST /api/records'
    ]
  })
})

// ==========================================
// START BACKEND SERVER
// ==========================================

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('======================================')
  console.log(' PostgreSQL HA Backend')
  console.log('======================================')
  console.log(`Server: http://localhost:${PORT}`)
  console.log(`Database: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5000}`)
  console.log(`SSL enabled: ${process.env.DB_SSL === 'true'}`)
  console.log('======================================')
})

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

let shuttingDown = false

async function shutdown() {
  if (shuttingDown) return

  shuttingDown = true
  console.log('Shutting down backend...')

  server.close(async () => {
    try {
      await pool.end()
      console.log('Database connections closed.')
      process.exit(0)
    } catch (error) {
      console.error('Shutdown error:', error.message)
      process.exit(1)
    }
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
