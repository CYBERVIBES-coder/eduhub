import Link from 'next/link'

export const metadata = {
  title: 'EduHub - Education Studies Platform',
  description: 'Learn and teach with EduHub, the modern education platform.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">EduHub</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-primary-600 font-medium hover:text-primary-700"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Learn & Teach with EduHub
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern, intuitive education platform for creating courses, managing assignments, and tracking student progress.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/courses"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why EduHub?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Rich Courses',
                description: 'Create courses with video lectures, notes, and attachments',
              },
              {
                icon: '✍️',
                title: 'Assignments',
                description: 'Set assignments with deadlines and collect submissions',
              },
              {
                icon: '📊',
                title: 'Gradebook',
                description: 'Track grades and provide feedback to students',
              },
              {
                icon: '👥',
                title: 'Enrollments',
                description: 'Manage student registrations and course access',
              },
              {
                icon: '🔒',
                title: 'Secure Auth',
                description: 'Email/password authentication with role-based access',
              },
              {
                icon: '📱',
                title: 'Responsive Design',
                description: 'Beautiful interface that works on all devices',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up as a student or instructor' },
              { step: '2', title: 'Join Courses', desc: 'Browse and enroll in courses' },
              { step: '3', title: 'Learn & Submit', desc: 'Watch lectures and submit assignments' },
              { step: '4', title: 'Get Feedback', desc: 'Receive grades and instructor feedback' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to get started?
          </h3>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of students and instructors using EduHub
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-white font-semibold mb-4">EduHub</h5>
              <p className="text-sm">Modern education platform for learning and teaching</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Product</h5>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/courses" className="hover:text-white transition">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 EduHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
