# Stakeholder Engagement Platform - Deployment & Operations Architecture

## Document Information
- **Document Title:** Deployment Architecture & Operations Model
- **Version:** 1.0
- **Date:** July 2026
- **Classification:** Enterprise Architecture Documentation
- **Audience:** Infrastructure Engineers, DevOps Teams, Operations Leadership

---

## 1. Introduction

### 1.1 Purpose
This document specifies the deployment architecture, operations procedures, monitoring strategy, and SLA commitments for the Stakeholder Engagement Platform.

### 1.2 Operations Principles
- **Automation First** - Automate all repetitive tasks
- **Infrastructure as Code** - All infrastructure defined in version-controlled code
- **Monitoring & Observability** - Comprehensive visibility into system health
- **Incident Response** - Clear procedures and contacts for quick resolution
- **Continuity Planning** - Robust disaster recovery and business continuity
- **Documentation** - Complete runbooks and playbooks for operations team

---

## 2. Infrastructure Architecture

### 2.1 Deployment Model

**Deployment Target:** MORO Data Center (Dubai) - On-Premise
**Alternative:** UAE-based cloud provider (Azure UAE, AWS UAE GCC)
**High Availability:** Replicated setup across availability zones

### 2.2 Infrastructure Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                        │
│                    (MORO Data Center)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Internet Gateway (DMZ)                           │   │
│  │  - Firewall rules                                        │   │
│  │  - WAF (Web Application Firewall)                        │   │
│  │  - DDoS protection                                       │   │
│  │  - VPN gateway (for admin access)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                    │                                              │
│    ┌───────────────┼───────────────┐                            │
│    │               │               │                            │
│  ┌─▼──────────┐ ┌─▼──────────┐ ┌─▼──────────┐                 │
│  │Load        │ │   API      │ │   API      │                 │
│  │Balancer    │ │  Server 1  │ │  Server 2  │ (+1 backup)     │
│  │            │ │            │ │            │                 │
│  │- SSL/TLS  │ │- Node.js   │ │- Node.js   │                 │
│  │- Route    │ │- Express   │ │- Express   │                 │
│  │- Health   │ │- App Logic │ │- App Logic │                 │
│  │  Check    │ │            │ │            │                 │
│  └────────────┘ └──────────────┴────────────┘                 │
│       │                    │                                    │
│       └────────────┬───────┘                                    │
│                    │                                            │
│    ┌───────────────┼───────────────┐                           │
│    │               │               │                           │
│  ┌─▼──────────┐ ┌─▼──────────┐ ┌─▼──────────┐                │
│  │Redis Cache│ │  MySQL      │ │  NAS File  │                │
│  │Cluster    │ │  Primary    │ │  Storage   │                │
│  │           │ │  (Read/Write)│ │            │                │
│  │- Sessions │ │             │ │- Event     │                │
│  │- Caching  │ │- InnoDB     │ │  materials │                │
│  │- Rate Lim │ │- Replication│ │- Documents│                │
│  └───────────┘ │  Enabled    │ │- Backups  │                │
│                │             │ │            │                │
│                └──────┬───────┘ └────────────┘                │
│                       │                                        │
│                ┌──────▼────────┐                               │
│                │ MySQL Replica │                               │
│                │ (Read-only)    │                               │
│                │ - Reports      │                               │
│                │ - Analytics    │                               │
│                └────────────────┘                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │    External Service Integrations                         │  │
│  │  ├─ DEWA Active Directory                               │  │
│  │  ├─ Microsoft Exchange (Email)                          │  │
│  │  ├─ SMS Gateway                                         │  │
│  │  └─ Future: SAP, Teams, SharePoint, etc.               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │    Monitoring & Logging                                  │  │
│  │  ├─ Log aggregation (ELK/Splunk)                        │  │
│  │  ├─ Metrics collection (Prometheus/Grafana)             │  │
│  │  ├─ APM (Application Performance Monitoring)            │  │
│  │  └─ Centralized alerting                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### 2.3 Network Configuration

