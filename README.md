# Wilson Huang — Personal Portfolio

A single-page portfolio showcasing Wilson Huang's background, skills, and software projects.

Built with React, Vite, Framer Motion, and React Scroll. The portfolio highlights frontend, Python backend, API, and Azure cloud experience.

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Production service

The production image builds the React app and serves it from FastAPI. It also exposes:

- `GET /api/health` for container and proxy health checks.
- `POST /api/contact` for validated, rate-limited delivery through Resend.

Copy `.env.example` to `.env` and configure a Resend API key before starting the service:

```bash
docker compose up -d --build
```
