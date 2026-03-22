import React from 'react';
import { GraduationCap, LayoutDashboard, Share2, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-text-primary antialiased">
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-input bg-primary text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">MyCourseCard</span>
          </div>
          <button onClick={handleAuth} className="flex items-center justify-center gap-2 rounded-input border border-border bg-white px-5 py-2 text-sm font-semibold text-text-primary shadow-sm transition-all hover:bg-surface">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            {user ? "Go to Dashboard" : "Sign in with Google"}
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-text-primary sm:text-7xl">
              Your course. Your card. <br />
              <span className="text-primary">Your story.</span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-text-secondary sm:text-xl">
              Build your student portfolio in minutes — tailored for your course. Showcase your projects, skills, and academic achievements in a professional, modern layout.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button onClick={handleAuth} className="rounded-input bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02]">
                {user ? "Go to Dashboard" : "Get Started for Free"}
              </button>
            </div>
          </div>
          <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 blur-3xl opacity-10 pointer-events-none">
            <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary to-[#80b1ff]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-surface py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Everything you need to stand out</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col rounded-card bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-border">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-input bg-primary/10 text-primary">
                  <LayoutDashboard size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-text-primary">Course-Aware Sections</h3>
                <p className="text-text-secondary leading-relaxed">Smart sections that automatically adapt to your specific degree and industry standards.</p>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col rounded-card bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-border">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-input bg-primary/10 text-primary">
                  <Share2 size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-text-primary">Shareable Public Link</h3>
                <p className="text-text-secondary leading-relaxed">A professional, unique URL to share with recruiters and on your LinkedIn profile with ease.</p>
              </div>
              {/* Feature 3 */}
              <div className="flex flex-col rounded-card bg-white p-8 shadow-sm transition-shadow hover:shadow-md border border-border">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-input bg-primary/10 text-primary">
                  <FileText size={28} />
                </div>
                <h3 className="mb-3 text-xl font-bold text-text-primary">PDF Resume Export</h3>
                <p className="text-text-secondary leading-relaxed">Convert your digital portfolio into a beautifully formatted PDF resume with just one click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Courses Section */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col items-center gap-10">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary">Supporting students from all disciplines</h2>
                <p className="mt-2 text-text-secondary">Customized layouts for major degree programs</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "BS Computer Science",
                  "BS Information Technology",
                  "Education",
                  "BS Business Administration",
                  "Nursing",
                  "Psychology"
                ].map((course) => (
                  <span key={course} className="inline-flex items-center rounded-full bg-surface px-6 py-3 text-sm font-semibold text-text-primary ring-1 ring-inset ring-border/50">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
                  <GraduationCap size={14} />
                </div>
                <span className="text-lg font-bold text-text-primary">MyCourseCard</span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">The smartest way to build your student career.</p>
            </div>
            <div className="text-sm text-text-secondary">
              © {new Date().getFullYear()} MyCourseCard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