**Network Topology:**
```
DMZ (Demilitarized Zone):
├─ Public IP: Load Balancer (HTTPS listener)
├─ Firewall: Inbound (443 HTTPS, 80 HTTP→redirect)
└─ WAF: Rate limiting, DDoS protection

Application Network (Private):
├─ Subnet: 10.0.1.0/24
├─ Instances: API servers, background workers
├─ Firewall: Allow from DMZ only
└─ No direct internet access

Database Network (Private):
├─ Subnet: 10.0.2.0/24
├─ Instances: MySQL master, replicas, Redis
├─ Firewall: Allow from Application network only
└─ No internet access, regular backups to off-site

Management Network (Private):
├─ Bastion host for SSH access
├─ Firewall: Restricted access (VPN only)
└─ Jump box for admin operations
```

**Firewall Rules:**
```
Ingress (Internet → DMZ):
  ✓ TCP 443 (HTTPS) from ANY → Load Balancer
  ✓ TCP 80 (HTTP) from ANY → Load Balancer (redirect to 443)
  ✗ All others

DMZ → Application:
  ✓ TCP 8080 (app port) from Load Balancer → API servers
  ✗ All others

Application → Database:
  ✓ TCP 3306 (MySQL) from API servers → Database
  ✓ TCP 6379 (Redis) from API servers → Cache
  ✗ All others

Admin Access:
  ✓ TCP 22 (SSH) from Bastion → All servers
  ✓ All outbound from Bastion (VPN only, MFA required)
  ✗ Direct SSH from internet
```

---

## 3. Deployment Pipeline

### 3.1 Continuous Integration (CI)

```
Developer pushes code to GitHub
        ↓
GitHub Actions triggered
        ├─ Build Docker image for API
        ├─ Build Docker image for frontend (Vite)
        ├─ Run unit tests (Jest)
        ├─ Run linting (ESLint)
        ├─ Run SAST (static code analysis)
        ├─ Run dependency scan (npm audit, Snyk)
        ├─ Build frontend bundle
        ├─ Build database migration scripts
        └─ Publish images to container registry
            ├─ ECR/ACR with semantic versioning
            ├─ Tag: v1.2.3, v1.2.3-rc1, latest
            └─ Scan images for vulnerabilities
        ↓
All checks PASS → Ready for deployment
Any check FAIL → Notify developer, block merge
```

### 3.2 Continuous Deployment (CD)

**Deployment Strategy: Blue-Green with Canary**

```
┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION                            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Blue Environment (Current - Production)                │
│  ├─ API v1.2.2                                          │
│  ├─ 3 servers running                                   │
│  ├─ 100% traffic                                        │
│  └─ Database: Current schema                            │
│                                                           │
│  ↓ Deploy New Version (v1.2.3)                          │
│                                                           │
│  Green Environment (New - Staged)                       │
│  ├─ API v1.2.3                                          │
│  ├─ 3 servers, parallel to blue                         │
│  ├─ 0% traffic (internal testing)                       │
│  └─ Database: Migrated schema                           │
│                                                           │
│  ↓ Run smoke tests on green (5 min)                     │
│                                                           │
│  Canary Release (1-5% traffic to green)                 │
│  ├─ Shift 1% traffic to green                           │
│  ├─ Monitor error rates, response times                 │
│  ├─ Gradually increase to 5%                            │
│  └─ If any issues: rollback to blue                     │
│                                                           │
│  ↓ All metrics look good                                │
│                                                           │
│  Full Rollout (100% traffic to green)                   │
│  ├─ Shift remaining 95% traffic to green                │
│  ├─ Monitor for 10 minutes                              │
│  └─ Verify 0 errors from users                          │
│                                                           │
│  ↓ Success                                              │
│                                                           │
│  Cleanup (Blue → Old, Green → Blue)                     │
│  ├─ Terminate old blue environment                      │
│  ├─ Green becomes new production                        │
│  ├─ Ready for next deployment                           │
│  └─ Rollback path still available (24 hours)            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### 3.3 Deployment Checklist

**Pre-Deployment (1 week before):**
- [ ] All features tested in staging
- [ ] Database migration scripts tested
- [ ] Rollback procedures verified
- [ ] Backups current and verified
- [ ] Communication sent to users
- [ ] On-call team notified

**Deployment Day:**
- [ ] Code review approved by tech lead
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Secrets properly configured
- [ ] Load test results acceptable
- [ ] Team standing by
- [ ] Monitoring dashboards open
- [ ] Incident response contacts available

**During Deployment:**
- [ ] Database migrations executed
- [ ] New containers started
- [ ] Smoke tests passing
- [ ] Error rates normal
- [ ] Response times normal
- [ ] All endpoints responding
- [ ] Sample requests work as expected

**Post-Deployment (24 hours):**
- [ ] Monitor error rates (0 critical issues)
- [ ] Monitor response times (p95 < 2s)
- [ ] Monitor resource usage (CPU, memory)
- [ ] Check backup completed successfully
- [ ] Verify all integrations working (AD, email, SMS)
- [ ] User reports normal

---

## 4. Environment Management

### 4.1 Environment Configurations

**Development Environment**
```
Purpose: Local development and testing
Infrastructure:
  - Single developer laptop or small VM
  - H2/SQLite in-memory database
  - No replication, no clustering
  - Mock external services (AD, email)

