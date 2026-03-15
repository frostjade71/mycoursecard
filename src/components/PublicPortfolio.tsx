import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail, 
  Briefcase,
  Terminal, 
  Smartphone, 
  Bot, 
  ExternalLink, 
  Award, 
  ChevronRight, 
  Quote, 
  CheckCircle,
  Download
} from 'lucide-react';

type CourseType = 'CS' | 'Education' | 'Business';

interface PublicPortfolioProps {
  courseType?: CourseType;
  name?: string;
  university?: string;
  year?: string;
}

const PublicPortfolio: React.FC<PublicPortfolioProps> = ({ 
  courseType = 'CS',
  name = 'Juan Dela Cruz',
  university = 'Polytechnic University of the Philippines',
  year = '4th Year'
}) => {
  return (
    <div className="bg-background text-text-primary min-h-screen antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="max-w-[960px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-primary">
            <GraduationCap size={24} className="font-bold" />
            <h1 className="text-xl font-bold tracking-tight text-text-primary">MyCourseCard</h1>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-input text-sm font-semibold transition-colors flex items-center gap-2">
            Create your own <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-6 py-12 space-y-16">
        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-surface">
              <img 
                alt={`${name} Profile`} 
                className="w-full h-full object-cover" 
                src={courseType === 'Education' 
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuA6u25QsrkPAtde7ruE0BpJVyy0_1t6Q4l9bXYfUt5gRlSLlJ-f5wUd9S4qF_vutgVJbw6_OYuuwdXeEUBRilQlk2Nn7mKW12P9ZmpycSe3-XXeXLfiE1Ld4CdFToLeRFnIddwRUMWsW7TqYigkiP_Jazf8M_Uf53bZjq9owjjuFm31vgVgPcchxwUGYlxLSv-EaO44k-aL7L9BV4aK9UxNu9t48vlfHgJZk92Su1XFLYalfNwDaZsKnTlwdG5g-V8fc4ONhWYsOfI"
                  : courseType === 'Business'
                  ? "https://lh3.googleusercontent.com/aida-public/AB6AXuA7ywwsqkVsSlCmI-3OXQ59F1UYHlDvh58EwqQ7JXI8gBq8rRKxBSAi3RGLYKH05f2oJwKl2Pz4lrhAS30lP2ir5V7DDqmzMy3LvqsUJDF3881xs0X8RuY-MwiXlFM6ERrshgqWEfhw_vHAUBkonZ74_uOW3jJUXmH3U-p-xzfG44OqAGekb_xkLi4p1dw3TFoAeV9zwYfJznDWu_ryKyjPqF4KMtreemVwyNhPf4oIlpFCvEzpeRaE_zTP_bn-L-c-VOopqca4fvQ"
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuB7jceuLMUrQ99P5BB70y-0sqd1U53S8Atc_srkovOuIVhGrEozaH3nEuFDuf65Mgsi4aLzP2xTm8V9VA8Sra0VzYsVOYtHfhAXlqKGu4BWpQpwCPYVOtcy53BwdGCVkIm9lGpRHXqKfUTzNalB58mXa-sL1PNFRtb8k7ht-qTsXCSS7Tkv1OItrYqreyQS_lyhthybdUPcsPhzYcDl6EUm3CAdcWMLuTWxbACENmKtow6N9PxFRQ3L7-umWdCqBWEIatP7LIP9UdM"}
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">{name}</h2>
            <div className="flex flex-wrap justify-center gap-2 py-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {courseType === 'CS' ? 'BS Computer Science' : courseType === 'Education' ? 'BS Education' : 'BS Business Administration'}
              </span>
            </div>
            <p className="text-text-secondary font-medium">{university} | {year}</p>
          </div>

          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            {courseType === 'CS' && "Passionate student developer focusing on building accessible and scalable web applications. Open to collaborations and internships with a strong foundation in full-stack engineering."}
            {courseType === 'Education' && "Dedicated aspiring educator committed to fostering inclusive learning environments. Passionate about integrating technology into the classroom to enhance student engagement."}
            {courseType === 'Business' && "Aspiring marketing professional with a focus on data-driven brand strategies and market research. Experienced in digital campaign management."}
          </p>

          <div className="flex gap-4">
            <a className="p-3 rounded-full bg-background shadow-sm border border-border hover:text-primary transition-colors" href="#">
              {courseType === 'CS' ? <Github size={24} /> : <Mail size={24} />}
            </a>
            <a className="p-3 rounded-full bg-background shadow-sm border border-border hover:text-primary transition-colors" href="#">
              <Linkedin size={24} />
            </a>
            <a className="p-3 rounded-full bg-background shadow-sm border border-border hover:text-primary transition-colors" href="#">
              <Mail size={24} />
            </a>
          </div>
        </section>

        {/* Dynamic Sections Based on Course Type */}
        {courseType === 'CS' && (
          <>
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Terminal className="text-primary" />
                <h3 className="text-xl font-bold text-text-primary uppercase tracking-wide text-sm">Projects</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group bg-background border border-border rounded-card overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-40 bg-primary/5 flex items-center justify-center relative">
                    <Smartphone size={48} className="text-primary/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-lg text-text-primary">Student Portal Mobile App</h4>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface text-text-secondary">REACT NATIVE</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface text-text-secondary">FIREBASE</span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">A unified mobile solution for students to track grades and schedules.</p>
                    <a className="inline-flex items-center text-primary text-sm font-semibold hover:underline" href="#">
                      View Project <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
                <div className="group bg-background border border-border rounded-card overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-40 bg-primary/5 flex items-center justify-center relative">
                    <Bot size={48} className="text-primary/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-lg text-text-primary">AI Chatbot for Registration</h4>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface text-text-secondary">PYTHON</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface text-text-secondary">OPENAI</span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">Automated registration assistant that handles student inquiries.</p>
                    <a className="inline-flex items-center text-primary text-sm font-semibold hover:underline" href="#">
                      View Project <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {courseType === 'Education' && (
          <>
            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Quote className="text-primary" />
                Teaching Philosophy
              </h3>
              <div className="bg-primary/5 border-l-4 border-primary p-8 rounded-card relative overflow-hidden">
                <blockquote className="text-xl md:text-2xl text-text-primary italic leading-relaxed font-medium">
                  "I believe that every child has a unique potential that can be unlocked through inclusive and creative teaching strategies."
                </blockquote>
                <p className="mt-4 text-text-secondary font-semibold">— {name}</p>
              </div>
            </section>
          </>
        )}

        {courseType === 'Business' && (
          <>
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Briefcase className="text-primary" />
                <h3 className="text-2xl font-bold text-text-primary">Internship Experience</h3>
              </div>
              <div className="space-y-8">
                <div className="bg-surface p-6 rounded-card border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-text-primary">Marketing Intern</h4>
                      <p className="text-primary font-semibold">Unilever Philippines</p>
                    </div>
                    <span className="text-sm font-medium text-text-secondary bg-background px-3 py-1 rounded-full border border-border">June 2023 - Oct 2023</span>
                  </div>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex gap-3"><CheckCircle size={16} className="text-primary mt-1" /> Assisted in the 'Clean Future' campaign.</li>
                    <li className="flex gap-3"><CheckCircle size={16} className="text-primary mt-1" /> Conducted market competitor analysis.</li>
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Global Sections */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Award className="text-primary" />
            <h3 className="text-xl font-bold text-text-primary uppercase tracking-wide text-sm">Certifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-background border border-border rounded-card hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                  G
                </div>
                <div>
                  <p className="font-bold text-text-primary">Google IT Automation with Python</p>
                  <p className="text-xs text-text-secondary">Issued Oct 2023 • Google</p>
                </div>
              </div>
              <ChevronRight className="text-border" />
            </div>
          </div>
        </section>

        <footer className="pt-12 pb-24 text-center border-t border-border">
          <p className="text-sm text-text-secondary">© 2024 MyCourseCard. Designed with precision.</p>
        </footer>
      </main>

      {/* Floating Action Button */}
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
