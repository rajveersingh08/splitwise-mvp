# Splitwise MVP

Node.js REST API for user accounts, shared expenses, and balances. Built with Express, Sequelize, and MySQL.

## Setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev
```

The server runs on `http://localhost:3000` by default.

## Environment variables

| Variable | Description |
| --- | --- |
| `SERVER_PORT` | API port |
| `NODE_ENV` | `development` or `production` |
| `DB_DIALECT` | Database dialect (`mysql`) |
| `DB_HOST` | Database host |
| `DB_USER` | Database username |
| `DB_PASS` | Database password |
| `DB_NAME` | Database name |
| `DB_LOGGING` | Enable Sequelize SQL logs (`true` / `false`) |

## API

Base path: `/api/v1`

Authenticated requests use the `X-User-Id` header. The header value must match the user id in the URL for user routes.

Import `postman.json` into Postman to test the endpoints.

## Scripts

```bash
npm run dev
npm run db:migrate
npm run db:migrate:undo
npm run db:migrate:undo:all
```
