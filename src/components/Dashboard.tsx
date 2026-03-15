import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  BrainCircuit, 
  UploadCloud, 
  Settings, 
  GraduationCap, 
  Eye, 
  FileDown, 
  GripVertical, 
  Edit3, 
  EyeOff, 
  PlusCircle, 
  Lightbulb,
  Check
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  visible: boolean;
}

const initialSections: Section[] = [
  { id: '1', title: 'Projects', subtitle: '4 items listed', visible: true },
  { id: '2', title: 'Tech Stack', subtitle: 'Languages, Tools & Frameworks', visible: true },
  { id: '3', title: 'Certifications', subtitle: 'Educational achievements', visible: false },
];

const SortableItem = ({ section }: { section: Section }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group flex items-center bg-background border border-dashed border-border rounded-card p-5 shadow-sm hover:shadow-md transition-shadow cursor-default"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="mr-4 text-text-secondary cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={20} />
      </div>
      <div className="flex-1">
        <h4 className="text-text-primary font-medium">{section.title}</h4>
        <p className="text-xs text-text-secondary">{section.subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
          <Edit3 size={20} />
        </button>
        <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
          {section.visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-text-primary font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-[240px] bg-background border-r border-border flex flex-col shrink-0">
        <div className="p-6 flex flex-col items-center border-b border-border">
          <div className="relative mb-3">
            <img 
              alt="Juan Dela Cruz Profile Portrait" 
              className="w-20 h-20 rounded-full border-2 border-primary/10 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEimgbLLTvy73eQ_Jw3Uc2OnPEjTr5y-KMrRA2TRaFLvM6EWtnpOgKguux5snPW3jBqcttOcoc7eEOrL04d9EBTqxYwobt8XAivKcBtJroMf2137RSHKEKfHqLhZhKfvpRZ5HR0ksoekff0LVTOYdVUyvqKjuKWh3nJb5dXJJzcXSAh9uZtz4S34sInBkDgbhJ8SvH23o3vQtmDNXCNmUTUQ3kWLt0umnvZx2QBqa5p-pzO8xzGodf7nch8k-STTokVG-LcDjwK0c"
            />
            <div className="absolute bottom-0 right-0 bg-primary w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <Check className="text-white" size={12} />
            </div>
          </div>
          <h1 className="text-text-primary font-semibold text-base">Juan Dela Cruz</h1>
          <span className="mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-medium rounded-full uppercase tracking-wider">BS Computer Science</span>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Overview</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 bg-primary/5 text-primary rounded-input transition-colors" href="#">
            <Layers size={20} />
            <span className="text-sm font-semibold">Sections</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
            <BrainCircuit size={20} />
            <span className="text-sm font-medium">Skills</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
            <UploadCloud size={20} />
            <span className="text-sm font-medium">Upload Files</span>
          </a>
          <div className="pt-4 mt-auto">
            <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary text-2xl" />
            <h2 className="text-xl font-bold text-text-primary">My Portfolio</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 h-9 border border-primary text-primary hover:bg-primary/5 rounded-input text-sm font-medium transition-all flex items-center gap-2">
              <Eye size={16} />
              Preview
            </button>
            <button className="px-4 h-9 border border-primary text-primary hover:bg-primary/5 rounded-input text-sm font-medium transition-all flex items-center gap-2">
              <FileDown size={16} />
              Export PDF
            </button>
          </div>
        </header>

        <div className="p-8 max-w-4xl w-full mx-auto">
          <div className="mb-8">
            <h3 className="text-text-primary text-lg font-semibold">Portfolio Content</h3>
            <p className="text-text-secondary text-sm">Rearrange and manage your portfolio sections.</p>
          </div>

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sections.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => (
                  <SortableItem key={section.id} section={section} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="mt-8">
            <button className="w-full h-14 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-card flex items-center justify-center gap-2 font-semibold transition-all group">
              <PlusCircle className="group-hover:scale-110 transition-transform" />
              Add Section
            </button>
          </div>

          <div className="mt-16 bg-primary/5 rounded-card p-6 border border-primary/10">
            <div className="flex gap-4">
              <div className="bg-primary/10 p-3 rounded-input h-fit">
                <Lightbulb className="text-primary" />
              </div>
              <div>
                <h5 className="text-text-primary font-semibold mb-1 text-sm">Pro Tip</h5>
                <p className="text-text-secondary text-xs leading-relaxed">
                  You can drag and drop sections to change their appearance on your public portfolio page. Hidden sections will remain in your editor but won't be visible to viewers or in the PDF export.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