Configuration:
  NODE_ENV=development
  API_URL=http://localhost:3000
  DB_HOST=localhost
  DB_PORT=3306
  MOCK_EXTERNAL_SERVICES=true
  LOG_LEVEL=debug
```

**QA/Staging Environment**
```
Purpose: Integration testing, performance testing, user acceptance testing
Infrastructure:
  - 3 API servers (identical to production)
  - MySQL master-slave replication
  - Redis cache cluster
  - Real external service integrations (test accounts)
  - Simulated load (500 concurrent users)

Configuration:
  NODE_ENV=staging
  API_URL=https://qa-api.dewa-sep.local
  DB_HOST=qa-db.dewa-sep.local
  ENABLE_DETAILED_LOGGING=true
  TEST_DATA_LOAD=true
```

**Production Environment**
```
Purpose: Live production system
Infrastructure:
  - 3 API servers (active-active)
  - MySQL master-slave replication
  - Redis cache cluster
  - Real external service integrations
  - Geographic redundancy (backup site)

Configuration:
  NODE_ENV=production
  API_URL=https://api.dewa-sep.local
  DB_HOST=prod-db.dewa-sep.local
  ENABLE_DETAILED_LOGGING=false
  TLS_REQUIRED=true
  RATE_LIMITING_ENABLED=true
```

### 4.2 Configuration Management

**Source of Truth: Environment Variables**
```
Stored in: Secure vault (Azure Key Vault, AWS Secrets Manager, or HashiCorp Vault)
Not committed to: Git repository
Accessed by: Deployment pipeline, running containers
Rotation: Automated for sensitive values

Categories:
1. Database credentials
2. API keys (external services)
3. Encryption keys
4. JWT signing keys
5. Third-party API tokens
```

**Infrastructure as Code (IaC)**
```
Version Controlled (Git):
├─ Terraform scripts (infrastructure definitions)
│  ├─ Networking (VPCs, subnets, routes)
│  ├─ Compute (VMs, auto-scaling groups)
│  ├─ Storage (NAS, backups)
│  ├─ Databases (RDS/Cloud SQL)
│  └─ Monitoring (alerting rules)
├─ Ansible playbooks (configuration management)
├─ Docker Compose (local development)
├─ Kubernetes manifests (if using K8s)
└─ CI/CD pipeline definitions (GitHub Actions/GitLab CI)

Deployed via: Automated pipeline (changes reviewed before merge)
```

---

## 5. Operations & Monitoring

### 5.1 24/7 Operations Model

**On-Call Rotation:**
```
Primary On-Call (1 person)
├─ Responds to all critical alerts
├─ Page frequency: ~5 issues/week
├─ Escalation path available
└─ Week rotation (Monday-Sunday)

Secondary On-Call (Backup, for escalation)
├─ Handles escalated issues
├─ Participates in major incidents
└─ Week rotation (same as primary)

