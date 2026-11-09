# README.md

## Overview
**ap‑express‑js‑server** (published as `melzarr-api`) is a lightweight TypeScript / Express server that aggregates data from several third‑party services (Spotify, Steam, Letterboxd, Last.fm) and exposes them through a clean, REST‑style API. It is set up for rapid local development with hot‑reloading, compiles to a production bundle, and is deployed on Vercel at **https://melzar-api.vercel.app**.

---

## Prerequisites

| Requirement | Why |
|-------------|-----|
| **Node ≥ 20** (LTS) | Runs the TypeScript compiler and development server. |
| **npm** (comes with Node) | Installs dependencies and runs scripts defined in `package.json`. |
| **Git** | Version control – the repo is already a Git repository. |
| **API credentials** for the external services you intend to use (Spotify, Steam, Letterboxd, Last.fm, Vercel). Put them in a `.env` file (see *Configuration*). |

---

## Installation

```bash
# Clone the repo (if you haven’t already)
git clone https://github.com/melzarjanchico/ap-express-js-server.git
cd ap-express-js-server

# Install dependencies
npm install
```

> **Note:** `node_modules/` and compiled output `dist/` are excluded via `.gitignore`.

---

## Configuration

Create a `.env` file in the project root (it is already ignored by Git). The server expects the following variables:

```dotenv
# General
PORT=3000                       # optional – defaults to 3000
NODE_ENV=development            # set to 'production' in the deployed environment

# Spotify (OAuth)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
SPOTIFY_CLIENT_URL=https://melzar-api.vercel.app   # used to build the OAuth redirect URI in production
SPOTIFY_RENEW_USERNAME=your_renew_username         # HTTP Basic auth for GET /spotify/renew
SPOTIFY_RENEW_PASSWORD=your_renew_password

# Steam
STEAM_API_KEY=your_steam_api_key
STEAM_ID=your_steam_id

# Letterboxd (public RSS feed)
LETTERBOXD_RSS_URL=https://letterboxd.com/your_username/rss/

# Last.fm
LASTFM_USERNAME=your_lastfm_username
LASTFM_API_KEY=your_lastfm_api_key

# Redis / Upstash (used by VS Code presence storage)
KV_REST_API_URL=your_upstash_rest_api_url
KV_REST_API_TOKEN=your_upstash_rest_api_token

# VS Code Presence (API token protecting POST /vscode/presence)
VSCODE_PRESENCE_API_TOKEN=your_vscode_presence_api_token

# Vercel (used to rotate the Spotify refresh token automatically)
VERCEL_TOKEN=your_vercel_token
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_DEPLOY_HOOK_URL=your_vercel_deploy_hook_url
VERCEL_SPOTIFY_REFRESH_TOKEN_ENV_ID=env_id_of_SPOTIFY_REFRESH_TOKEN
VERCEL_SPOTIFY_REFRESH_TOKEN_ENV_KEY=env_key_of_SPOTIFY_REFRESH_TOKEN
```

Notes:

- The server loads `.env` automatically when `process.env.NODE_ENV !== 'production'`.
- There is **no** `SPOTIFY_REDIRECT_URI` variable. The redirect URI is derived: `http://127.0.0.1:3000/spotify/renew/callback` locally, and `${SPOTIFY_CLIENT_URL}/spotify/renew/callback` in production.
- The Vercel variables are **required at boot** – `VercelService` and `SpotifyController` throw if they are missing.

---

## Development

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the server in watch mode with `ts-node-dev`. Code changes trigger an automatic restart. |
| `npm run build` | Compiles TypeScript (`src/**.ts`) to JavaScript in the `dist/` folder. |
| `npm start` | Runs the compiled server (`node dist/index.js`). Use this in production after `npm run build`. |
| `npm test` | *(No test suite yet – add one when you introduce tests).* |

**Running locally**

```bash
npm run dev
# Server starts at http://localhost:3000
```

Open a browser to `http://localhost:3000/` to see the API documentation page (`public/api.html`).

---

## API Documentation

All endpoints are mounted under the base URL `http://localhost:3000` (or `https://melzar-api.vercel.app` in production).

