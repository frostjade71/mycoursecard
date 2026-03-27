import React, { useState, useEffect } from 'react';
import { 
  Layers, BrainCircuit, UploadCloud, Settings, 
  GripVertical, Edit3, EyeOff, PlusCircle, Check, Trash2,
  Plus, ExternalLink, Eye, LogOut
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
      className="bg-primary hover:bg-primary/90 text-text-on-primary px-4 py-1.5 text-xs font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sections' | 'profile'>('sections');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const [savingProfile, setSavingProfile] = useState(false);

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
    if (profile) {
      setProfile({ ...profile, school: schoolName });
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (profile) {
      setProfile({ ...profile, school: value });
    }
    
    if (value.length > 2) {
      debouncedSearch(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const { error: updateError } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      bio: profile.bio,
      github_url: profile.github_url,
      linkedin_url: profile.linkedin_url,
      portfolio_url: profile.portfolio_url,
      school: profile.school,
      year_level: profile.year_level
    }).eq('id', user!.id);
    
    if (!updateError) {
      // Community School Logic: Try to add it if it's missing from the database
      try {
        if (profile.school && profile.school.trim() !== '') {
          await supabase
            .from('universities')
            .insert([{ 
              name: profile.school, 
              country: 'Philippines',
              created_by: user!.id 
            }]);
        }
      } catch (e) {
        // Quietly fail if already exists or other error
      }
      alert('Profile updated successfully!');
    } else {
      alert('Error updating profile: ' + updateError.message);
    }
    setSavingProfile(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-surface">Loading Dashboard...</div>;

  return (
    <div className="flex h-full overflow-hidden bg-surface text-text-primary font-sans antialiased">
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
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('sections')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-input transition-colors ${activeTab === 'sections' ? 'bg-primary/5 text-primary' : 'text-text-secondary hover:bg-surface'}`}
          >
            <Layers size={20} />
            <span className={`text-sm ${activeTab === 'sections' ? 'font-semibold' : 'font-medium'}`}>Sections</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-input transition-colors ${activeTab === 'profile' ? 'bg-primary/5 text-primary' : 'text-text-secondary hover:bg-surface'}`}
          >
            <Settings size={20} />
            <span className={`text-sm ${activeTab === 'profile' ? 'font-semibold' : 'font-medium'}`}>Profile Settings</span>
          </button>
          <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
            <BrainCircuit size={20} />
            <span className="text-sm font-medium">Skills</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
            <UploadCloud size={20} />
            <span className="text-sm font-medium">Upload Files</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 text-text-secondary hover:bg-surface rounded-input transition-colors" href="#">
            <Settings size={20} />
            <span className="text-sm font-medium">Extra Options</span>
          </a>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={async () => {
              await signOut();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3 py-3 text-text-secondary hover:text-error hover:bg-error/5 rounded-input transition-colors group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest text-left">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div id="portfolio-content" className="p-8 max-w-4xl w-full mx-auto pb-32">
          {activeTab === 'sections' ? (
            <>
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
            </>
          ) : (
            <div className="bg-background border border-border rounded-card p-8 shadow-sm">
              <h3 className="text-xl font-bold text-text-primary mb-6">Profile Settings</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text"
                      className="w-full bg-surface border border-border px-4 py-3 rounded-input outline-none focus:border-primary transition-all"
                      value={profile.full_name || ''}
                      onChange={e => setProfile({...profile, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">School</label>
                    <input 
                      type="text"
                      className="w-full bg-surface border border-border px-4 py-3 rounded-input outline-none focus:border-primary transition-all"
                      value={profile.school || ''}
                      onChange={handleSchoolChange}
                      onFocus={() => {
                        if (profile.school?.length > 2) {
                          setShowSuggestions(true);
                          fetchSchools(profile.school);
                        }
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
                              Not in the list? Just type it manually.
                            </div>
                          </>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => setShowSuggestions(false)}
                            className="w-full px-4 py-8 text-center bg-surface/20 hover:bg-primary/5 transition-colors group"
                          >
                            <p className="text-sm text-text-secondary mb-2 font-medium">No results matching <br /> <span className="text-text-primary font-bold italic">"{profile.school}"</span></p>
                            <div className="h-px w-12 bg-border mx-auto mb-3 group-hover:w-20 transition-all"></div>
                            <p className="text-[10px] text-secondary font-black uppercase tracking-[0.2em] animate-pulse group-hover:scale-105 transition-transform">Be the First to create in your instituition</p>
                          </button>
                        )}
                      </div>
                    )}
                    {isSearching && (
                      <div className="absolute left-[calc(100%-40px)] top-[45px]">
                        <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Bio / Introduction</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-surface border border-border px-4 py-3 rounded-input outline-none focus:border-primary transition-all resize-none"
                    value={profile.bio || ''}
                    onChange={e => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell your story..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">GitHub URL</label>
                    <input 
                      type="url"
                      className="w-full bg-surface border border-border px-4 py-3 rounded-input outline-none focus:border-primary transition-all"
                      value={profile.github_url || ''}
                      onChange={e => setProfile({...profile, github_url: e.target.value})}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">LinkedIn URL</label>
                    <input 
                      type="url"
                      className="w-full bg-surface border border-border px-4 py-3 rounded-input outline-none focus:border-primary transition-all"
                      value={profile.linkedin_url || ''}
                      onChange={e => setProfile({...profile, linkedin_url: e.target.value})}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Portfolio/Web</label>
                    <input 
                      type="url"
                      className="w-full bg-surface border border-border px-4 py-3 rounded-input outline-none focus:border-primary transition-all"
                      value={profile.portfolio_url || ''}
                      onChange={e => setProfile({...profile, portfolio_url: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    disabled={savingProfile}
                    className="bg-primary hover:bg-primary/90 text-text-on-primary px-8 py-3 rounded-card font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
