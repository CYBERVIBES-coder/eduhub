export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-primary-700">EduHub</h1>
          <p className="text-gray-600">Education Studies Platform</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold mb-4">Welcome to EduHub</h2>
        <p className="text-lg text-gray-600 mb-8">
          A modern platform for learning and teaching. Coming soon: courses, lectures, assignments, and grading.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Register
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-bold mb-8">Phase 1 Status: Database Schema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✓ Prisma Schema</h4>
            <p className="text-green-700 text-sm">Defined: User, Course, Lecture, Assignment, Submission, Enrollment</p>
          </div>
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">→ Next Steps</h4>
            <p className="text-blue-700 text-sm">Run: npm install && npx prisma migrate dev --name init</p>
          </div>
        </div>
      </section>
    </main>
  )
}
