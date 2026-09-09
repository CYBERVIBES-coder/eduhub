# EduHub - Education Studies Platform

A modern, full-stack education platform built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

✅ **Phase 1-7 Complete**

### Authentication & Authorization
- Email/password registration and login with bcryptjs hashing
- NextAuth.js with Prisma adapter
- Role-based access control (Student, Instructor, Admin)
- Protected routes with middleware

### Courses & Lectures
- Browse published courses with cover images
- Detailed course pages with lecture lists
- Video lecture viewer with markdown notes
- Downloadable course materials (PDFs, slides, etc.)

### Assignments & Submissions
- Create assignments with deadlines and max points
- Text-based student submissions
- View submission status and deadlines
- One submission per assignment per student

### Grading
- Instructor grading interface with all submissions
- Inline grade entry and feedback
- Student feedback and grade display
- Grade history and tracking

### Dashboards
**Students:**
- Enrolled courses at a glance
- Upcoming deadlines (14-day window)
- Recent grades and scores
- Quick access to assignments

**Instructors:**
- Courses taught with enrollment counts
- Pending grading indicators
- Submission management
- Grade tracking per course

### UI/UX Polish
- Loading states and skeleton screens
- Error boundaries for graceful error handling
- Empty states with helpful messaging
- Responsive design (mobile, tablet, desktop)
- Accessible forms and navigation
- Modern Tailwind CSS styling
- Clean typography and contrast

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
   npm install react-markdown  # For Phase 3 lecture notes
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/eduhub"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
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
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login/Register pages
│   │   ├── api/                # API routes
│   │   ├── courses/            # Course & lecture pages
│   │   ├── dashboard/          # Role-based dashboards
│   │   ├── instructor/         # Grading pages
│   │   ├── layout.tsx          # Root layout with error boundary
│   │   ├── globals.css         # Global styles
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ErrorBoundary.tsx   # Error boundary
│   │   ├── Loading.tsx         # Loading spinners/skeletons
│   │   ├── EmptyState.tsx      # Empty state component
│   │   ├── LoginForm.tsx       # Login form
│   │   └── RegisterForm.tsx    # Registration form
│   ├── lib/
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth-utils.ts       # Password hashing utilities
│   │   ├── validation.ts       # Form validation
│   │   └── hooks.ts            # Custom React hooks
│   └── middleware.ts           # Route protection middleware
├── .env.example                # Environment variables template
├── BUILD_PLAN.md               # Detailed build phases
├── README.md                   # This file
└── package.json
```

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

### Core Models

- **User** - Authentication & roles (STUDENT, INSTRUCTOR, ADMIN)
- **Course** - Course metadata, instructor assignment
- **Lecture** - Ordered lectures with video/notes/attachments
- **LectureAttachment** - Slides, PDFs, supplementary materials
- **Assignment** - Assignment titles, descriptions, deadlines, max points
- **Submission** - Student responses with grades and feedback
- **Enrollment** - Student course registrations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS (responsive, accessible)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Prisma adapter
- **Security**: bcryptjs for password hashing
- **Markdown**: react-markdown for lecture notes
- **Deployment**: Vercel (frontend) + Supabase/Railway (database)

## Development Phases

See [BUILD_PLAN.md](./BUILD_PLAN.md) for detailed phase-by-phase implementation guide.

- ✅ **Phase 1**: Database schema
- ✅ **Phase 2**: Authentication (login/register)
- ✅ **Phase 3**: Course & lecture pages
- ✅ **Phase 4**: Assignments & submissions
- ✅ **Phase 5**: Instructor grading view
- ✅ **Phase 6**: Role-aware dashboards
- ✅ **Phase 7**: Polish (loading states, error handling, improved landing page)

## Future Enhancements

- Discussion/Q&A per lecture (Phase 6+)
- File uploads for submissions
- Email notifications for deadlines
- Google/Microsoft OAuth
- Admin panel for user management
- Course analytics and reporting
- Mobile app

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact the development team.
