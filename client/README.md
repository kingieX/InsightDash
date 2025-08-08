# InsightDash Frontend

## Overview

The frontend for **InsightDash** is built with **Next.js + Tailwind CSS** to deliver a responsive and modern user experience for uploading data, viewing AI-generated insights, and managing user accounts.

## Features

- **Authentication pages** (Sign in / Sign up) integrated with backend JWT auth.
- **Dashboard** to view uploaded insights and quick stats.
- **Insight detail pages** with Markdown rendering & chart visualization.
- **Profile management** (update info, change password).
- **Generate insight page** for generating insight using parsed JSON data from uploaded file.
- **Privacy Policy**, **Terms of Service**, and **Contact** pages.
- **Light/Dark mode** toggle.
- **AOS animations** for smooth transitions.

## Technologies Used

- Next.js
- Tailwind CSS
- React Context API for auth
- AOS (Animate On Scroll)
- Chart.js for visualizations
- Sonner for toast notifications
- Axios for API requests
- Shadcn for components generation

## Project Structure

```
frontend/
│── app/
│   ├── auth/           # Auth pages
│   ├── dashboard/      # Dashboard page
│   ├── insight/        # Generate insight page
│   ├── insights/       # Insight detail pages
│   ├── profile/        # Profile management
│   ├── privacy/        # Privacy Policy
│   ├── terms/          # Terms of Service
│   └── contact/        # Contact page
│── components/         # Reusable UI components
│── context/            # Auth context
│── styles/             # Tailwind styles
│── package.json
│── README.md
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_BACKEND_URL=https://insightdash-backend-nfag.onrender.com
```

## Running Locally

```bash
npm install
npm run dev
```

## Deployment

- Hosted on **Vercel**
- Connects to backend hosted on **Render**
