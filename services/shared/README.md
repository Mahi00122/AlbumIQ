# Shared Conventions

## Architecture

Use the same layering pattern in each Django service:

`View -> Service -> Repository -> Database`

## Ports

- API Gateway: `8000`
- Auth Service: `8001`
- Event Service: `8002`
- Photo Service: `8003`
- Search Service: `8004`
- AI Face Service: `8005`

## Initial Database Strategy

Start with one PostgreSQL instance for local MVP work. Keep each service settings file isolated so each
service can later move to its own database without large refactors.
