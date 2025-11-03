# Copilot instructions for DND-Simple

These notes help AI coding agents work productively in this repo. Focus on concrete patterns used here, not generic advice.

## Big picture
- Two apps in one repo:
  - backend (Fastify v5, ESM) exposes a REST API with OpenAPI/Swagger and uses Prisma ORM with SQLite.
  - frontend (React 19 + react-router-dom 7, Vite) uses MUI + styled-components with a shared theme.
- Dev server proxy: the frontend proxies requests from `/api/*` to the backend on `http://127.0.0.1:8000` (see `frontend/vite.config.js`). Prefer `/api` in client calls.

## Run and dev workflows
- Backend (from `backend/`):
  - Dev: `npm run dev` (Node native --watch)
  - Start: `npm start`
  - Swagger UI: http://localhost:8000/docs (raw JSON at `/docs/json`) — also linked in `README.md`.
- Frontend (from `frontend/`):
  - Dev: `npm run dev` (Vite)
  - Build: `npm run build`; Preview: `npm run preview`
  - Lint: `npm run lint`

## API and data layer
- Server setup: `backend/server.js` registers Swagger, then mounts routers:
  - Users: `fastify.register(users, { prefix: '/users' })`
  - Campaigns: `fastify.register(campaigns, { prefix: '/campaigns' })`
  - Campaign Users (membership): `fastify.register(campaignUsers, { prefix: '/campaign-users' })`
- Database: Prisma ORM with SQLite. Schema and migrations live in `backend/prisma/`. Run `npm run prisma:generate` after schema changes, and use `npm run prisma:migrate` for migrations.
- Users router: `backend/routers/users/` defines CRUD + auth:
  - `GET /users` list; `GET /users/:id`; `POST /users` create (email unique);
  - `PUT/PATCH /users/:id` update with conflict checks; `DELETE /users/:id` remove;
  - `POST /users/login` checks hashed password with bcrypt.
  - `GET /users/:id/campaigns` lists campaigns for the user with their role.
- Campaigns router: `backend/routers/campaigns/` defines:
  - `GET /campaigns` (optional `?creatorId=` filter); `GET /campaigns/:id`;
  - `POST /campaigns` creates a campaign and automatically adds the creator as role `DM` in membership;
  - `GET /campaigns/:id/users` lists users (with role) in a campaign.
- Campaign Users router: `backend/routers/campaign_users/` manages memberships:
  - `GET /campaign-users` list memberships (filters: `campaignId`, `userId`);
  - `POST /campaign-users` adds a membership; role defaults to `Player` unless user is the creator (`DM`).
  - `PATCH /campaign-users` updates role; constraints enforced below.
  - `DELETE /campaign-users` removes membership.
- Business rules for roles:
  - Creator must have role `DM`.
  - Only the creator can be `DM`; non-creators cannot be `DM`.
- Validation/docs: Each route attaches JSON schema from `schemas.js` to drive validation and Swagger generation. New routes should follow this pattern.
- Prisma notes: Handle unique constraint `P2002` (e.g., duplicate membership/email) and foreign key `P2003` (invalid ids).

## Frontend patterns
- Entry: `src/main.jsx` wraps the app with both MUI and styled-components ThemeProviders using a single theme from `src/theme.js`.
- Routing: `src/App.jsx` declares routes under a layout wrapper `components/AppLayout.jsx` (header + `<Outlet />`). Add pages in `src/pages/` and wire them in `App.jsx`.
- Styling: MUI components with `styled-components` for minor layout wrappers. Keep theme additions in `theme.js` so both libraries share tokens.
- API calls: Use `import.meta.env.VITE_API_BASE_URL || '/api'` as the base. Do not hardcode backend URLs. Example:
  ```js
  const ApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
  await fetch(`${ApiBaseUrl}/users/login`, { method: 'POST', ... })
  ```
- State naming: This project intentionally uses PascalCase for React state variables and setters (e.g., `const [Email, SetEmail] = useState('')`). Follow this convention.

## Code style
- Indentation: use 4-space increments throughout the repo (no tabs).

## Environment variables
- Backend (`.env` in `backend/`):
  - `SERVER_IP` (default `127.0.0.1`), `SERVER_PORT` (default `8000`)
  - `DATABASE_URL` (Prisma SQLite connection string, e.g., `file:../data/db/db.sqlite`)
  - `SALT_ROUNDS` (bcrypt cost, default `10`)
- Frontend (`.env` in `frontend/`):
  - `VITE_API_BASE_URL` to override `/api` (e.g., for production or when proxy is disabled)

## Common extension points
- New backend feature:
  1) Create `backend/routers/<feature>/router.js` + `schemas.js`.
  2) Export the Fastify plugin as default and register it in `server.js` with a `prefix`.
  3) Define route-level schemas for request/response; use Prisma Client for data access, and handle `P2002`/`P2003` errors.
- New frontend page:
  1) Add a component under `frontend/src/pages/`.
  2) Import and register a `<Route />` in `src/App.jsx` under the `<AppLayout />` wrapper.
  3) Use the shared theme and the `/api` base for network calls.

## References
- Backend entry: `backend/server.js`.
- Router schemas: `backend/routers/*/schemas.js` (`users`, `campaigns`, `campaign_users`).
- Prisma schema/migrations: `backend/prisma/`.
- Frontend entry: `frontend/src/main.jsx`, routing: `frontend/src/App.jsx`, layout: `frontend/src/components/AppLayout.jsx`, theme: `frontend/src/theme.js`
- API docs: `README.md` and Swagger at `/docs`
