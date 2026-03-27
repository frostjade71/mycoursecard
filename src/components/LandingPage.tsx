import {
  LayoutDashboard, Share2, FileText,
  GraduationCap
} from 'lucide-react';
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
    <div className="relative flex min-h-screen flex-col bg-background text-text-primary antialiased selection:bg-secondary selection:text-white">
      <main className="flex-1">
        {/* Hero Section (High Contrast) */}
        <section className="relative overflow-hidden px-6 py-24 lg:py-40">
          <div className="mx-auto max-w-5xl text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/20 blur-[120px] -z-10 animate-pulse"></div>
            <h1 className="text-3xl font-black tracking-tighter text-text-primary sm:text-5xl uppercase leading-[1.0]">
              Your course. <br />
              Your card. <br />
              <span className="text-secondary drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] italic">Your story.</span>
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-text-secondary sm:text-base font-medium max-w-xl mx-auto">
              Build your student portfolio in minutes — tailored for your course. <span className="text-text-primary">Professional, high-contrast, and modern.</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-8">
              <button 
                onClick={handleAuth} 
                className="rounded-full bg-text-primary px-6 py-2.5 text-xs font-black text-background shadow-xl transition-all hover:bg-secondary hover:text-white hover:scale-105 active:scale-95 uppercase tracking-[0.3em] border-2 border-background"
              >
                {user ? "Go to Dashboard" : "Start Crafting"}
              </button>
            </div>
          </div>
        </section>

        {/* Features Section (Glass Bento) */}
        <section className="bg-surface/30 backdrop-blur-sm py-32 border-y border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-text-primary sm:text-3xl">Elevate your presence</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:grid-rows-2 h-auto md:h-[700px]">
              {/* Feature 1 - Premium Bento */}
              <div className="md:col-span-8 md:row-span-1 flex flex-col justify-end rounded-[40px] bg-white/[0.03] p-12 shadow-2xl border border-white/5 group hover:border-secondary transition-all duration-500 overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 blur-3xl group-hover:scale-150 transition-transform"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[16px] bg-secondary text-white shadow-xl group-hover:rotate-6 transition-transform">
                  <LayoutDashboard size={24} />
                </div>
                <h3 className="mb-2 text-xl font-black text-text-primary uppercase tracking-tighter">Course-Aware</h3>
                <p className="text-text-secondary text-sm font-medium max-w-xs">Smart sections that automatically adapt to your specific degree. Precision engineering for your career.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="md:col-span-4 md:row-span-2 flex flex-col justify-center rounded-[40px] bg-secondary p-8 border border-white/10 group hover:shadow-[0_0_100px_rgba(59,130,246,0.2)] transition-all duration-500 text-white">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/20 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Share2 size={20} />
                  </div>
                  <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter">Unique <br />Identity</h3>
                  <p className="text-white/80 text-xs font-medium leading-relaxed">Your professional brand, instantly generated. High-performance design built into every pixel.</p>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-8 md:row-span-1 flex flex-col justify-center rounded-[40px] bg-surface p-10 border border-white/5 group hover:border-success transition-all duration-500">
                <div className="flex items-center gap-8">
                    <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-[18px] bg-success text-white shadow-lg group-hover:-translate-y-2 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-black text-text-primary uppercase tracking-tighter">One-Click PDF</h3>
                      <p className="text-text-secondary text-sm font-medium">Instantly transform your dynamic portfolio into a professional resume. Job-ready in a heartbeat.</p>
                    </div>
                </div>
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

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-background py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-text-primary text-background shadow-lg">
                  <GraduationCap size={18} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-text-primary uppercase italic">MyCourseCard</span>
              </div>
              <p className="text-slate-500 font-medium max-w-sm">The high-performance platform for student architects, engineers, and creators.</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/40">
                <span className="hover:text-text-primary transition-colors cursor-pointer">Privacy</span>
                <span className="hover:text-text-primary transition-colors cursor-pointer">Terms</span>
                <span className="hover:text-text-primary transition-colors cursor-pointer">Contact</span>
              <span>© {new Date().getFullYear()} MyCourseCard • State of the Art</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