Coverage:
- Always: At least one person available
- Coverage hours: 24x7x365
- Response target: 15 minutes for critical
```

### 5.2 Monitoring Stack

**Infrastructure Monitoring:**
```
Metrics Collection:
├─ Prometheus (or managed equivalent)
│  └─ Scrapes metrics from API servers, DB, Redis
├─ Node Exporter (OS-level metrics)
│  └─ CPU, memory, disk, network
└─ Custom exporters
   └─ Application-specific metrics (request count, response time)

Data Storage:
├─ Prometheus time-series database (local)
├─ Long-term storage: InfluxDB or similar
└─ Retention: 15 days (Prometheus), 1 year (long-term)

Visualization:
├─ Grafana dashboards
├─ Pre-built dashboards for common views
├─ Custom dashboards per team
└─ Alert annotations for incidents
```

**Application Monitoring (APM):**
```
Option 1: Open Source (New Relic, Elastic APM, Jaeger)
├─ Distributed tracing (trace requests across services)
├─ Error tracking
├─ Performance profiling
└─ Custom instrumentation in code

Option 2: Managed (Datadog, New Relic, Dynatrace)
├─ Vendor-managed infrastructure
├─ Automatic instrumentation
├─ Out-of-box dashboards
└─ 24/7 support

Required visibility:
- Request latency distribution
- Error rates by endpoint
- Database query performance
- Cache hit rates
- Third-party API latency (AD, email, SMS)
```

**Log Aggregation:**
```
Logging Pipeline:
API Servers
    │ (structured JSON logs)
    └─→ Log Shipper (Fluentd, Filebeat)
         │
         └─→ Log Storage (ELK Stack or managed service)
              ├─ Elasticsearch (search & analytics)
              ├─ Logstash (processing)
              └─ Kibana (visualization)

Log Fields:
- Timestamp (UTC)
- Service name (api, worker, etc.)
- Log level (debug, info, warn, error)
- Request ID (for tracing)
- User ID (if applicable)
- Event/action
- Message
- Stack trace (for errors)

Retention:
- Hot data (recent): 7 days (Elasticsearch)
- Warm data (historical): 30 days
- Cold data (archive): 1 year (S3/Blob storage)
```

### 5.3 Key Monitoring Dashboards

**Executive Dashboard (for leadership):**
- System uptime percentage (target: 99.9%)
- Number of active users
- Events processed (today/week/month)
- Average response time
- Current error rate
- Incident count (critical/high/medium)

**Operations Dashboard (for ops team):**
- CPU usage by server
- Memory usage by server
- Disk space available
- Network traffic (in/out)
- Database connections
- Cache hit rate
- Queue depths (email, SMS, background jobs)
- Error rate by endpoint
- Request latency percentiles (p50, p95, p99)

**Application Dashboard (for dev team):**
- Request rate by endpoint
- Response time by endpoint
- Error count by endpoint
- Error rate by type (validation, auth, server)
- Cache hit/miss rate
- Database query latency
- API call rate (to external services)

### 5.4 Critical Alerts

**Alert Thresholds:**

| Alert | Threshold | Action |
|-------|-----------|--------|
| CPU usage | > 80% for 5 min | Page on-call, check load |
| Memory usage | > 85% for 5 min | Check for memory leak |
| Disk usage | > 80% | Page on-call, check disk space |
| Response time p95 | > 2 seconds | Investigate bottleneck |
| Error rate | > 1% | Page on-call immediately |
| Database replication lag | > 30 seconds | Page on-call |
| API unavailable | Any down endpoint | Page on-call immediately |
| Authentication failures | > 10 in 5 min | Investigate potential attack |

---

## 6. Incident Management

### 6.1 Severity Levels

| Severity | Impact | Response | Resolution Target |
|----------|--------|----------|-------------------|
| **Critical** | Complete outage / data loss risk | Page on-call immediately | 1 hour |
| **High** | Partial outage / significant functionality broken | Page on-call within 15 min | 4 hours |
| **Medium** | Limited functionality / degraded performance | Create ticket, notify team | 24 hours |
| **Low** | Minor issue / workaround available | Create ticket | 1 week |

### 6.2 Incident Response Procedure

```
1. ALERT & ACKNOWLEDGMENT (0-5 min)
   ├─ Alert fired (automated monitoring)
   ├─ On-call receives notification (email, SMS, PagerDuty)
   ├─ On-call acknowledges receipt
   └─ Page escalates if not acknowledged within 5 min

