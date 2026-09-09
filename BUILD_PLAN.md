# Education Studies Platform — Build Plan (Copilot-Ready)

This is a prompt-and-script package for building the site with GitHub Copilot. It contains:
1. A short architecture plan
2. A **master prompt** to give Copilot Chat/Agent first
3. A **scaffold script** to create the repo structure
4. **Sequential phase prompts** to feed Copilot one at a time as it builds

---

## 1. Architecture Plan (for your reference)

**Stack**
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js API routes (or separate Node/Express if you prefer a split backend)
- Database: PostgreSQL via Prisma ORM
- Auth: NextAuth.js (email/password + optional Google OAuth), roles: `student`, `instructor`, `admin`
- File storage: local `/uploads` for dev, S3-compatible bucket for production (lecture slides, PDFs, assignment submissions)
- Deployment target: Vercel (frontend) + Supabase/Railway (Postgres)

**Core modules**
- Courses & Lectures (video/slides/notes per lecture)
- Assignments (create, submit, grade, deadlines)
- Dashboards (student progress, instructor gradebook)
- Auth & Roles
- Discussion/Q&A per lecture (optional Phase 6)

**Site map**
```
/                     Landing page
/login /register      Auth
/dashboard            Role-based dashboard
/courses              Course catalog
/courses/[id]         Course detail + lecture list
/courses/[id]/lectures/[lectureId]   Lecture viewer (video/notes/materials)
/courses/[id]/assignments/[assignmentId]  Assignment view + submission
/instructor/courses/[id]/grading     Grading view
/admin                Admin panel (users, courses)
```

---

## 2. Master Prompt (give this to Copilot Chat/Agent first)

```
You are building an education platform called "EduHub" using Next.js 14 (App Router),
TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Authentication is handled with NextAuth.js.

Roles: student, instructor, admin.

Core entities:
- User (id, name, email, passwordHash, role, createdAt)
- Course (id, title, description, instructorId, coverImage, createdAt)
- Lecture (id, courseId, title, order, videoUrl, notesMarkdown, attachments[], publishedAt)
- Assignment (id, courseId, title, description, dueDate, maxPoints)
- Submission (id, assignmentId, studentId, fileUrl OR textContent, submittedAt, grade, feedback)
- Enrollment (id, courseId, studentId, enrolledAt)

Build the project in phases. Do not skip ahead — implement one phase fully,
confirm it compiles and runs, then move to the next. Use clean, typed,
commented code. Use Tailwind for all styling with a clean, modern, accessible
design (readable typography, good contrast, responsive layout).

Start with Phase 1 from the scaffold plan I'll give you.
```

---

## 3. Scaffold Script

Run this once to create the initial repo structure, then open the folder in VS Code with Copilot enabled.

```bash
#!/bin/bash
# scaffold.sh — creates the EduHub project skeleton

npx create-next-app@latest eduhub \
  --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"

cd eduhub

npm install prisma @prisma/client next-auth @next-auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

npx prisma init

mkdir -p src/app/(auth)/login src/app/(auth)/register
mkdir -p src/app/dashboard
mkdir -p src/app/courses/[id]/lectures/[lectureId]
mkdir -p src/app/courses/[id]/assignments/[assignmentId]
mkdir -p src/app/instructor/courses/[id]/grading
mkdir -p src/app/admin
mkdir -p src/components
mkdir -p src/lib
mkdir -p prisma

echo "Scaffold complete. Next: open in VS Code, enable Copilot, and paste Phase 1 prompt."
```

---

## 4. Sequential Phase Prompts

Paste these into Copilot Chat **one at a time**, in order. Wait for each phase to work before moving on.

### Phase 1 — Database schema
```
Create the Prisma schema in prisma/schema.prisma for these models: User, Course,
Lecture, Assignment, Submission, Enrollment, as described in the project brief.
Use PostgreSQL as the provider. Add appropriate relations, enums for role
(STUDENT, INSTRUCTOR, ADMIN), and indexes. Then generate the migration.
```

### Phase 2 — Authentication
```
Set up NextAuth.js with the Prisma adapter and credentials provider
(email + password, hashed with bcryptjs). Add a role field to the session/JWT.
Build /login and /register pages with Tailwind forms and basic validation.
Add middleware to protect /dashboard, /instructor, and /admin routes by role.
```

### Phase 3 — Course & lecture pages
```
Build the course catalog page (/courses) listing all published courses as cards.
Build the course detail page (/courses/[id]) showing description and an ordered
lecture list. Build the lecture viewer page (/courses/[id]/lectures/[lectureId])
that renders video (if videoUrl present), markdown notes, and downloadable
attachments. Fetch data via Prisma server components.
```

### Phase 4 — Assignments & submissions
```
Build the assignment view page showing title, description, due date, and a
submission form (text or file upload). Students can submit once and see their
submission status/grade. Store submissions via a server action that writes to
the Submission table.
```

### Phase 5 — Instructor grading view
```
Build /instructor/courses/[id]/grading listing all submissions for that course's
assignments, with inline grade + feedback entry. Restrict access to the
course's instructor and admins only.
```

### Phase 6 — Dashboards
```
Build a role-aware /dashboard: students see enrolled courses, upcoming deadlines,
and recent grades; instructors see their courses with student counts and
pending-grading counts. Use simple Tailwind cards and a clean grid layout.
```

### Phase 7 — Polish
```
Add loading states, empty states, and error boundaries across all pages.
Improve the landing page with a hero section, feature highlights, and a
call-to-action. Run an accessibility pass (alt text, focus states, contrast).
```

---

## Notes
- Feed phases one at a time — large single-shot prompts produce weaker, harder-to-debug output from Copilot.
- After each phase, run `npm run dev` and manually check the new pages before continuing.
- Swap the credentials-only auth for Google/Microsoft OAuth later if your institution requires SSO — that's a drop-in NextAuth provider change, not a rebuild.
