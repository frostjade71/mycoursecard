import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Layers, BrainCircuit, UploadCloud, Settings, GraduationCap, 
  Eye, FileDown, GripVertical, Edit3, EyeOff, PlusCircle, Check, Trash2,
  Plus, ExternalLink
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SectionItem {
  id: string;
  section_id: string;
  user_id?: string;
  title: string;
  description: string;
  url: string;
  position: number;
}

interface Section {
  id: string;
  user_id: string;
  title: string;
  section_type: string;
  position: number;
  is_visible: boolean;
  items?: SectionItem[];
}

const ItemEditor = ({ item, onSave, onCancel }: { item: Partial<SectionItem>, onSave: (i: Partial<SectionItem>) => void, onCancel: () => void }) => {
  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description || '');
  const [url, setUrl] = useState(item.url || '');

  return (
    <div className="bg-surface border border-border rounded-input p-4 mt-3 space-y-3 shadow-sm">
      <input 
        autoFocus
        className="w-full bg-background border border-border px-3 py-2 rounded-input text-sm text-text-primary outline-none focus:border-primary transition-colors" 
        placeholder="Item Title (e.g. Project Name)" 
        value={title} 
        onChange={e=>setTitle(e.target.value)} 
      />
      <textarea 
        className="w-full bg-background border border-border px-3 py-2 rounded-input text-sm text-text-primary outline-none focus:border-primary transition-colors resize-none" 
        placeholder="Description" 
        rows={2} 
        value={description} 
        onChange={e=>setDescription(e.target.value)} 
      />
      <input 
        className="w-full bg-background border border-border px-3 py-2 rounded-input text-sm text-text-primary outline-none focus:border-primary transition-colors" 
        placeholder="URL Link (optional)" 
        value={url} 
        onChange={e=>setUrl(e.target.value)} 
      />
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={onCancel} className="px-4 py-1.5 text-xs font-semibold text-text-secondary hover:bg-black/5 rounded transition-colors">Cancel</button>
        <button 
          onClick={() => title.trim() && onSave({ ...item, title, description, url })} 
          disabled={!title.trim()}
          className="px-4 py-1.5 text-xs font-semibold bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  )
}

