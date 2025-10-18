# Codebuddie

Codebuddie is a lightweight, realtime collaborative code editor built with React, CodeMirror and Socket.IO. It provides room-based collaboration so multiple users can join the same room and edit code together in real time. The project is split into a `client` (React + Vite) and a `server` (Node + Express + Socket.IO).

This README documents how to run the project locally, explains the main architecture and socket events, and suggests next steps to harden and scale the application.

---

## Table of contents

- [Features](#features)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
  - [Server](#server)
  - [Client](#client)
- [Environment variables](#environment-variables)
- [Socket events (summary)](#socket-events-summary)
- [How collaboration works (brief)](#how-collaboration-works-brief)
- [Testing and linting](#testing-and-linting)
- [Recommended improvements / roadmap](#recommended-improvements--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Room-based realtime code editing using Socket.IO
- Basic user presence (sidebar shows connected users)
- Live code synchronization across clients (broadcasting document updates)
- Room shareable link generation and clipboard copy
- (Server) Optional JWT-based auth endpoint available
- Live cursors and presence support has been added (server + client signalling)

---

## Repository structure

Top-level folders:

- `client/` — React front-end (Vite). Contains components including `Editor`, `EditorPage`, `Client` (user entry in sidebar), and the socket helper (`src/socket.js`).
- `server/` — Express + Socket.IO server. Main entry `server/index.js`.

Important files to know:

- `client/src/components/Editor.jsx` — CodeMirror editor integration and client-side socket listeners/emitters for code and cursor updates.
- `client/src/components/EditorPage.jsx` — Room page and UI (user list, copy link, leave room).
- `server/index.js` — Socket.IO event handlers and HTTP endpoints.

---

## Prerequisites

- Node.js (v18+ recommended)
- npm (or yarn)

<!-- Optional (for production features):
- Redis (for state persistence and Socket.IO adapter when scaling) -->

---

## Local development

Open two terminals (one for server, one for client). From the repository root:

### Server

1. Install dependencies and start the server

```bash
cd server
npm install
node index.js
```

The server listens on port `4000` by default (`http://localhost:4000`). The server file is `server/index.js` and contains the Socket.IO handlers and a simple `/auth/login` endpoint (JWT) if you choose to use authentication.

### Client

1. Install dependencies and start the Vite dev server

```bash
cd client
npm install
npm run dev
```

1. Open the URL printed by Vite (usually `http://localhost:5173`).

1. Use the Home page to create or join a room. Use the generated "Copy Link" button to copy a full shareable link (e.g. `http://localhost:5173/editor/<roomId>`).

---

## Environment variables

The repo uses a few environment values (defaults are provided in code for development):

- `PORT` — server port (default `4000`)
- `JWT_SECRET` — secret used by the server when issuing/verifying JWTs (only relevant if you use the optional auth endpoints)
- `VITE_REACT_APP_BACKEND_URL` — (client) base URL for the backend (default `http://localhost:4000`)

You can place client environment variables in a `.env` file under `client/` following Vite conventions (for example: `VITE_REACT_APP_BACKEND_URL=http://localhost:4000`).

---

## Socket events (summary)

These are the main events used between client and server. Keep names consistent between client and server.

Client -> Server

- `join` — payload: `{ roomId, username }`. Used to join a room and announce presence.
- `code-change` — payload: `{ roomId, code }`. Sends the full document (current implementation).
- `cursor-change` — payload: `{ roomId, cursor }`. Sends a cursor/selection object for presence.
- `leaveRoom` — payload: `{ roomId, username }`. Called when a user intentionally leaves.

Server -> Client

- `joined` — payload: `{ clients, username, socketId }`. Sent to update the active user list.
- `code-change` — payload: `{ code }`. Broadcasted to room members when document changes.
- `cursors` — payload: `{ cursors }`. Sent once when a user joins to sync existing cursor positions in the room.
- `cursor-change` — payload: `{ socketId, username, cursor }`. Sent when a participant updates their cursor.
- `left` — payload: `{ clients, username, socketId }`. Sent when a user leaves.
- `disconnected` — payload: `{ socketId, username }`. Sent when a socket disconnects (refresh/close).

Note: If you change event names, update both client and server accordingly.

---

## How collaboration works (brief)

- The server keeps an in-memory map of the latest document per room (`roomCodeMap`) and the latest cursor positions per room (`roomCursorMap`). When a new client joins, the server sends the current code and any known cursors so the client can initialize the editor and presence UI.
- The client sends `code-change` events for edits and `cursor-change` events for caret/selection updates. The server broadcasts these to other clients in the same room.

Current limitation: the project broadcasts full-document updates on each change. For robust concurrent editing, integrate a CRDT (Yjs) or OT solution (ShareDB). See the Roadmap section.

---

## Testing and linting

- Client linting (ESLint) is configured in `client/` — run:

```bash
cd client
npm run lint
```

- Add unit and integration tests as next steps (Vitest/Jest + React Testing Library recommended).

---

## Recommended improvements / roadmap

These are prioritized suggestions to level up the project:

1. Persist `roomCodeMap` and `roomCursorMap` to Redis so room state survives server restarts and multiple server instances can share state.
2. Replace full-document broadcasting with OT/CRDT (Yjs or ShareDB) to safely merge concurrent edits.
3. Add secure authentication (OAuth/JWT) and persistent user profiles/avatars.
4. Implement in-editor live cursor overlays (colored cursor, name labels) via CodeMirror decorations.
5. Add structured logging, error reporting (Sentry), and deploy with Docker and CI/CD.
6. Rate limiting and validation on socket endpoints.

---

## Contributing

- Fork the repo, create a branch for your feature/fix, open a PR describing the change. Keep PRs small and focused.
- Add tests for new behavior and ensure lint passes.
- If you introduce new environment variables, document them in this README.

---

## Troubleshooting

- If the editor doesn't sync:
  - Ensure the front-end is pointed at the correct backend URL (check `client/src/socket.js` and `VITE_REACT_APP_BACKEND_URL`).
  - Check browser console and server logs for socket connection errors.
  - Make sure both clients are connected to the same `roomId`.

- After changing server code, restart the server to pick up changes.

---

## License

This project uses an ISC license (see `server/package.json` for license field). Change to your preferred license if needed.

---

## Docker Compose (local full-stack)

This repository includes `Dockerfile`s for `server/` and `client/` and a `docker-compose.yml` at the repo root. The compose setup runs three services:

- `server` — Node server on port 4000
- `client` — nginx serving the Vite-built static site on port 3000 (nginx proxies websocket requests to the server)
- `redis` — Redis (for state or later Socket.IO adapter use)

Quick start:

1. Copy `.env.example` to `.env` and set values as needed.

1. Build and run the stack:

```bash
docker-compose build
docker-compose up
```

1. Visit `http://localhost:3000` to open the app (client served by nginx).

Stop the stack:

```bash
docker-compose down
```

Notes:

- If you plan to run multiple server instances behind a load balancer, configure the Socket.IO Redis adapter and point `REDIS_URL` to a shared Redis instance.
- The compose file exposes the server on `4000` which is useful for debugging; in production you may not expose the server port directly and instead use a load balancer.

