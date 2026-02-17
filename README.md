# AI Future Fit Discovery Assessment (ELVEX)

This is a Vite + React assessment app that runs fully in the browser and can be deployed as a static site (no server required).

## Run locally

Prerequisites: Node.js (LTS)

1) Install dependencies  
`npm install`

2) Start the dev server  
`npm run dev`

## Build for production

`npm run build`  
The production output will be in the `dist/` folder.

## Deployment notes

- This version does not call any external AI API from the browser, so it can be deployed safely to GitHub + Cloudflare Pages without exposing keys.
- If you want AI-written narratives later, send the answers to a Make webhook and generate the report server-side (keep keys off the client).

## Branding

Framework name is defined in `constants.ts`.