2. INITIAL TRIAGE (5-15 min)
   ├─ On-call reviews alert details
   ├─ Determines severity level
   ├─ Gathers basic information (error logs, metrics)
   ├─ Posts initial update to incident channel
   └─ If Critical: Activate incident commander

3. INVESTIGATION (15-60 min)
   ├─ Check recent deployments (was something deployed?)
   ├─ Review error logs and metrics
   ├─ Check external service status (AD, email, SMS, cloud provider)
   ├─ Gather team (eng, ops, db) if needed
   ├─ Identify root cause
   └─ Determine remediation path

4. MITIGATION (60+ min)
   ├─ Implement fix (code change, config update, rollback)
   ├─ Deploy fix (to staging, then production)
   ├─ Verify fix resolves issue
   ├─ Confirm users can access system
   └─ Update incident with resolution

5. COMMUNICATION
   ├─ Update incident channel every 15 min
   ├─ Notify status page (if user-facing)
   ├─ Send user email update (if incident >30 min)
   ├─ Final summary when resolved
   └─ Document incident for post-mortem

6. POST-INCIDENT (next business day)
   ├─ Schedule post-mortem meeting (within 48 hours)
   ├─ Analyze root cause
   ├─ Identify preventive measures
   ├─ Create follow-up tasks
   ├─ Document lessons learned
   └─ Communicate to team

Status Updates:
- Critical: Every 15 minutes
- High: Every 30 minutes
- Medium: Daily updates
- Low: Weekly status
```

---

## 7. Backup & Disaster Recovery

### 7.1 Backup Strategy

**Full Backups (Daily):**
```
Time: 2 AM UTC (off-peak)
Duration: < 2 hours
Destination: Local NAS + Remote off-site storage
Retention: 30-day rolling window

Database: mysqldump or xtrabackup
├─ All databases exported
├─ Compressed (gzip)
├─ Encrypted (AES-256)
└─ Checksummed for integrity

Files: rsync or tar
├─ /data/events (event materials)
├─ /data/users (user documents)
├─ /data/reports (generated reports)
└─ Configuration files
```

**Incremental Backups (Hourly):**
```
Based on: MySQL binary logs
Duration: Minutes (lightweight)
Retention: 7 days local storage
Purpose: Point-in-time recovery

Process:
├─ Archive binary log every hour
├─ Compress and encrypt
├─ Store locally and replicate off-site
└─ Delete local copies after 7 days
```

**Backup Verification:**
```
Weekly (Sunday 3 AM):
├─ Restore latest full backup to test server
├─ Verify all tables, indexes intact
├─ Run consistency checks (mysqlcheck)
├─ Compare record counts vs production
├─ Delete test data
└─ Report success/issues

Monthly (1st of month):
├─ Perform full restore to test infrastructure
├─ Run application smoke tests
├─ Verify data integrity end-to-end
└─ Document recovery time
```

### 7.2 Disaster Recovery Plan

**Recovery Point Objective (RPO):** < 1 hour
**Recovery Time Objective (RTO):** < 4 hours

**Scenario 1: Database Corruption (Single Table)**
```
Detection: Automated consistency check fails
Impact: Single feature affected
Recovery:
1. Identify corrupted table (5 min)
2. Restore table from latest backup (15 min)
3. Apply transaction logs to point of failure (10 min)
4. Run integrity checks (10 min)
5. Return to service (5 min)
Total: ~45 minutes
Data loss: 0-15 minutes

Procedure:
STOP application queries
  └─ Set read-only mode
RESTORE table
  └─ mysql> ALTER TABLE ... from backup_file
APPLY LOGS
  └─ mysqlbinlog backup.bin | mysql
VERIFY
  └─ SELECT COUNT(*), SUM(hash) for validation
START application
  └─ Remove read-only mode
