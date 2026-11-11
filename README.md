# PostgreSQL High Availability and Recovery

A backend-focused PostgreSQL high-availability project demonstrating automatic failover, connection routing, logical backups, and application-data recovery.

## Overview

This project uses a three-node PostgreSQL cluster managed by Patroni, with etcd providing distributed coordination. HAProxy routes database connections to the active primary. Logical PostgreSQL backups are created with `pg_dump` and uploaded to MinIO object storage.

An Express.js API exposes database health, cluster status, and record operations.

## Architecture

```text
                 Express.js Backend
                   Port 3001
                        |
                        v
                    HAProxy
                   Port 5000
                        |
              Routes to active primary
                        |
          +-------------+-------------+
          |             |             |
       Node 1         Node 2        Node 3
      PostgreSQL     PostgreSQL    PostgreSQL
       Patroni        Patroni       Patroni
          |             |             |
          +-------------+-------------+
                        |
                       etcd
              Cluster coordination

       Backup Container
              |
           pg_dump
              |
           MinIO
       Object Storage
```

### Components

| Component | Purpose |
|---|---|
| PostgreSQL 17 | Relational database |
| Patroni | Leader election, monitoring and failover |
| etcd | Distributed configuration and coordination |
| HAProxy | Routes client connections to the primary |
| MinIO | Stores logical backup files |
| Express.js | Backend REST API |
| Node.js | Backend runtime |

## Project structure

```text
postgres-ha-demo/
├── server/
│   └── index.js
├── infrastructure/
│   ├── docker-compose.yml
│   ├── backup/
│   │   └── Dockerfile
│   ├── haproxy/
│   │   └── haproxy.cfg
│   ├── scripts/
│   │   ├── backup_to_minio.sh
│   │   └── upload_backup.py
│   └── evidence/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Requirements

- Linux, Ubuntu on WSL2, or another supported Linux environment
- Docker Engine or Docker Desktop with Docker Compose
- Node.js and npm
- Git

## Configuration

Clone the repository and enter its directory:

```bash
git clone https://github.com/deshmuksanika278-lgtm/postgres-ha-demo.git
cd postgres-ha-demo
```

Install backend dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Edit `.env` and provide the required database and MinIO credentials.

Important configuration variables:

| Variable | Purpose |
|---|---|
| `PORT` | Express API port |
| `DB_HOST` | Database connection host |
| `DB_PORT` | Database connection port |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_SSL` | Enable or disable PostgreSQL SSL |
| `PATRONI_ENDPOINTS` | Patroni cluster API endpoints |
| `MINIO_ROOT_PASSWORD` | MinIO password |
| `POSTGRES_SUPERUSER_PASSWORD` | PostgreSQL superuser password |
| `POSTGRES_STANDBY_PASSWORD` | PostgreSQL standby password |

Never commit `.env` or real credentials.

## Infrastructure

The Docker Compose configuration is located at:

`infrastructure/docker-compose.yml`

Review the configuration and environment variables before starting infrastructure.

For a new, isolated deployment, configure a unique Compose project name and verify volume names and network settings before running Compose. Do not reuse an existing deployment's project name or volumes unintentionally.

The original development cluster in this project uses the Compose project name `postgres-ha-recovery`. Its existing containers and persistent volumes must be preserved when working with that live environment.

## Start the backend API

After configuring `.env` and ensuring the database cluster is reachable:

```bash
npm start
```

The API listens on:

`http://localhost:3001`

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Project and endpoint information |
| GET | `/api/health` | PostgreSQL connectivity and primary/replica status |
| GET | `/api/cluster` | Patroni cluster membership and node status |
| GET | `/api/records` | Retrieve test records |
| POST | `/api/records` | Insert a test record |

### Example requests

Check backend health:

```bash
curl http://localhost:3001/api/health
```

Check cluster status:

```bash
curl http://localhost:3001/api/cluster
```

Retrieve records:

```bash
curl http://localhost:3001/api/records
```

Insert a record:

```bash
curl -X POST http://localhost:3001/api/records \
  -H "Content-Type: application/json" \
  -d '{"message":"Testing PostgreSQL HA API"}'
```

## Backup

The backup script uses PostgreSQL custom-format logical backups.

```bash
docker exec ha-backup /app/backup_to_minio.sh
```

The script:
1. Connects to PostgreSQL through HAProxy.
2. Runs `pg_dump` using custom format.
3. Uploads the dump to the configured MinIO bucket.
4. Removes the temporary local dump after upload.

The default bucket configured by the upload script is `postgres-backups`.

## Failover test

The development cluster was tested by stopping the active primary:

```bash
docker stop ha-node1
```

After Patroni detected the failure, node3 was promoted to primary. HAProxy routed database traffic to node3, and the backend continued to serve health checks and record operations.

Node1 was restarted:

```bash
docker start ha-node1
```

It successfully rejoined as a streaming replica.

### Observed test result — November 11, 2026

| Node | Final role | State | Timeline | Replication lag |
|---|---|---|---:|---:|
| node1 | Replica | Streaming | 7 | 0 |
| node2 | Replica | Streaming | 7 | 0 |
| node3 | Leader | Running | 7 | — |

A post-failover API write was successful and the inserted record was retrieved through the API.

## Backup recovery test

A custom-format backup was restored into a separate database named `recovery_test`.

The full archive included the `pg_cron` extension. The cluster's configuration restricts that extension to the original `postgres` database, so a full restore into the separate database stopped at the extension creation step.

A selective restore was then performed using a PostgreSQL archive TOC list. It restored:

- `public.ha_recovery_test`
- Its identity sequence
- The table's saved data
- The sequence state

The recovered table contained four original records. A subsequent insert succeeded and generated ID 37 automatically.

**Recovery test result:** selective application-table restoration and a subsequent insert succeeded.

This test does not establish that every object in the complete database archive can be restored into a separate database.

## Test evidence

Test outputs are stored in `infrastructure/evidence/`.

Important evidence files include:

- `cluster_before_manual_test.json`
- `cluster_after_manual_test.json`
- `health_after_manual_test.json`
- `records_after_manual_test.json`
- `recovery_restore_test.json`

These files record the observed cluster state and recovery-test results.

## Current scope and limitations

Implemented and tested:

- Three-node PostgreSQL cluster
- Patroni-managed automatic failover
- etcd coordination
- HAProxy primary routing
- Express backend health and cluster endpoints
- Record insertion and retrieval
- Logical custom-format backups
- MinIO backup upload
- Selective application-table recovery into a separate database
- Replica rejoin after failover

Not yet established:

- Full database restore including all cluster-specific extensions
- Point-in-time recovery (PITR)
- Automated backup-retention and restore orchestration
- Independently measured failover duration
- Publicly hosted, continuously available database infrastructure

This project is a development and demonstration environment, not a production deployment.

## Security

- Keep `.env` out of version control.
- Use strong credentials for PostgreSQL and MinIO.
- Do not expose database, MinIO, or Patroni management ports publicly without appropriate network controls.
- Review firewall and access-control rules before deployment.

## Author

Sanika Deshmukh

PostgreSQL High Availability and Recovery
Backend Development | Database Systems | Fault Tolerance
