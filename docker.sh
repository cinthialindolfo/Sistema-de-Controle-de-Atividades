#!/bin/bash
# Docker Quick Commands for Activity Control

# === PRODUCTION ===
# Build production image
docker build -t activity-control:latest .

# Start production container
docker compose up -d

# View production logs
docker compose logs -f app

# === DEVELOPMENT ===
# Run with hot reload (file watching)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# === MANAGEMENT ===
# Stop containers
docker compose down

# Remove containers and volumes
docker compose down -v

# Restart service
docker compose restart app

# Shell access to container
docker compose exec app /bin/sh

# View detailed logs
docker compose logs app --tail 50

# === CLEANUP ===
# Remove unused images
docker image prune -a

# Remove unused networks
docker network prune

# Full cleanup
docker system prune -a --volumes