```

**Scenario 2: Primary Database Server Failure**
```
Detection: Database connection pool errors
Impact: Complete data access down
Recovery:
1. Detect failure (1 min, automatic)
2. Promote replica to master (5 min)
3. Update application connection strings (5 min)
4. Verify connectivity (5 min)
5. Return to service (5 min)
Total: ~20 minutes
Data loss: 0-30 seconds

Procedure:
DETECT
  └─ Connection pool fails, alerts fire
PROMOTE REPLICA
  └─ mysql> RESET MASTER (on new master)
  └─ mysql> RESET SLAVE ALL (on former replicas)
  └─ mysql> CHANGE MASTER ... (on other replicas)
REDIRECT TRAFFIC
  └─ Update load balancer to new primary
VERIFY
  └─ Test queries succeed
REBUILD FAILED SERVER
  └─ Repair or replace hardware
  └─ Re-sync from new master
  └─ Add back to cluster
```

**Scenario 3: Complete Data Center Failure**
```
Detection: Multiple systems down, network unreachable
Impact: Complete system outage
Recovery:
1. Declare disaster (immediate)
2. Activate disaster recovery team
3. Provision backup infrastructure (30 min)
4. Restore database from remote backup (60 min)
5. Deploy application (30 min)
6. Verify all systems (30 min)
7. Switch DNS/load balancer (5 min)
Total: ~3 hours
Data loss: < 1 hour

Procedure:
DECLARE DISASTER
  └─ Activate backup data center
  └─ Provision new infrastructure in alternate location
RESTORE DATA
  └─ Retrieve latest backup from off-site storage
  └─ Restore to new database instance
  └─ Apply transaction logs to point of failure
DEPLOY APPLICATION
  └─ Build and deploy application from git tags
  └─ Configure with new database connection
  └─ Verify all services start
SWITCH TRAFFIC
  └─ Update DNS to backup data center
  └─ Update load balancer IP
  └─ Monitor for user connectivity
RETURN TO PRIMARY
  └─ (Once primary data center recovered)
  └─ Sync data from backup
  └─ Switch back to primary
```

---

## 8. Performance Tuning

### 8.1 Database Performance

**Query Optimization:**
```
Regular Reviews (weekly):
├─ Identify slow queries (> 1 second)
├─ Review query execution plans
├─ Check index usage
├─ Consider adding missing indexes
└─ Rewrite inefficient queries

Common Optimizations:
├─ Add composite indexes for common WHERE+ORDER BY
├─ Use query result caching for read-heavy operations
├─ Avoid SELECT * (retrieve only needed columns)
├─ Use EXPLAIN to verify index usage
├─ Partition large tables by date (future)
```

**Connection Pool Tuning:**
```
Current: 20 connections per server
Target: Minimize while avoiding timeouts

Monitoring:
├─ Track active connections daily
├─ Monitor connection wait times
├─ Alert if > 80% pool utilization
└─ Adjust pool size based on usage patterns

Optimization:
├─ Reduce idle connection timeout (from 5min → 1min)
├─ Implement connection queue with timeout
├─ Use persistent connections where possible
└─ Monitor for connection leaks
```

### 8.2 Application Performance

**Frontend Optimization:**
```
Bundle Size:
├─ Current: ~400KB (gzip)
├─ Target: < 300KB
├─ Strategy: Code splitting by route
├─ Monitor: Bundle size CI check

Loading Performance:
├─ First Contentful Paint (FCP): < 1.5s
├─ Largest Contentful Paint (LCP): < 2.5s
├─ Cumulative Layout Shift (CLS): < 0.1
├─ Monitoring: Google Lighthouse, WebPageTest

Caching:
├─ Browser caching: 1 year for static assets
├─ Service Worker: Cache API calls (offline support)
├─ Image optimization: WebP format, lazy loading
```

**API Performance:**
```
Response Time Targets:
├─ List endpoints: < 500ms (p95)
├─ Single resource: < 300ms (p95)
├─ Create/update: < 800ms (p95)

Optimization:
├─ Database query optimization (above)
├─ Caching of frequent queries
├─ Async processing for heavy operations
├─ Pagination to limit result sets
└─ Compression of responses (gzip)
```

---

## 9. Runbooks & Playbooks

### 9.1 Common Operations Runbooks

**Runbook: Database Connection Pool Exhausted**
```
Symptoms:
- API returns "Connection timeout" errors
- New requests hang waiting for connection

