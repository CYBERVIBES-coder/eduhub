# EduHub - Education Studies Platform

A modern, full-stack education platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CYBERVIBES-coder/eduhub.git
   cd eduhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/eduhub"
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```
   This creates the database schema based on `prisma/schema.prisma`.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eduhub/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable React components
│   └── lib/               # Utility functions & helpers
├── .env.example           # Environment variables template
├── BUILD_PLAN.md          # Detailed build phases
└── README.md              # This file
```

## Development Phases

See [BUILD_PLAN.md](./BUILD_PLAN.md) for detailed phase-by-phase instructions.

- **Phase 1**: Database schema (✓ Complete)
- **Phase 2**: Authentication
- **Phase 3**: Course & lecture pages
- **Phase 4**: Assignments & submissions
- **Phase 5**: Instructor grading view
- **Phase 6**: Dashboards
- **Phase 7**: Polish & accessibility

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio GUI

# Linting
npm run lint             # Run ESLint
```

## Database Schema

Core models implemented in Phase 1:

- **User**: Authentication & role management (STUDENT, INSTRUCTOR, ADMIN)
- **Course**: Course metadata and instructor assignment
- **Lecture**: Ordered lectures with video/notes/attachments
- **LectureAttachment**: Slides, PDFs, and supplementary materials
- **Assignment**: Assignment titles, descriptions, and deadlines
- **Submission**: Student submissions with grades and feedback
- **Enrollment**: Student course registrations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (frontend) + Supabase/Railway (database)

## License

MIT
