# 21CA Web Platform

A modern educational platform built with Next.js 15, featuring a community forum, program management, and student dashboards.

## Features

- **Program Management**: Browse and enroll in various educational programs.
- **Community Forum**: Interactive platform for students to share posts, discuss topics, and engage with peers.
- **Student Dashboard**: Personalized dashboard for tracking progress, viewing certificates, and accessing community features.
- **Certificates**: Track and view earned certificates from completed programs.
- **Authentication**: Secure user authentication and management via [Clerk](https://clerk.com/).
- **Payments**: Integrated payment processing with [Stripe](https://stripe.com/).
- **Database**: Robust data management using [Prisma ORM](https://www.prisma.io/) and PostgreSQL.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Prisma](https://www.prisma.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Auth**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **State Management & Data Fetching**: React Server Components & API Routes
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk Account
- Stripe Account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd 21ca-web-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/21ca_db"
   
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   CLERK_WEBHOOK_SECRET=whsec_...
   AFRIPAY_APP_ID=4_....
   AFRIPAY_APP_SECRET=J_.....
   ```

4. Database Setup:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run sync-clerk-users`: Syncs users from Clerk to the local database.

## Clerk Webhooks

The platform uses Clerk webhooks to sync user data to the database. Ensure you configure a webhook in the Clerk Dashboard pointing to `/api/webhooks/clerk` with the `user.created` and `user.updated` events.

## License

This project is private and not licensed for public use.
