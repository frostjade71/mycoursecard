import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Moon, Sun, ArrowRight, LayoutDashboard, User, Eye, FileDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { exportToPdf } from '../lib/pdfExport';

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Hide navbar on onboarding or special routes if needed
  const isAuthRoute = location.pathname === '/onboarding' || location.pathname === '/select-course';
  const isDashboard = location.pathname === '/dashboard';
  const isPublicView = location.pathname.startsWith('/u/');

  if (isAuthRoute) return null;

  const handlePdfExport = () => {
    const usernameFromPath = location.pathname.startsWith('/u/') ? location.pathname.split('/')[2] : null;
    const filename = `${usernameFromPath || profile?.username || 'portfolio'}-resume`;
    
    if (isDashboard) {
      exportToPdf('portfolio-content', filename);
    } else if (isPublicView) {
      exportToPdf('public-portfolio-content', filename);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-[1400px] flex h-24 items-center justify-between px-6 md:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-text-primary text-background shadow-2xl group-hover:rotate-12 transition-all duration-500">
            <GraduationCap size={28} className="font-bold" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-text-primary uppercase leading-tight italic">MyCourseCard</span>
            <span className="text-[10px] font-black tracking-[0.4em] text-secondary uppercase opacity-60">Student</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-colors">Home</Link>
          {user && (
            <Link to="/dashboard" className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2">
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Dashboard/Public Context Actions */}
          {(isDashboard || isPublicView) && (
            <div className="hidden lg:flex items-center gap-2 mr-4 border-r border-white/10 pr-6">
              {isDashboard && profile && (
                <Link 
                  to={`/u/${profile.username}`} 
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-secondary transition-colors"
                >
                  <Eye size={16} /> Preview
                </Link>
              )}
              <button 
                onClick={handlePdfExport}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-secondary transition-colors"
              >
                <FileDown size={16} /> Export PDF
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-surface shadow-xl hover:scale-110 active:scale-95 transition-all group"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={20} className="text-warning group-hover:rotate-90 transition-transform duration-500" />
            ) : (
              <Moon size={20} className="text-secondary group-hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>

          {/* User / CTA */}
          {user ? (
            <Link 
              to="/dashboard" 
              className="hidden sm:flex items-center gap-3 p-1.5 pr-6 rounded-full bg-surface text-text-primary border border-white/10 hover:bg-secondary hover:text-white transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-surface">
                <User size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Profile</span>
            </Link>
          ) : (
            <button 
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="bg-text-primary text-background hover:bg-secondary hover:text-white px-8 py-3.5 rounded-full text-xs font-black transition-all hover:scale-105 uppercase tracking-widest flex items-center gap-2 border-4 border-background shadow-2xl"
            >
              Start Free <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
