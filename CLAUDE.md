# CLAUDE.md

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
- **Social Post**: Create (`POST /social-posts`), Get Many (`GET /social-posts`), Delete (`DELETE /social-posts/:id`)

## Before Committing
1. `npm run build` must succeed
2. `npm run lint` must pass with no errors
