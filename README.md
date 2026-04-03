# 🛍️ Make To Be

Premium E-commerce Online Shop built with React, Tailwind CSS, and Supabase.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmohamedsamthi%2Fmake-to-be&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY&project-name=make-to-be&repo-name=make-to-be)

## Features
- **Modern UI**: Built with Tailwind CSS and glassmorphism styling
- **Full Products CRUD**: Admin panel for adding, updating, and deleting products
- **Real-time Sync**: Shared `ProductContext` syncs admin changes to customer store instantly
- **Order Tracking**: Customer order tracking 
- **Admin Dashboard**: Live metrics for revenue, active customers, orders, and expenses

## Setup
1. Clone the repository
2. Run `npm install`
3. Connect your Supabase database using the `supabase_schema.sql` file
4. Add `.env.local` file with:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```
5. Run `npm run dev` to start the local development server

## Vercel deployment
- **Framework:** Vite (auto-detected). **Build:** `npm run build` → output `dist/`.
- In the Vercel project, add **Environment Variables** for **Production** and **Preview**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Redeploy after changing env vars (Vite bakes `VITE_*` in at build time).
- SPA routing uses `vercel.json` rewrites to `index.html`.

## Admin Demo Login
`Username:` samthi
`Password:` 5099
