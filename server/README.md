# InsightDash Backend

## Overview

The backend for **InsightDash** powers the AI-driven insights platform by providing APIs for authentication, file uploads, insight generation, and user profile management.

Built with **Node.js + Express**, it integrates **PostgreSQL** (via Prisma ORM) for database management and **Gemini AI API** for generating insights.

## Features

- **JWT Authentication** with `bcrypt` for secure password hashing.
- **CSV Upload** handling with `UploadThing`.
- **AI-powered insight generation** using Google Gemini API.
- **User profile management** (view, update, change password).
- **Insight management** (create, fetch, delete).
- **CORS-enabled** for secure API access from frontend.
- **Deployed on Render**.

## Technologies Used

- Node.js + Express
- Prisma ORM + PostgreSQL
- JWT + bcrypt
- UploadThing
- Gemini AI API
- CORS middleware
- Render for deployment

## Project Structure

```
backend/
│── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Auth middleware
│   ├── prisma/         # Database schema
│   ├── routes/         # API route definitions
│   ├── utils/          # Helper functions
│   └── index.js       # Main app entry
│── package.json
│── prisma/schema.prisma
│── README.md
```

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

## Running Locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

## Deployment

- Hosted on **Render**
- Connects to **Supabase PostgreSQL**
