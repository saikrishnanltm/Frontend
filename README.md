# codebase12 frontend

Landing page + demo UI for codebase12 — ask any public GitHub repo a
question and get an answer cited to the exact file and line.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Talks to the CodeSage backend (FastAPI, deployed on Railway) via
  `lib/codesage-client.ts`

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 for the landing page, /demo for the working UI.

## Wiring up the backend

Set one environment variable, pointing at your Railway deployment:

```
NEXT_PUBLIC_CODESAGE_API_URL=https://<your-codesage-app>.up.railway.app
```

Locally: put it in a `.env.local` file. On Vercel: add it under
Project Settings → Environment Variables.

## Deploying to Vercel + your domain

1. Push this project to a GitHub repo.
2. On vercel.com, "Add New Project" → import that repo. Vercel
   auto-detects Next.js, no config needed.
3. Add the `NEXT_PUBLIC_CODESAGE_API_URL` env var before the first deploy.
4. Once deployed, go to Project Settings → Domains and add both:
   - `codebase12.app`
   - `www.codebase12.app`
5. Vercel will show the DNS records to add. Since you're managing DNS
   already (the domain shows as "Managed" with a DNS tab), add:
   - an `A` record for `codebase12.app` → `76.76.21.21`
   - a `CNAME` for `www` → `cname.vercel-dns.com`
   (Vercel's dashboard will give you the exact current values — use those
   if they differ.)
6. Set one of the two as the primary domain in Vercel and it'll redirect
   the other automatically.

## Project structure

```
app/
  page.tsx              landing page
  demo/page.tsx          repo input + chat UI
  layout.tsx             fonts, metadata
  globals.css
components/
  RepoInput.tsx           repo URL form
  ChatMessage.tsx         renders a chat turn
  CitationLink.tsx         file:line -> GitHub link
lib/
  codesage-client.ts       fetch wrapper for /ingest, /query, /health
```
