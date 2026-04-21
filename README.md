# README.md

## Overview
**ap‑express‑js‑server** is a lightweight TypeScript / Express server that aggregates data from a few third‑party services (Spotify, Steam, Letterboxd) and exposes them through a clean, REST‑style API. The project is set up for rapid local development with hot‑reloading, and it can be compiled to a production‑ready bundle.

---

## Prerequisites

| Requirement | Why |
|-------------|-----|
| **Node ≥ 20** (LTS) | Runs the TypeScript compiler and development server. |
| **npm** (comes with Node) | Installs dependencies and runs scripts defined in `package.json`. |
| **Git** | Version control – the repo is already a Git repository. |
| **API credentials** for the external services you intend to use (Spotify, Steam, Letterboxd).  Put them in a `.env` file (see *Configuration*). |

---

## Installation

```bash
# Clone the repo (if you haven’t already)
git clone https://github.com/your‑org/ap-express-js-server.git
cd ap-express-js-server

# Install dependencies
npm install
```

> **Note:** `node_modules/` and compiled output `dist/` are excluded via `.gitignore`.

---

## Configuration

Create a `.env` file in the project root (it is already ignored by Git). The server expects the following variables – adjust the names/values to match the credentials you obtain from each provider:

```dotenv
# General
PORT=3000               # optional – defaults to 3000
NODE_ENV=development    # set to 'production' in the deployed environment

# Spotify (OAuth client credentials)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/spotify/callback   # if using auth flow

# Steam
STEAM_API_KEY=your_steam_api_key

# Letterboxd (if applicable)
LETTERBOXD_API_KEY=your_letterboxd_api_key
```

The server loads this file automatically when `process.env.NODE_ENV !== 'production'`.

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

Open a browser to `http://localhost:3000/` to see the auto‑generated API documentation page (`public/api.html`).

---

## API Documentation

The server provides three logical service groups. All endpoints are mounted under the base URL `http://localhost:3000`.

| Service | Base Path | Endpoints |
|---------|-----------|-----------|
| **Core** | `/` | `GET /` – API index page (documentation).<br>`POST /echo` – Returns the JSON body you send. |
| **Spotify** | `/spotify` | `GET /user` – Authenticated user profile.<br>`GET /current_track` – Currently playing track.<br>`GET /tracks` – Top tracks (query: `time_range`, `limit`, `offset`).<br>`GET /artists` – Top artists (same query params). |
| **Steam** | `/steam` | `GET /owned_games` – List games owned by the user.<br>`GET /current_game` – Currently played game. |
| **Letterboxd** | `/letterboxd` | `GET /recent` – Recent watch entries. |

For a quick visual reference, open `http://localhost:3000/` – the HTML page (`public/api.html`) contains the same tables shown above.

---

## Project Structure

```
├─ src/
│  ├─ components/
│  │  ├─ controllers/          # Thin HTTP layer (Express routers)
│  │  │   ├─ main/             # Core endpoints (/, /echo)
│  │  │   ├─ spotify/          # Spotify controller
│  │  │   ├─ steam/            # Steam controller
│  │  │   └─ letterboxd/       # Letterboxd controller
│  │  └─ services/             # Business logic & API clients
│  │      ├─ spotify/
│  │      ├─ steam/
│  │      └─ letterboxd/
│  ├─ models/                  # TypeScript types / shared utilities
│  └─ index.ts                 # Application entry point (express setup)
├─ public/
│   └─ api.html                # Human‑readable API documentation page
├─ .env                        # Runtime configuration (not checked in)
├─ .gitignore                  # Ignores node_modules, dist, .env, .claude
├─ package.json
├─ tsconfig.json
└─ CLAUDE.md                   # Guidance for Claude Code (auto‑generated)
```

*Controllers* receive a service instance via constructor injection and simply forward HTTP requests to service methods. *Services* encapsulate external‑API calls and any necessary data transformation.

---

## Adding New Endpoints

1. **Create a service** (if you need new business logic) under `src/components/services/...`.  
2. **Create a controller** under `src/components/controllers/...` that injects the service and defines routes.  
3. **Mount the controller** in `src/index.ts` (`app.use('/your_route', new YourController(yourService).router);`).  
4. **Update `public/api.html`** (or generate it dynamically) to reflect the new endpoint.

---

## Deployment

1. Build the production bundle

   ```bash
   npm run build
   ```

2. Copy the `dist/` folder and the `.env` file to your server.
3. Run with Node:

   ```bash
   NODE_ENV=production npm start
   ```

Make sure the host environment has the same Node version and the required environment variables.

---

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/your‑feature`).
3. Develop using `npm run dev`.
4. Write or update tests (once a test framework is added).
5. Lint/format (the repo currently relies on TypeScript compiler checks).
6. Submit a Pull Request – the auto‑generated `CLAUDE.md` will help Claude Code reviewers understand the project quickly.

---

## License

This project is MIT‑licensed – see the `LICENSE` file for details.

---

**Happy coding!** If anything is unclear or you need additional setup steps, just let me know.