Investigation:
1. SSH to app server
2. Check connection pool status: curl localhost:8080/health
3. Query database for active connections:
   SELECT COUNT(*) FROM INFORMATION_SCHEMA.PROCESSLIST
4. Check for long-running queries:
   SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST WHERE TIME > 300
5. Review application logs for query errors

Resolution:
Option 1 (Temporary):
  └─ Restart application: docker restart api-container
Option 2 (Permanent):
  ├─ Identify stuck queries
  ├─ KILL QUERY process_id
  ├─ Increase pool size in configuration
  ├─ Re-deploy with new config
  └─ Verify connection pool size normalized

Prevention:
├─ Implement query timeout (30 seconds max)
├─ Add monitoring for connection pool usage
├─ Set alerts if > 80% pool utilized
└─ Document optimal pool size calculation
```

**Runbook: High Memory Usage**
```
Symptoms:
- Memory usage > 85%
- Possible OOM (out-of-memory) killer triggered

Investigation:
1. Check memory usage: free -h, docker stats
2. Check top memory consumers:
   top -b -o +%MEM | head -20
3. Check for memory leaks in application logs
4. Review for unusual data structures in memory

Resolution:
Option 1 (Temporary):
  └─ Restart service: docker restart api-container
Option 2 (Permanent):
  ├─ Identify memory leak source
  ├─ Review recent code changes
  ├─ Run heap dump analysis (Node.js)
  ├─ Fix memory leak
  ├─ Deploy updated version
  └─ Monitor memory usage

Prevention:
├─ Implement memory usage monitoring
├─ Set resource limits (docker: memory 2GB max)
├─ Alert if memory > 75% for 10 minutes
├─ Review memory usage weekly
└─ Implement heap snapshots for production analysis
```

---

## 10. Operations SLA

### 10.1 Service Level Agreements

**Uptime SLA: 99.9% (Business Hours) / 99.97% (Overall)**

```
Uptime Target: 99.9% = ~9 hours downtime/year = ~45 minutes/month
Uptime Target: 99.97% = ~2.6 hours downtime/year = ~13 minutes/month

Calculation:
Total Minutes in Month: 43,800
Downtime Allowed (99.9%): 43.8 minutes
Downtime Allowed (99.97%): 13.2 minutes

Excluded from SLA:
- Planned maintenance (announced >24 hours)
- Issues caused by user configuration
- Issues caused by external services (third-party)
- Client-side/network issues
```

**Response Time SLA**

```
p95 Response Time: < 2 seconds
p99 Response Time: < 5 seconds
p50 Response Time: < 500ms

Measured across all API endpoints
Excludes report generation (can be longer)
```

**Support SLA**

```
Critical Incident: Acknowledge within 15 minutes
High Priority: Acknowledge within 1 hour
Normal Priority: Acknowledge within 4 hours

Business Hours: 8 AM - 6 PM, Saturday - Thursday (UAE)
After Hours: On-call engineer always available
```

### 10.2 SLA Credits

```
If uptime falls below SLA threshold:

Uptime | Credit
------|--------
< 99.9% | 10% monthly fee
< 99.5% | 25% monthly fee
< 99.0% | 50% monthly fee
< 95.0% | 100% monthly fee

Claimed through formal process within 30 days of incident
```

---

## 11. Operations Summary

This Deployment & Operations Architecture provides:

1. **Infrastructure** - Highly available, redundant, scalable setup
2. **Deployment** - Automated CI/CD with blue-green deployments
3. **Monitoring** - Comprehensive visibility into system health
4. **Incident Response** - Clear procedures for rapid resolution
5. **Disaster Recovery** - Robust backup and recovery procedures
6. **SLA Commitments** - Clear performance targets and accountability
7. **Runbooks** - Documented procedures for common operations
8. **24/7 Operations** - On-call rotation with escalation paths

All systems designed for resilience, automation, and continuous improvement.

---

*End of Deployment & Operations Architecture Document*
