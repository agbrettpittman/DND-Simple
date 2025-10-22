# Copilot instructions for DND-Simple

These notes help AI coding agents work productively in this repo. Focus on concrete patterns used here, not generic advice.

## Big picture
- Two apps in one repo:
  - backend (Fastify v5, ESM) exposes a REST API with OpenAPI docs and a local SQLite (better-sqlite3) database.
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
- Server setup: `backend/server.js` registers Swagger, then mounts routers, e.g., `fastify.register(users, { prefix: '/users' })`.
- Database: `backend/db.js` opens `data/db/<DB_FILE or db.sqlite>` with WAL enabled, and auto-creates the `users` table and triggers on startup.
- Users router: `backend/routers/users/` defines CRUD + auth:
  - `GET /users` list; `GET /users/:id`; `POST /users` create (email unique);
  - `PUT/PATCH /users/:id` update with conflict checks; `DELETE /users/:id` remove;
  - `POST /users/login` checks hashed password with bcrypt.
- Validation/docs: Each route attaches JSON schema from `schemas.js` to drive validation and Swagger generation. New routes should follow this pattern.
- DB access uses prepared statements created once per plugin instance; keep statements at top-level within the router function.

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
  - `DB_FILE` (SQLite file name under `backend/data/db/`, default `db.sqlite`)
  - `SALT_ROUNDS` (bcrypt cost, default `10`)
- Frontend (`.env` in `frontend/`):
  - `VITE_API_BASE_URL` to override `/api` (e.g., for production or when proxy is disabled)

## Common extension points
- New backend feature:
  1) Create `backend/routers/<feature>/router.js` + `schemas.js`.
  2) Export the Fastify plugin as default and register it in `server.js` with a `prefix`.
  3) Define route-level schemas for request/response; keep prepared statements near the top.
- New frontend page:
  1) Add a component under `frontend/src/pages/`.
  2) Import and register a `<Route />` in `src/App.jsx` under the `<AppLayout />` wrapper.
  3) Use the shared theme and the `/api` base for network calls.

## References
- Backend entry: `backend/server.js`, schemas: `backend/routers/users/schemas.js`, DB: `backend/db.js`
- Frontend entry: `frontend/src/main.jsx`, routing: `frontend/src/App.jsx`, layout: `frontend/src/components/AppLayout.jsx`, theme: `frontend/src/theme.js`
- API docs: `README.md` and Swagger at `/docs`
