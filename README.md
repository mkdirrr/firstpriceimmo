# Real Estate Agency Full-Stack Platform

## Overview
This workspace contains a full-stack real estate application using Next.js, Tailwind CSS, and Supabase.

- **Frontend**: Next.js (App Router) + Tailwind CSS UI for public listings and admin portal.
- **Backend/Database**: Supabase (PostgreSQL + Auth + Storage).
- **Hosting**: Netlify.

## Local Development Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create `frontend/.env.local` based on `frontend/.env.local.example` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```

3. Start Next.js development server:
   ```bash
   npm run dev
   ```

## Deployment
The project is configured to be deployed on **Netlify** using `@netlify/plugin-nextjs`.
Ensure that the environment variables from `.env.local.example` are set in the Netlify dashboard.

## Notes
- Public users can browse listings, filter by category/type, view details, and contact the agency.
- Admin users can log in, add/edit/delete property listings and view contacts.
