# Backend Microservices Scaffold

This directory contains the microservice-oriented backend scaffold for **FindMyShaadi Pics**.

## Services

- `api-gateway` - single API entrypoint and proxy forwarding
- `auth-service` - admin authentication and JWT-ready user domain
- `event-service` - wedding/event creation and event code generation
- `photo-service` - event-scoped photo uploads and metadata
- `search-service` - selfie search workflow orchestration
- `ai-face-service` - face extraction and similarity utilities
- `shared` - shared notes and environment conventions

## Recommended Build Order

1. `auth-service`
2. `event-service`
3. `photo-service`
4. `ai-face-service`
5. `search-service`
6. `api-gateway`
7. Redis/Celery integration

## Important Note

The existing monolithic Django backend under `../backend` is intentionally left untouched. This new
`services` directory is a parallel scaffold for the microservice migration path you described.
