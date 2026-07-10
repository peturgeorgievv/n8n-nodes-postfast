# CLAUDE.md

## Constellation
- This node mirrors the PostFast backend's `pf-api-key` REST surface. The backend repo (`social-schedule-service`) is the source of truth — its `docs/periphery.md` holds the map of downstream repos.
- When the BE REST surface changes (routes, DTOs, enums, limits), sync the node's parameters, enum options, and `qs`/body mapping here.
- Releases happen via GitHub Actions on tag push (`.github/workflows/publish.yml`, npm trusted publishing) — never `npm publish` locally.
- Before committing: `npm run build && npm run lint`.

## Project Overview
n8n community node for the PostFast social media scheduling API (https://postfa.st).

## Commands
- `npm run build` — Compile TypeScript and copy static files (must pass before committing)
- `npm run lint` — Run n8n ESLint rules
- `npm run lint:fix` — Auto-fix lint issues
- `npm run dev` — Start dev mode

## Architecture
- Single node: `nodes/PostFast/PostFast.node.ts` — all resources, operations, and execution logic
- Credentials: `credentials/PostFastApi.credentials.ts` — API key auth via `pf-api-key` header
- Base API URL: `https://api.postfa.st`

## Resources & Operations
- **File**: Get Upload URL (`POST /file/get-signed-upload-urls`)
- **Social Account**: Get All (`GET /social-media/my-social-accounts`), Get Pinterest Boards (`GET /social-media/:id/pinterest-boards`), Get YouTube Playlists (`GET /social-media/:id/youtube-playlists`)
- **Social Post**: Create (`POST /social-posts`), Get Many (`GET /social-posts`), Get Analytics (`GET /social-posts/analytics`), Delete (`DELETE /social-posts/:id`)

## Before Committing
1. `npm run build` must succeed
2. `npm run lint` must pass with no errors