| Service | Base Path | Endpoints |
|---------|-----------|-----------|
| **Core** | `/` | `GET /` – API documentation page.<br>`POST /echo` – Returns the JSON body you send. |
| **Spotify** | `/spotify` | `GET /user` – Authenticated user profile.<br>`GET /current_track` – Currently playing track.<br>`GET /tracks` – Top tracks (query: `time_range`, `limit`, `offset`).<br>`GET /artists` – Top artists (same query params).<br>`GET /wrapped/:year` – Playlist for a given Wrapped year (2019–2025).<br>`GET /renew` – Starts the OAuth flow to rotate the refresh token (HTTP Basic auth required).<br>`GET /renew/callback` – OAuth callback; updates the Vercel env var and triggers a redeploy. |
| **Steam** | `/steam` | `GET /owned_games` – List games owned by the user.<br>`GET /current_game` – Currently played game. |
| **Letterboxd** | `/letterboxd` | `GET /recent` – Recent watch entries (parsed from the RSS feed). |
| **Last.fm** | `/lastfm` | `GET /recent_track` – Most recent scrobble (query: `limit`).<br>`GET /top_tracks` – Top tracks (query: `limit`, `period`).<br>`GET /top_artists` – Top artists (query: `limit`, `period`).<br>`GET /top_albums` – Top albums (query: `limit`, `period`). |
| **VS Code** | `/vscode` | `GET /presence` – Latest VS Code presence (status, project, workspace, file, language). Returns `offline` when none set. |

For a quick visual reference, open `http://localhost:3000/` – the HTML page (`public/api.html`) contains the same tables plus an interactive request tester.

### Spotify token renewal

Spotify refresh tokens can expire. `GET /spotify/renew` (protected by HTTP Basic auth using `SPOTIFY_RENEW_USERNAME` / `SPOTIFY_RENEW_PASSWORD`) redirects to Spotify’s consent screen. On callback, the new refresh token is written to the Vercel project’s environment variable (`VERCEL_SPOTIFY_REFRESH_TOKEN_ENV_ID`) and a new deployment is triggered via the deploy hook.

---

## Project Structure

```
├─ src/
│  ├─ components/
│  │  ├─ controllers/          # Thin HTTP layer (Express routers)
│  │  │   ├─ main/             # Core endpoints (/, /echo)
│  │  │   ├─ spotify/          # Spotify controller (incl. /renew flow)
│  │  │   ├─ steam/            # Steam controller
│  │  │   ├─ letterboxd/       # Letterboxd controller
│  │  │   ├─ lastfm/           # Last.fm controller
│  │  │   └─ vscode/           # VS Code presence controller
│  │  ├─ middlewares/          # Route-level authorization middleware
│  │  │   ├─ spotify/          # Spotify /renew basic-auth middleware
│  │  │   └─ vscode/           # VS Code presence bearer-token middleware
│  │  └─ services/             # Business logic & API clients
│  │      ├─ spotify/
│  │      │   ├─ auth/         # OAuth token handling
│  │      │   └─ main/         # Spotify Web API calls
│  │      ├─ steam/
│  │      ├─ letterboxd/
│  │      ├─ lastfm/
│  │      ├─ vercel/           # Env-var updates & deploy hooks
│  │      └─ vscode/           # VS Code presence storage (Redis/Upstash)
│  ├─ data/
│  │   └─ wrapped.ts           # Spotify Wrapped playlist URLs by year
│  ├─ models/                  # TypeScript types / shared utilities
│  └─ index.ts                 # Application entry point (express setup)
├─ public/
│   └─ api.html                # Human‑readable API documentation page
├─ .env                        # Runtime configuration (not checked in)
├─ .gitignore                  # Ignores node_modules, dist, .env, .claude
├─ package.json
├─ tsconfig.json
└─ CLAUDE.md                   # Guidance for Claude Code
```

*Controllers* receive service instances via constructor injection and forward HTTP requests to service methods. *Services* encapsulate external‑API calls and any necessary data transformation.

---

## Adding New Endpoints

1. **Create a service** (if you need new business logic) under `src/components/services/...`.
2. **Create a controller** under `src/components/controllers/...` that injects the service and defines routes.
3. **Mount the controller** in `src/index.ts` (`app.use('/your_route', new YourController(yourService).router);`).
4. **Update `public/api.html`** to reflect the new endpoint (the tables and the request tester’s endpoint map).

---

## Deployment

The project is deployed on Vercel. To deploy manually:

1. Build the production bundle

   ```bash
   npm run build
   ```

2. Run with Node:

   ```bash
   NODE_ENV=production npm start
   ```

Make sure the host environment has the same Node version and all required environment variables. In production, `SPOTIFY_CLIENT_URL` must point at the public base URL so the OAuth redirect URI resolves correctly.

---

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/your‑feature`).
3. Develop using `npm run dev`.
4. Write or update tests (once a test framework is added).
5. Lint/format (the repo currently relies on TypeScript compiler checks).
6. Submit a Pull Request.

---

## License

This project is ISC‑licensed – see `package.json` for details.

---

**Happy coding!** If anything is unclear or you need additional setup steps, just let me know.
