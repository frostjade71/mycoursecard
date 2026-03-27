import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Github, Mail, Briefcase, GraduationCap,
  Terminal, Award, Quote, LayoutTemplate, BookOpen, ExternalLink
} from 'lucide-react';

const PublicPortfolio = () => {
  const { username } = useParams<{ username: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!username) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('is_public', true)
        .single();

      if (profileData) {
        setProfile(profileData);
        const { data: sectionData } = await supabase
          .from('sections')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('is_visible', true)
          .order('position', { ascending: true });
        
        if (sectionData && sectionData.length > 0) {
          const { data: itemData } = await supabase
            .from('section_items')
            .select('*')
            .in('section_id', sectionData.map(s => s.id))
            .order('position', { ascending: true });

          const mapped = sectionData.map(sec => ({
            ...sec,
            items: itemData?.filter(item => item.section_id === sec.id) || []
          }));
          setSections(mapped);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [username]);

  const getSectionIcon = (type: string) => {
    switch(type) {
      case 'projects': return <Terminal className="text-primary" />;
      case 'education': return <BookOpen className="text-primary" />;
      case 'experience': return <Briefcase className="text-primary" />;
      case 'philosophy': return <Quote className="text-primary" />;
      case 'skills': return <Award className="text-primary" />;
      default: return <LayoutTemplate className="text-primary" />;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface">Loading Portfolio...</div>;
  
  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center px-4">
      <GraduationCap size={48} className="text-border mb-4" />
      <h1 className="text-2xl font-bold text-text-primary mb-2">Portfolio Not Found</h1>
      <p className="text-text-secondary mb-6">The link you followed may be broken or the portfolio is set to private.</p>
      <Link to="/" className="bg-primary hover:bg-primary/90 text-text-on-primary px-6 py-2 rounded-input font-bold transition-all">Go to MyCourseCard</Link>
    </div>
  );

  return (
    <div className="bg-background text-text-primary min-h-screen antialiased selection:bg-secondary selection:text-white">
      <main id="public-portfolio-content" className="max-w-[1200px] mx-auto px-4 py-8 md:py-20">
        <div className="bg-surface/30 backdrop-blur-md border border-border rounded-[40px] shadow-2xl overflow-hidden p-6 md:p-12 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Bento Block: Profile Hero (Deep Glass) */}
            <section className="md:col-span-8 bg-white/[0.03] backdrop-blur-sm rounded-[32px] p-10 flex flex-col md:flex-row items-center md:items-start gap-10 border border-white/5 group hover:border-white/20 transition-all duration-500">
              <div className="relative shrink-0">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] border-[6px] border-white/10 shadow-2xl overflow-hidden bg-surface/50 flex items-center justify-center -rotate-2 group-hover:rotate-0 transition-all duration-700 ease-out">
                  <img 
                    alt={`${profile.full_name} Profile portrait`} 
                    className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                    src={profile.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.full_name || "User")}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary w-10 h-10 rounded-2xl border-4 border-background shadow-xl flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-6">
                <div className="space-y-2">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-text-primary uppercase leading-none">{profile.full_name}</h2>
                  <p className="text-secondary font-black text-xl tracking-tight">{profile.school}</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="bg-text-primary text-background px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-text-primary/5">
                    {profile.course === 'cs' ? 'BS Computer Science' : profile.course === 'education' ? 'BS Education' : profile.course === 'business' ? 'BS Business Ad' : profile.course}
                  </span>
                  <span className="bg-surface border border-border text-text-secondary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    {profile.year_level}
                  </span>
                </div>

                <p className="text-text-secondary leading-relaxed text-sm md:text-lg font-medium max-w-xl">
                  {profile.bio || "Passionate student building a foundation of knowledge and aiming for excellence. Open to new opportunities and collaborations."}
                </p>
              </div>
            </section>

            {/* Bento Block: Contact (Vibrant Accent) */}
            <section className="md:col-span-4 bg-secondary rounded-[32px] p-10 flex flex-col justify-between border border-white/10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl -mr-16 -mt-16"></div>
              <div className="space-y-8 relative">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">Get in touch</h3>
                <div className="flex flex-col gap-4">
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/5 hover:bg-white text-white hover:text-secondary transition-all group/link shadow-sm">
                    <div className="p-2 rounded-xl bg-white/10 group-hover/link:bg-secondary group-hover/link:text-white transition-all">
                      <Mail size={20} />
                    </div>
                    <span className="text-sm font-black truncate">{profile.email}</span>
                  </a>
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-white text-background border border-white/5 hover:bg-background hover:text-white transition-all group/link shadow-xl">
                      <div className="p-2 rounded-xl bg-background/5 group-hover/link:bg-white/10 transition-all">
                        <Github size={20} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest">Code Vault</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Status</span>
                <span className="text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Open to Work
                </span>
              </div>
            </section>

            {/* Bento Grid: Sections (Glass Tiles) */}
            {sections.map((section, idx) => (
              <section 
                key={section.id} 
                className={`${
                  section.section_type === 'skills' || section.section_type === 'education' 
                    ? 'md:col-span-4' 
                    : 'md:col-span-6'
                } bg-white/[0.02] backdrop-blur-sm rounded-[32px] p-10 border border-white/5 group hover:border-secondary/40 hover:bg-white/[0.04] transition-all duration-500`}
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-surface border border-border text-secondary group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                      {getSectionIcon(section.section_type)}
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-text-secondary group-hover:text-text-primary transition-colors">{section.title}</h3>
                  </div>
                  <span className="text-[10px] font-black text-text-secondary/20">#0{idx + 1}</span>
                </div>
                
                {section.items && section.items.length > 0 ? (
                  <div className="space-y-6">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="relative group/item">
                        <div className="flex flex-col gap-2">
                          <h4 className="font-black text-base text-text-primary flex items-center justify-between tracking-tight">
                            {item.title}
                            {item.url && (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-white transition-colors">
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </h4>
                          {item.description && (
                             <p className="text-xs text-text-secondary leading-relaxed font-medium line-clamp-3 group-hover/item:text-text-primary transition-colors">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary/40 font-medium italic">Content arriving soon.</p>
                )}
              </section>
            ))}

            <footer className="md:col-span-12 pt-10 mt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/40">
                © {new Date().getFullYear()} MyCourseCard • High-Performance Portfolio
              </p>
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary/20">
                <span className="hover:text-secondary cursor-default transition-colors">Premium</span>
                <span className="hover:text-secondary cursor-default transition-colors">Security</span>
                <span className="hover:text-secondary cursor-default transition-colors">Vision</span>
              </div>
            </footer>
          </div>
        </div>
      </main>

    </div>
  );
};

export default PublicPortfolio;
