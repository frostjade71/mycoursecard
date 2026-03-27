import React, { useState, useEffect } from 'react';
import { Monitor, BookOpen, Briefcase, Building2, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const coursesList = [
  {
    id: 'cs',
    title: 'BS Computer Science / BS IT',
    description: 'Projects, GitHub links, tech stack, certifications',
    icon: Monitor,
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Teaching practice, lesson plans, certifications',
    icon: BookOpen,
  },
  {
    id: 'business',
    title: 'BS Business Administration',
    description: 'Case studies, internships, business projects',
    icon: Briefcase,
  },
];

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduated'];

const OnboardingWizard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    school: '',
    course: 'cs',
    year_level: '1st Year',
    username: ''
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFormData(prev => ({ ...prev, full_name: user.user_metadata.full_name }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'school') {
      if (value.length > 2) {
        debouncedSearch(value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  // Simple debounce implementation
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const debouncedSearch = (query: string) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => fetchSchools(query), 300);
    setSearchTimeout(timeout);
  };

  const fetchSchools = async (query: string) => {
    setIsSearching(true);
    try {
      // 1. Fetch from Hipo API (Global)
      const hipoPromise = fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`)
        .then(r => r.json());
      
      // 2. Fetch from Supabase (Local Community)
      const supabasePromise = supabase
        .from('universities')
        .select('name, country')
        .ilike('name', `%${query}%`)
        .limit(5);

      const [hipoData, { data: localData }] = await Promise.all([hipoPromise, supabasePromise]);

      // Merge and deduplicate
      const merged = [
        ...(localData || []).map((d: any) => ({ name: d.name, country: d.country, source: 'community' })),
        ...(hipoData || []).map((d: any) => ({ name: d.name, country: d.country, source: 'global' }))
      ];
      
      const unique = Array.from(new Map(merged.map(item => [item.name.toLowerCase(), item])).values());
      
      setSuggestions(unique.slice(0, 5));
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSchool = (schoolName: string) => {
    setFormData({ ...formData, school: schoolName });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    
    // Check username uniqueness if they entered one
    if (formData.username.trim() !== '') {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', formData.username)
        .maybeSingle();

      if (existingUser && existingUser.id !== user.id) {
        setError('Username is already taken.');
        setLoading(false);
        return;
      }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        school: formData.school,
        course: formData.course,
        year_level: formData.year_level,
        username: formData.username
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Community School Logic: Try to add it if it's missing from the database
    try {
      if (formData.school.trim() !== '') {
        await supabase
          .from('universities')
          .insert([{ 
            name: formData.school, 
            country: 'Philippines', // Default for now as per user examples
            created_by: user.id 
          }])
          .select(); //maybeSingle doesn't work well with insert if unique violation, but Supabase handles it or we can just ignore error
      }
    } catch (e) {
      // Quietly fail if already exists
    }

    navigate('/dashboard');
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${step >= i ? 'bg-primary' : 'bg-border'}`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 antialiased">
      <div className="w-full max-w-[560px] bg-background rounded-card shadow-sm border border-border p-8 md:p-10 relative">
        {step > 1 && (
          <button onClick={handleBack} className="absolute top-8 left-8 text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}

        {renderStepIndicator()}

        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-input text-sm border border-red-200">{error}</div>}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h1 className="text-text-primary text-3xl font-bold mb-2">Welcome to MyCourseCard!</h1>
              <p className="text-text-secondary text-base">Let's start with your basic academic details.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-border rounded-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Juan Dela Cruz" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">University / School</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-text-secondary" />
                  </div>
                  <input 
                    type="text" 
                    name="school" 
                    value={formData.school} 
                    onChange={handleChange} 
                    onFocus={() => {
                      if (formData.school.length > 2) {
                        setShowSuggestions(true);
                        fetchSchools(formData.school);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-input focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="University of the Philippines" 
                    autoComplete="off"
                  />
                  
                  {showSuggestions && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {suggestions.length > 0 ? (
                        <>
                          <div className="px-4 py-2 bg-surface/30 text-[9px] font-bold text-text-secondary uppercase tracking-[0.2em] border-b border-border/50">
                            Suggested Institutions
                          </div>
                          {suggestions.map((s: any, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectSchool(s.name)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-primary/5 hover:text-primary transition-colors border-b last:border-0 border-border/50 flex flex-col group"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{s.name}</span>
                                {s.source === 'community' && (
                                  <span className="text-[8px] bg-secondary/10 text-secondary px-1.5 py-0.5 rounded font-black uppercase">Community</span>
                                )}
                              </div>
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider">{s.country}</span>
                            </button>
                          ))}
                          <div className="px-4 py-2 bg-surface/50 text-[10px] text-text-secondary uppercase tracking-widest font-bold">
                            Don't see your school? Keep typing to enter it manually.
                          </div>
                        </>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => setShowSuggestions(false)}
                          className="w-full px-4 py-8 text-center bg-surface/20 hover:bg-primary/5 transition-colors group"
                        >
                          <p className="text-sm text-text-secondary mb-2 font-medium">No results matching <br /> <span className="text-text-primary font-bold italic">"{formData.school}"</span></p>
                          <div className="h-px w-12 bg-border mx-auto mb-3 group-hover:w-20 transition-all"></div>
                          <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] animate-pulse group-hover:scale-105 transition-transform">Be the First to create in your instituition</p>
                        </button>
                      )}
                    </div>
                  )}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h1 className="text-text-primary text-3xl font-bold mb-2">What's your course?</h1>
              <p className="text-text-secondary text-base">We'll pre-load the right portfolio sections for you.</p>
            </div>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {coursesList.map((c) => {
                const Icon = c.icon;
                const isSelected = formData.course === c.id;
                return (
                  <label key={c.id} className={`relative flex items-start gap-4 p-5 rounded-input border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-text-secondary'}`}>
                    <input type="radio" name="course" className="sr-only" checked={isSelected} onChange={() => setFormData({ ...formData, course: c.id })} />
                    <div className={`flex-shrink-0 mt-1 ${isSelected ? 'text-primary' : 'text-text-secondary'}`}><Icon size={32} /></div>
                    <div className="flex-grow">
                      <p className="text-text-primary font-semibold text-lg leading-tight mb-1">{c.title}</p>
                      <p className="text-text-secondary text-sm leading-snug">{c.description}</p>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-border'}`}>{isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h1 className="text-text-primary text-3xl font-bold mb-2">What's your year level?</h1>
              <p className="text-text-secondary text-base">Helps tailor your experience.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {yearLevels.map((lvl) => (
                <label key={lvl} className={`relative flex items-center justify-center p-4 rounded-input border-2 cursor-pointer transition-all ${formData.year_level === lvl ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border bg-background hover:border-text-secondary text-text-primary'}`}>
                  <input type="radio" name="year_level" className="sr-only" checked={formData.year_level === lvl} onChange={() => setFormData({ ...formData, year_level: lvl })} />
                  {lvl}
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h1 className="text-text-primary text-3xl font-bold mb-2">Claim your URL</h1>
              <p className="text-text-secondary text-base">This will be your shareable public link.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1">Username</label>
              <div className="flex items-center rounded-input border border-border overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="px-4 py-3 bg-surface text-text-secondary border-r border-border select-none">mycoursecard.app/u/</span>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="flex-1 w-full px-4 py-3 outline-none" placeholder="juandelacruz" />
              </div>
              <p className="mt-2 text-xs text-text-secondary">Lower case, numbers, and dashes only.</p>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-4">
          {step < 4 ? (
            <button onClick={handleNext} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-text-on-primary font-semibold py-3.5 px-6 rounded-input transition-colors text-base shadow-sm">
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-text-on-primary font-semibold py-3.5 px-6 rounded-input transition-colors text-base shadow-sm disabled:opacity-50">
              {loading ? 'Saving...' : 'Go to Dashboard'}
            </button>
          )}
        </div>

        <p className="text-center mt-6 text-[10px] text-text-secondary font-medium tracking-wider uppercase">
          Step {step} of 4
        </p>
      </div>
    </div>
  );
};

export default OnboardingWizard;
