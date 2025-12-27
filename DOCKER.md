# Docker Deployment Guide

This guide explains how to deploy CipherSQL Studio using Docker.

## Quick Start

```bash
# 1. Set your Groq API key
cp .env.docker .env
nano .env  # Add your GROQ_API_KEY

# 2. Build and start all services
docker-compose up -d

# 3. Seed sample assignments (first time only)
docker-compose exec backend node seed.js

# 4. Access the application
open http://localhost
```

## Architecture

The application runs in 4 Docker containers:

1. **Frontend** (Nginx + React)
   - Port: 80
   - Serves static files and proxies API requests

2. **Backend** (Node.js + Express)
   - Port: 5000
   - Handles API requests and LLM interactions

3. **MongoDB**
   - Port: 27017
   - Stores assignments and user data

4. **PostgreSQL**
   - Port: 5432
   - Sandbox database for SQL query execution

## Commands

### Start Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services
```bash
docker-compose restart
```

### Stop Services
```bash
docker-compose down
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

### Access Container Shell
```bash
# Backend
docker-compose exec backend sh

# MongoDB
docker-compose exec mongodb mongosh

# PostgreSQL
docker-compose exec postgres psql -U postgres -d ciphersql_sandbox
```

## Data Persistence

Data is persisted in Docker volumes:
- `mongodb_data`: MongoDB assignments
- `postgres_data`: PostgreSQL tables

To reset data:
```bash
docker-compose down -v
```

## Environment Variables

Create `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Troubleshooting

### Backend can't connect to databases
- Ensure MongoDB and PostgreSQL containers are running
- Check logs: `docker-compose logs mongodb postgres`

### Frontend shows API errors
- Check backend is running: `docker-compose ps`
- Verify nginx proxy: Check `client/my-react-app/nginx.conf`

### Rebuild from scratch
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```