const SortableItem = ({ 
  section, onToggleVisibility, onUpdateTitle, onDelete, onAddItem, onUpdateItem, onDeleteItem 
}: { 
  section: Section, 
  onToggleVisibility: (id: string, visible: boolean) => void, 
  onUpdateTitle: (id: string, title: string) => void, 
  onDelete: (id: string) => void,
  onAddItem: (item: Partial<SectionItem>) => void,
  onUpdateItem: (item: Partial<SectionItem>) => void,
  onDeleteItem: (sectionId: string, itemId: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  
  const [addingItem, setAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (editTitle.trim() !== section.title) {
      onUpdateTitle(section.id, editTitle.trim() || 'Untitled Section');
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="group/section bg-background border border-dashed border-border rounded-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div {...attributes} {...listeners} className="mr-4 text-text-secondary cursor-grab active:cursor-grabbing outline-none">
          <GripVertical size={20} />
        </div>
        <div className="flex-1">
          {isEditingTitle ? (
            <input 
              autoFocus 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              onBlur={handleSaveTitle}
              onKeyDown={e => e.key === 'Enter' && handleSaveTitle()}
              className="text-text-primary font-medium w-full border-b border-primary outline-none bg-transparent"
            />
          ) : (
            <h4 className="text-text-primary font-medium">{section.title}</h4>
          )}
          <p className="text-xs text-text-secondary uppercase tracking-wider mt-0.5">{section.section_type.replace('_', ' ')}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => { setIsEditingTitle(true); setEditTitle(section.title); }} className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
            <Edit3 size={20} />
          </button>
          <button onClick={() => onToggleVisibility(section.id, !section.is_visible)} className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
            {section.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button onClick={() => onDelete(section.id)} className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Embedded Items */}
      <div className="mt-4 pl-[36px] space-y-2">
         {section.items?.map(item => (
           <div key={item.id}>
             {editingItemId === item.id ? (
               <ItemEditor item={item} onSave={(updated) => { onUpdateItem(updated); setEditingItemId(null); }} onCancel={() => setEditingItemId(null)} />
             ) : (
               <div className="group/item flex items-start justify-between bg-primary/5 border border-primary/10 rounded-input p-3">
                 <div className="flex-1 pr-4">
                   <h5 className="text-sm font-bold text-text-primary flex items-center gap-2">
                     {item.title} 
                     {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><ExternalLink size={12}/></a>}
                   </h5>
                   {item.description && <p className="text-xs text-text-secondary mt-1 whitespace-pre-wrap">{item.description}</p>}
                 </div>
                 <div className="opacity-0 group-hover/item:opacity-100 transition-opacity flex shrink-0">
                   <button onClick={() => setEditingItemId(item.id)} className="p-1.5 text-text-secondary hover:text-primary rounded-full transition-colors"><Edit3 size={14}/></button>
                   <button onClick={() => onDeleteItem(section.id, item.id)} className="p-1.5 text-text-secondary hover:text-red-500 rounded-full transition-colors"><Trash2 size={14}/></button>
                 </div>
               </div>
             )}
           </div>
         ))}
         
         {addingItem ? (
           <ItemEditor item={{ section_id: section.id }} onSave={(newItem) => { onAddItem(newItem); setAddingItem(false); }} onCancel={() => setAddingItem(false)} />
         ) : (
           <button onClick={() => setAddingItem(true)} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 mt-2 transition-colors">
             <Plus size={14} /> Add Item
           </button>
         )}
       </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!user) return;
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    // Fetch profile
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user!.id).single();
    if (profileData) {
      if (!profileData.username) {
        navigate('/onboarding');
        return;
      }
      setProfile(profileData);
      
      // Fetch sections & items
      const { data: sectionData } = await supabase.from('sections').select('*').eq('user_id', user!.id).order('position');
      const { data: itemData } = await supabase.from('section_items').select('*').order('position');
      
      if (sectionData && sectionData.length > 0) {
        const mapped = sectionData.map(sec => ({
          ...sec,
          items: itemData?.filter(item => item.section_id === sec.id) || []
        }));
        setSections(mapped);
      } else {
        // Generate defaults if brand new
        await generateDefaultSections(profileData.course);
      }
    } else {
      navigate('/onboarding');
    }
    setLoading(false);
  };

  const generateDefaultSections = async (courseCode: string) => {
    const defaults = [
      { user_id: user!.id, title: 'About Me', section_type: 'about', position: 0, is_visible: true },
      { user_id: user!.id, title: 'Education', section_type: 'education', position: 1, is_visible: true },
    ];
    
    if (courseCode === 'cs') {
      defaults.push({ user_id: user!.id, title: 'Projects', section_type: 'projects', position: 2, is_visible: true });
      defaults.push({ user_id: user!.id, title: 'Tech Stack', section_type: 'skills', position: 3, is_visible: true });
    } else if (courseCode === 'education') {
      defaults.push({ user_id: user!.id, title: 'Teaching Philosophy', section_type: 'philosophy', position: 2, is_visible: true });
      defaults.push({ user_id: user!.id, title: 'Lesson Plans', section_type: 'projects', position: 3, is_visible: true });
    } else {
      defaults.push({ user_id: user!.id, title: 'Experience', section_type: 'experience', position: 2, is_visible: true });
    }

    const { data, error } = await supabase.from('sections').insert(defaults).select();
    if (data) {
        setSections(data.sort((a, b) => a.position - b.position).map(doc => ({...doc, items: []})));
    } else {
        console.error("Failed to generate default sections", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        
        // Update DB in background
        const updates = newArray.map((sec, index) => ({
          id: sec.id,
          user_id: user!.id,
          position: index,
          title: sec.title,
          section_type: sec.section_type,
          is_visible: sec.is_visible
        }));
        
        supabase.from('sections').upsert(updates).then();

        return newArray;
      });
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, is_visible: visible } : s));
    await supabase.from('sections').update({ is_visible: visible }).eq('id', id);
  };

  const handleUpdateTitle = async (id: string, title: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s));
    await supabase.from('sections').update({ title }).eq('id', id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? All its items will also be removed.')) return;
    setSections(prev => prev.filter(s => s.id !== id));
    await supabase.from('sections').delete().eq('id', id);
  };

  const handleAddSection = async () => {
    const newPos = sections.length;
    const { data } = await supabase.from('sections').insert([{
      user_id: user!.id,
      title: 'New Section',
      section_type: 'custom',
      position: newPos,
      is_visible: true
    }]).select().single();

    if (data) {
      setSections([...sections, { ...data, items: [] }]);
    }
  };

  // Section Item Handlers
  const handleAddItem = async (item: Partial<SectionItem>) => {
    const { data } = await supabase.from('section_items').insert({
      section_id: item.section_id,
      title: item.title,
      description: item.description,
      url: item.url,
      position: 0
    }).select().single();

    if (data) {
      setSections(prev => prev.map(s => s.id === item.section_id ? { ...s, items: [...(s.items||[]), data] } : s));
    }
  };

  const handleUpdateItem = async (item: Partial<SectionItem>) => {
    const { data } = await supabase.from('section_items').update({
      title: item.title,
      description: item.description,
      url: item.url
    }).eq('id', item.id).select().single();

    if (data) {
      setSections(prev => prev.map(s => s.id === item.section_id ? { ...s, items: s.items?.map(i => i.id === item.id ? data : i) } : s));
    }
  };

  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, items: s.items?.filter(i => i.id !== itemId) } : s));
    await supabase.from('section_items').delete().eq('id', itemId);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface">Loading Dashboard...</div>;

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-text-primary font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-[240px] bg-background border-r border-border flex flex-col shrink-0">
        <div className="p-6 flex flex-col items-center border-b border-border">
          <div className="relative mb-3">
            <img 
              alt={`${profile?.full_name} Profile portrait`}
              className="w-20 h-20 rounded-full border-2 border-primary/10 object-cover" 
              src={profile?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile?.full_name || "User")}
            />
            <div className="absolute bottom-0 right-0 bg-primary w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <Check className="text-white" size={12} />
            </div>
          </div>
          <h1 className="text-text-primary font-semibold text-base">{profile?.full_name || 'Student'}</h1>
          <span className="mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-medium rounded-full uppercase tracking-wider">{profile?.course || 'Enrolled'}</span>
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
            <button onClick={() => navigate(`/u/${profile?.username}`)} className="px-4 h-9 border border-primary text-primary hover:bg-primary/5 rounded-input text-sm font-medium transition-all flex items-center gap-2">
              <Eye size={16} />
              Preview
            </button>
            <button className="px-4 h-9 border border-primary text-primary hover:bg-primary/5 rounded-input text-sm font-medium transition-all flex items-center gap-2">
              <FileDown size={16} />
              Export PDF
            </button>
          </div>
        </header>

        <div className="p-8 max-w-4xl w-full mx-auto pb-32">
          <div className="mb-8">
            <h3 className="text-text-primary text-lg font-semibold">Portfolio Content</h3>
            <p className="text-text-secondary text-sm">Organize sections and add relevant projects or skills below.</p>
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
                  <SortableItem 
                    key={section.id} 
                    section={section} 
                    onToggleVisibility={handleToggleVisibility}
                    onUpdateTitle={handleUpdateTitle}
                    onDelete={handleDelete}
                    onAddItem={handleAddItem}
                    onUpdateItem={handleUpdateItem}
                    onDeleteItem={handleDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="mt-8">
            <button onClick={handleAddSection} className="w-full h-14 border-2 border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 rounded-card flex items-center justify-center gap-2 font-semibold transition-all group">
              <PlusCircle className="group-hover:scale-110 transition-transform" />
              Add New Section
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
