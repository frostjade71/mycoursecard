import React, { useState } from 'react';
import { Monitor, BookOpen, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';

const courses = [
  {
    id: 'cs',
    title: 'BS Computer Science / BS IT',
    description: 'Projects, GitHub links, tech stack, certifications',
    icon: Monitor,
    tags: ['Projects', 'Tech Stack', 'Certifications']
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Teaching practice, lesson plans, certifications',
    icon: BookOpen,
    tags: ['Teaching Phil.', 'Lesson Plans', 'Practicum']
  },
  {
    id: 'business',
    title: 'BS Business Administration',
    description: 'Case studies, internships, business projects',
    icon: Briefcase,
    tags: ['Internships', 'Case Studies', 'Expertise']
  },
];

const CourseSelection: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('cs');

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 antialiased">
      <div className="w-full max-w-2xl bg-background rounded-card shadow-sm border border-border overflow-hidden">
        <div className="p-8 md:p-12">
          <header className="text-center mb-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-input bg-primary/10 text-primary mb-4">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-3">Choose your specialization</h1>
            <p className="text-text-secondary text-lg">Select your course to pre-configure your portfolio sections.</p>
          </header>

          <div className="grid grid-cols-1 gap-4 mb-10">
            {courses.map((course) => {
              const Icon = course.icon;
              const isSelected = selectedCourse === course.id;
              
              return (
                <label 
                  key={course.id}
                  className={`relative flex items-center justify-between p-6 rounded-card border-2 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border bg-background hover:border-text-secondary shadow-sm hover:shadow-md'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="course" 
                    className="sr-only" 
                    checked={isSelected}
                    onChange={() => setSelectedCourse(course.id)}
                  />
                  <div className="flex items-center gap-5">
                    <div className={`flex-shrink-0 p-3 rounded-input ${isSelected ? 'bg-primary text-text-on-primary' : 'bg-surface text-text-secondary'}`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-text-primary font-bold text-lg">{course.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {course.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface text-text-secondary border border-border/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {isSelected && <ArrowRight size={14} className="text-text-on-primary" />}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex flex-col gap-4">
            <button className="w-full bg-primary hover:bg-primary/90 text-text-on-primary font-bold py-4 px-6 rounded-input transition-all transform hover:scale-[1.01] active:scale-[0.99] text-lg shadow-lg shadow-primary/20">
              Continue to Dashboard
            </button>
            <p className="text-center text-sm text-text-secondary">
              Don't worry, you can change this later in settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;
