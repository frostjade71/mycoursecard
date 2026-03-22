import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  GraduationCap, ArrowRight, Github, Linkedin, Mail, Briefcase,
  Terminal, Award, Quote, Download, LayoutTemplate, BookOpen, ExternalLink
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
      <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-input font-bold transition-all">Go to MyCourseCard</Link>
    </div>
  );

  return (
    <div className="bg-background text-text-primary min-h-screen antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="max-w-[960px] mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <GraduationCap size={24} className="font-bold" />
            <h1 className="text-xl font-bold tracking-tight text-text-primary">MyCourseCard</h1>
          </Link>
          <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-input text-sm font-semibold transition-colors flex items-center gap-2">
            Create your own <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-6 py-12 space-y-16">
        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-surface flex items-center justify-center">
              <img 
                alt={`${profile.full_name} Profile portrait`} 
                className="w-full h-full object-cover" 
                src={profile.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.full_name || "User")}
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">{profile.full_name}</h2>
            <div className="flex flex-wrap justify-center gap-2 py-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {profile.course === 'cs' ? 'BS Computer Science' : profile.course === 'education' ? 'BS Education' : profile.course === 'business' ? 'BS Business Ad' : profile.course}
              </span>
            </div>
            <p className="text-text-secondary font-medium">{profile.school} | {profile.year_level}</p>
          </div>

          {profile.bio ? (
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
              {profile.bio}
            </p>
          ) : (
             <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                Passionate student building a foundation of knowledge and aiming for excellence. Open to new opportunities and collaborations.
             </p>
          )}

          <div className="flex gap-4">
            <a className="p-3 rounded-full bg-background shadow-sm border border-border hover:text-primary transition-colors" href="#">
              <Github size={24} />
            </a>
            <a className="p-3 rounded-full bg-background shadow-sm border border-border hover:text-primary transition-colors" href="#">
              <Linkedin size={24} />
            </a>
            <a className="p-3 rounded-full bg-background shadow-sm border border-border hover:text-primary transition-colors" href="#">
              <Mail size={24} />
            </a>
          </div>
        </section>

        {/* Dynamic Sections */}
        {sections.map((section) => (
          <section key={section.id} className="space-y-6">
            <div className="flex items-center gap-3">
              {getSectionIcon(section.section_type)}
              <h3 className="text-xl font-bold text-text-primary uppercase tracking-wide text-sm">{section.title}</h3>
            </div>
            
            {section.items && section.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items.map((item: any) => (
                  <div key={item.id} className="group bg-surface border border-border rounded-card p-6 hover:shadow-lg transition-all flex flex-col hover:border-primary/30">
                    <h4 className="font-bold text-lg text-text-primary flex items-center justify-between">
                      {item.title}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </h4>
                    {item.description && (
                       <p className="text-sm text-text-secondary mt-3 whitespace-pre-wrap leading-relaxed flex-1">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border border-dashed rounded-card p-8 text-center shadow-sm">
                <p className="text-text-secondary text-sm font-medium">Coming soon.</p>
              </div>
            )}
          </section>
        ))}

        <footer className="pt-12 pb-24 text-center border-t border-border">
          <p className="text-sm text-text-secondary">© {new Date().getFullYear()} MyCourseCard. Designed with precision.</p>
        </footer>
      </main>

      <div className="fixed bottom-8 right-8 z-[60]">
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-card shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 group">
          <Download size={20} />
          <span className="font-bold tracking-tight">Download Resume PDF</span>
        </button>
      </div>
    </div>
  );
};

export default PublicPortfolio;
