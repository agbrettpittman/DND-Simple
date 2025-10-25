# DND-Simple

Free and simple D&D campaign software. This repo is a monorepo with a Fastify backend and a React frontend.

## What’s inside

- Backend: Fastify v5, Prisma ORM, SQLite, OpenAPI/Swagger docs
- Frontend: React 19 + React Router 7, Vite, MUI 7, styled-components

Repository layout:

```
backend/                # Fastify server, Prisma client, routers
	prisma/               # Prisma schema and migrations (SQLite)
	routers/users/        # Users CRUD + login
frontend/               # React app (Vite)
	src/pages/            # Landing, Login, Register
	src/components/       # AppLayout
```

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 9+

## Quick start

1) Backend

```bash
cd backend
npm install

# Configure environment (create .env if needed)
cat > .env << 'EOF'
SERVER_IP=127.0.0.1
SERVER_PORT=8000
# Cost factor for bcrypt
SALT_ROUNDS=10
# Prisma SQLite location (relative to backend/prisma/schema.prisma)
DATABASE_URL="file:../data/db/db.sqlite"
EOF

# Generate Prisma client and create DB tables via migration
npm run prisma:generate
npm run prisma:migrate

# Start the API (with reload)
npm run dev
```

Swagger UI: http://localhost:8000/docs (raw JSON at http://localhost:8000/docs/json)

2) Frontend

```bash
cd frontend
npm install

# Optional: override API base URL (defaults to /api which proxies to http://127.0.0.1:8000)
echo 'VITE_API_BASE_URL=/api' > .env

# Start the web app
npm run dev
```

Vite dev server will print the URL (typically http://localhost:5173). The dev server proxies requests from `/api/*` to the backend on `http://127.0.0.1:8000`.

## Environment configuration

Backend (.env in `backend/`):

- SERVER_IP: default 127.0.0.1
- SERVER_PORT: default 8000
- SALT_ROUNDS: bcrypt cost, default 10
- DATABASE_URL: Prisma connection string for SQLite, e.g. `file:../data/db/db.sqlite`

Frontend (.env in `frontend/`):

- VITE_API_BASE_URL: API base (default `/api`) — keep as `/api` in dev to leverage the Vite proxy.

## API overview

Base URL in dev: `http://127.0.0.1:8000`

Interactive docs: http://localhost:8000/docs

Users endpoints (under `/users`):

- GET `/users` → list users
- GET `/users/:id` → fetch a single user
- POST `/users` → create user `{ name, email, password }` → 201 Created, 409 if email exists
- POST `/users/login` → `{ email, password }` → 200 OK with basic user info, 401 on failure
- PUT `/users/:id` → replace name/email (conflict checked)
- PATCH `/users/:id` → partial update name/email (conflict checked)
- DELETE `/users/:id` → 204 No Content

Example (register and login):

```bash
# Register
curl -sS -X POST http://127.0.0.1:8000/users \
	-H 'Content-Type: application/json' \
	-d '{"name":"Alice","email":"alice@example.com","password":"secret"}'

# Login
curl -sS -X POST http://127.0.0.1:8000/users/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"alice@example.com","password":"secret"}'
```

## Frontend notes

- Routing is declared in `src/App.jsx` under `AppLayout`.
- Styling uses MUI + styled-components with a shared theme (`src/theme.js`).
- Network calls should use `const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'`.
- Convention: React state variables are intentionally PascalCase (e.g., `const [Email, SetEmail] = useState('')`). Please follow this pattern.

## Development tips

- If you change `prisma/schema.prisma`, run `npm run prisma:generate` and a new migration (`npm run prisma:migrate`).
- You can inspect the database with Prisma Studio: `npm run prisma -- studio` (from `backend/`).
- Ensure the backend is running before using pages that call the API (e.g., Login and Register).
- Vite proxy rewrites `/api/*` → backend without the `/api` prefix (configured in `frontend/vite.config.js`).

## Troubleshooting

- Prisma errors about `DATABASE_URL`: ensure `backend/.env` defines a valid SQLite URL like `file:../data/db/db.sqlite` and rerun `npm run prisma:generate`.
- Port in use: change `SERVER_PORT` in `backend/.env` and restart; update proxy target in `frontend/vite.config.js` if needed.
- Unique email conflicts: API returns HTTP 409 with `{ message: 'Email already in use' }`.

## License

MIT — see `LICENSE`.
