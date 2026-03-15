import React, { useState } from 'react';
import { Monitor, BookOpen, Briefcase } from 'lucide-react';

const courses = [
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

const OnboardingWizard: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('cs');

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4 antialiased">
      {/* Onboarding Wizard Container */}
      <div className="w-full max-w-[560px] bg-background rounded-card shadow-sm border border-border p-8 md:p-10">
        
        {/* Step Progress Indicator */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-text-primary text-3xl font-bold mb-2">What's your course?</h1>
          <p className="text-text-secondary text-base">We'll pre-load the right portfolio sections for you.</p>
        </div>

        {/* Course Selection List */}
        <div className="space-y-4 mb-10">
          {courses.map((course) => {
            const Icon = course.icon;
            const isSelected = selectedCourse === course.id;
            
            return (
              <label 
                key={course.id}
                className={`relative flex items-start gap-4 p-5 rounded-input border-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-background hover:border-text-secondary'
                }`}
              >
                <input 
                  type="radio" 
                  name="course" 
                  className="sr-only" 
                  checked={isSelected}
                  onChange={() => setSelectedCourse(course.id)}
                />
                <div className={`flex-shrink-0 mt-1 ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>
                  <Icon size={32} />
                </div>
                <div className="flex-grow">
                  <p className="text-text-primary font-semibold text-lg leading-tight mb-1">{course.title}</p>
                  <p className="text-text-secondary text-sm leading-snug">{course.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary' : 'border-border'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Footer Button */}
        <div className="flex flex-col gap-4">
          <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 px-6 rounded-input transition-colors text-base shadow-sm">
            Continue
          </button>
          <button className="w-full bg-transparent hover:bg-surface text-text-secondary font-medium py-2 text-sm transition-colors">
            I'll do this later
          </button>
        </div>

        {/* Step Indicator Text */}
        <p className="text-center mt-6 text-[10px] text-text-secondary font-medium tracking-wider uppercase">
          Step 2 of 4
        </p>
      </div>
    </div>
  );
};

export default OnboardingWizard;
