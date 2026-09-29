# AutoTrack Pro - Technical Documentation

## Architecture Overview
AutoTrack Pro is built using a modern, scalable tech stack tailored for high performance and maintainability:
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Vanilla CSS variables
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: Docker, AWS/Azure, GitHub Actions

## Deployment Strategy
The application is containerized using Docker and Docker Compose. We use a multi-stage `Dockerfile` leveraging Next.js `output: "standalone"` feature to drastically reduce the final image size and improve startup performance.

### CI/CD Pipeline
GitHub Actions (`.github/workflows/deploy.yml`) is configured to:
1. Trigger on pushes to the `main` branch.
2. Run automated type checking (`npx tsc --noEmit`) and linting (`npm run lint`).
3. Build the Docker image.
4. Push the image to the GitHub Container Registry (ghcr.io).
5. (Optional) Deploy directly to an AWS EC2 or Azure VM via SSH.

### Production Environment Setup (AWS/Azure)
1. Provision a Linux VM (e.g., Ubuntu 22.04) on AWS EC2 or Azure Virtual Machines.
2. Install Docker and Docker Compose.
3. Clone the repository or copy the `docker-compose.prod.yml` file.
4. Run the production stack:
   ```bash
   export POSTGRES_USER=admin
   export POSTGRES_PASSWORD=secure_password
   export POSTGRES_DB=vsm_tracker
   docker compose -f docker-compose.prod.yml up -d
   ```

## Automated Backups & Disaster Recovery
We run a dedicated sidecar container (`autotrack-db-backup`) using the `prodrigestivill/postgres-backup-local` image.
- **Schedule**: Daily (`@daily`)
- **Retention**: 7 days, 4 weeks, 6 months
- **Location**: Backups are dumped to a Docker volume (`pgbackups`).
- **Cloud Sync**: To prevent data loss from instance failure, configure a cron job on the host machine to sync this volume to an AWS S3 Bucket or Azure Blob Storage using the AWS CLI or AzCopy.

## Monitoring & Logging
- **Logging**: Application logs are managed by Docker using the `json-file` driver with log rotation (max 20MB per file, 5 files max) to prevent disk space exhaustion.
- **Monitoring**: We recommend setting up Datadog, New Relic, or a Prometheus/Grafana stack on the host machine to monitor Docker container metrics, CPU, Memory, and Network I/O.
