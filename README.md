# Real Estate Agency Full-Stack Platform

## Overview
This workspace contains a full-stack real estate application:

- `backend/`: Node.js + Express API with Prisma and PostgreSQL schema.
- `frontend/`: Next.js + Tailwind CSS UI for public listings and admin portal.

## Backend Setup
1. Configure `backend/.env` with your PostgreSQL connection:
   - `DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/realestate"`
   - `JWT_SECRET="replace-with-a-secure-secret"`
2. Install dependencies:
   - `cd backend`
   - `npm install`
3. Generate Prisma client:
   - `npx prisma generate`
4. Start development server:
   - `npm run dev`

## Frontend Setup
1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Create `frontend/.env.local` with:
   - `NEXT_PUBLIC_API_URL=http://localhost:4000`
3. Start Next.js:
   - `npm run dev`
   - If PowerShell blocks `npm run dev`, use `npm.cmd run dev` or run from Command Prompt.

## Windows helper
- From the repo root: `start-dev.cmd`

## Admin Credentials
- Email: `admin@realestate.com`
- Password: `Admin@123`

## Notes
- Public users can browse listings, filter by category/type, view details, and contact the agency.
- Admin users can log in, add/edit/delete property listings.
