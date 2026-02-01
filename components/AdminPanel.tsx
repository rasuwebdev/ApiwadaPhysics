
import React, { useState, useRef, useEffect } from 'react';
// Fixed: Removed non-existent import getUserByIndex
import { getDB, updateUser, getAllStudents, exportStudentsToCSV, getSettings, saveSettings, getCourses, saveCourses } from '../services/dbService';
import { User, SiteSettings, Course, Mark, CourseVideo, LiveSession, FreeVideo, ExamYearStars, TopStudent } from '../types';
import { 
  Users, Search, PlusCircle, PenTool, CheckCircle, Download, Layout, Save, Info, 
  Camera, Video, Trash2, Edit3, Plus, Palette, Image as ImageIcon, Upload, 
  ArrowLeft, Shield, Globe, BookOpen, Settings2, Key, Radio, Clock, X, Star, Monitor
} from 'lucide-react';

const AdminPanel: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const isAdmin1 = currentUser?.contact === 'ADMIN1';
  const isAdmin2 = currentUser?.contact === 'ADMIN2';
  const hasSpecialAccess = isAdmin1 || isAdmin2;

  const [activeTab, setActiveTab] = useState<'students' | 'site' | 'courses' | 'branding' | 'hero'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [newMarkLabel, setNewMarkLabel] = useState<string>('');
  const [newMarkScore, setNewMarkScore] = useState<string>('');
  const [resetPassword, setResetPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const tutorInputRef = useRef<HTMLInputElement>(null);

  const [allCourses, setAllCourses] = useState<Course[]>(getCourses());
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [students, setStudents] = useState<User[]>(getAllStudents());

  useEffect(() => {
    setStudents(getAllStudents());
  }, [activeTab, message]);

  const handleUpdateSettings = () => {
    saveSettings(settings);
    setMessage('Platform updated across all devices!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateCourses = () => {
    saveCourses(allCourses);
    setMessage('Course modules saved!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Fixed: Implemented missing handlePasswordReset function
  const handlePasswordReset = () => {
    if (!targetUser || !resetPassword) return;
    const updatedUser = { ...targetUser, password: resetPassword };
    updateUser(updatedUser);
    setTargetUser(updatedUser);
    setResetPassword('');
    setMessage('Student password updated!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUploadFile = (type: 'logo' | 'bg' | 'tutor', file: File) => {
    if (file.size > 1024 * 1024) {
      setMessage('Max size 1MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'logo') setSettings({ ...settings, logoUrl: result });
      else if (type === 'bg') setSettings({ ...settings, backgroundImages: [result] });
      else if (type === 'tutor') setSettings({ ...settings, heroTutorImage: result });
    };
    reader.readAsDataURL(file);
  };

  const updateStar = (yearIdx: number, studentIdx: number, field: keyof TopStudent, value: any) => {
    const newStars = [...(settings.topStars || [])];
    newStars[yearIdx].students[studentIdx] = { ...newStars[yearIdx].students[studentIdx], [field]: value };
    setSettings({ ...settings, topStars: newStars });
  };

  const addStar = (yearIdx: number) => {
    const newStars = [...(settings.topStars || [])];
    if (newStars[yearIdx].students.length >= 5) return;
    newStars[yearIdx].students.push({ rank: newStars[yearIdx].students.length + 1, name: '', index: '', score: '' });
    setSettings({ ...settings, topStars: newStars });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.indexNumber.includes(searchQuery) ||
    s.contact.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 mt-10">
      {/* Admin Nav Bar */}
      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black">Admin HQ</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{currentUser?.name}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setActiveTab('students'); setTargetUser(null); }} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'students' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <Users className="w-4 h-4" /> Students
          </button>
          <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'courses' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <BookOpen className="w-4 h-4" /> Courses
          </button>
          {hasSpecialAccess && (
            <button onClick={() => setActiveTab('hero')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'hero' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
              <Monitor className="w-4 h-4" /> Hero & Stars
            </button>
          )}
          <button onClick={() => setActiveTab('site')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'site' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
            <Globe className="w-4 h-4" /> Content
          </button>
          {isAdmin1 && (
            <button onClick={() => setActiveTab('branding')} className={`px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center gap-2 ${activeTab === 'branding' ? 'bg-purple-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
              <Palette className="w-4 h-4" /> Branding
            </button>
          )}
        </div>
      </div>

      {message && <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100 font-black text-center animate-in zoom-in-95">{message}</div>}

      {/* Hero & Stars Tab (Admin 1/2 only) */}
      {activeTab === 'hero' && hasSpecialAccess && (
        <div className="space-y-12 animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-8">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Monitor className="text-blue-600" /> Hero Section Customizer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Top Badge</label><input className="w-full p-3 bg-slate-50 border rounded-xl font-bold" value={settings.heroBadge} onChange={e => setSettings({...settings, heroBadge: e.target.value})} /></div>
               <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Title</label><input className="w-full p-3 bg-slate-50 border rounded-xl font-bold" value={settings.heroTitle} onChange={e => setSettings({...settings, heroTitle: e.target.value})} /></div>
               <div className="md:col-span-2 space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Subtitle</label><textarea className="w-full p-3 bg-slate-50 border rounded-xl font-bold h-24" value={settings.heroSubtitle} onChange={e => setSettings({...settings, heroSubtitle: e.target.value})} /></div>
               <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase">Tutor PNG Image</label><div className="flex items-center gap-4"><div className="w-20 h-20 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden">{settings.heroTutorImage && <img src={settings.heroTutorImage} className="w-full h-full object-contain" />}</div><button onClick={() => tutorInputRef.current?.click()} className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md">Change PNG</button><input type="file" ref={tutorInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleUploadFile('tutor', e.target.files[0])} /></div></div>
            </div>
            <div className="space-y-4 pt-6 border-t"><h4 className="text-sm font-black text-slate-800 uppercase">Stats Counters</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{(settings.heroStats || []).map((stat, i) => (<div key={i} className="space-y-2 p-4 bg-slate-50 rounded-2xl border"><input className="w-full p-2 text-xs font-black border-b" value={stat.value} onChange={e => { const news = [...settings.heroStats]; news[i].value = e.target.value; setSettings({...settings, heroStats: news}); }} /><input className="w-full p-2 text-[10px] font-bold text-slate-400" value={stat.label} onChange={e => { const news = [...settings.heroStats]; news[i].label = e.target.value; setSettings({...settings, heroStats: news}); }} /></div>))}</div></div>
            <button onClick={handleUpdateSettings} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Save Global Hero Content</button>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-10">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Star className="text-yellow-500 fill-yellow-500" /> Monthly Top Stars (Golden List)</h3>
            <div className="space-y-12">{(settings.topStars || []).map((yearStars, yIdx) => (<div key={yearStars.year} className="space-y-4 border-l-4 border-yellow-400 pl-6"><div className="flex items-center justify-between"><h4 className="text-lg font-black text-slate-700">{yearStars.year} Batch</h4><button onClick={() => addStar(yIdx)} className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 border border-yellow-100"><Plus className="w-3 h-3"/> Add Star</button></div><div className="grid grid-cols-1 md:grid-cols-5 gap-4">{yearStars.students.map((st, sIdx) => (<div key={sIdx} className="bg-slate-50 p-4 rounded-2xl space-y-3 relative group border border-slate-100 shadow-sm"><button onClick={() => { const news = [...settings.topStars]; news[yIdx].students = news[yIdx].students.filter((_, i) => i !== sIdx); setSettings({...settings, topStars: news}); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><X className="w-3 h-3"/></button><input className="w-full p-2 text-xs font-bold border rounded-lg" placeholder="Name" value={st.name} onChange={e => updateStar(yIdx, sIdx, 'name', e.target.value)} /><input className="w-full p-2 text-[10px] font-bold border rounded-lg" placeholder="Index" value={st.index} onChange={e => updateStar(yIdx, sIdx, 'index', e.target.value)} /><input className="w-full p-2 text-[10px] font-bold border rounded-lg" placeholder="Score %" value={st.score} onChange={e => updateStar(yIdx, sIdx, 'score', e.target.value)} /></div>))}</div></div>))}</div>
            <button onClick={handleUpdateSettings} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg">Commit Golden Stars</button>
          </div>
        </div>
      )}

      {/* Site Tab - Managed Content */}
      {activeTab === 'site' && (
        <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-12 animate-in fade-in">
          <div className="flex items-center justify-between border-b pb-6"><h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Globe className="text-blue-600" /> Platform Global Content</h3></div>
          
          {/* Gallery Manager */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h4 className="text-lg font-black text-slate-800 flex items-center gap-2"><ImageIcon className="text-indigo-600" /> Gallery Images Directory</h4>
              <button onClick={() => { const newS = { ...settings }; newS.galleryImages = [...newS.galleryImages, '']; setSettings(newS); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md">ADD NEW IMAGE LINK</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {settings.galleryImages.map((img, i) => (
                 <div key={i} className="flex gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 group relative shadow-sm">
                    <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 shadow-inner border border-white">
                      {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-6 h-6" /></div>}
                    </div>
                    <div className="flex-1 space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase">Image URL (Cloud/Imgur/Unsplash)</label>
                       <input className="w-full p-2 bg-white border rounded-xl text-xs font-bold" value={img} onChange={e => { const newS = { ...settings }; newS.galleryImages[i] = e.target.value; setSettings(newS); }} placeholder="https://i.imgur.com/..." />
                    </div>
                    <button onClick={() => { const newS = { ...settings }; newS.galleryImages = newS.galleryImages.filter((_, idx) => idx !== i); setSettings(newS); }} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                 </div>
               ))}
               {settings.galleryImages.length === 0 && <div className="col-span-2 text-center py-10 text-slate-400 font-bold italic">No gallery images available.</div>}
            </div>
          </div>

          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><h4 className="text-lg font-black text-slate-800 flex items-center gap-2"><Video className="text-blue-600" /> Free Lessons</h4><button onClick={() => { const newS = { ...settings }; newS.freeVideos = [...newS.freeVideos, { id: '', title: '' }]; setSettings(newS); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md">ADD VIDEO</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{settings.freeVideos.map((v, i) => (<div key={i} className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-3 relative group"><button onClick={() => { const newS = { ...settings }; newS.freeVideos = newS.freeVideos.filter((_, idx) => idx !== i); setSettings(newS); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"><X className="w-3 h-3"/></button><input placeholder="Title" className="w-full p-2 bg-white border rounded-lg text-xs font-bold" value={v.title} onChange={e => { const newS = { ...settings }; newS.freeVideos[i].title = e.target.value; setSettings(newS); }} /><input placeholder="YouTube ID" className="w-full p-2 bg-white border rounded-lg text-xs font-bold" value={v.id} onChange={e => { const newS = { ...settings }; newS.freeVideos[i].id = e.target.value; setSettings(newS); }} /></div>))}</div>
          </div>

          <button onClick={handleUpdateSettings} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 transition-all">Sync Platform Updates Globally</button>
        </div>
      )}

      {/* Standard Sections */}
      {activeTab === 'students' && !targetUser && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="text" placeholder="Search students..." className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-200 font-bold" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
            <button onClick={exportStudentsToCSV} className="bg-green-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-700 transition-colors"><Download className="w-5 h-5" /> Export Data</button>
          </div>
          <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b"><tr><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Index</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Student</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase">Contact</th><th className="px-6 py-4 text-xs font-black text-slate-400 uppercase text-right">Edit</th></tr></thead>
              <tbody className="divide-y">{filteredStudents.map(student => (<tr key={student.indexNumber} className="hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => setTargetUser(student)}><td className="px-6 py-4 font-bold text-blue-600">{student.indexNumber}</td><td className="px-6 py-4 font-bold">{student.name}</td><td className="px-6 py-4 text-sm">{student.contact}</td><td className="px-6 py-4 text-right"><Settings2 className="w-5 h-5 text-slate-300 ml-auto" /></td></tr>))}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'students' && targetUser && (
        <div className="space-y-6 animate-in slide-in-from-left duration-300">
          <button onClick={() => setTargetUser(null)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 bg-white px-4 py-2 rounded-full border shadow-sm"><ArrowLeft className="w-4 h-4" /> Back to Directory</button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-8">
              <div className="flex items-center gap-6 border-b pb-8"><div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">{targetUser.name.charAt(0)}</div><div><h3 className="text-2xl font-black text-slate-900">{targetUser.name}</h3><p className="text-sm font-bold text-slate-400">Index: {targetUser.indexNumber}</p></div></div>
              <div className="space-y-4"><h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><Key className="w-4 h-4" /> Reset Password</h4><div className="flex gap-2"><input type="password" placeholder="New Password" className="flex-1 p-3 bg-slate-50 rounded-xl border text-sm font-bold" value={resetPassword} onChange={e => setResetPassword(e.target.value)} /><button onClick={handlePasswordReset} className="bg-red-600 text-white px-6 py-2 rounded-xl font-black text-xs">RESET</button></div></div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border shadow-md space-y-6"><h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Enrollment Access</h4><div className="space-y-3">{allCourses.map(course => (<div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border"><div className="text-sm font-black text-slate-800">{course.title}</div><button onClick={() => { const active = (targetUser.activeCourses || []).includes(course.id); const updated = active ? targetUser.activeCourses.filter(id => id !== course.id) : [...(targetUser.activeCourses || []), course.id]; const updatedUser = { ...targetUser, activeCourses: updated }; updateUser(updatedUser); setTargetUser(updatedUser); }} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${targetUser.activeCourses?.includes(course.id) ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>{targetUser.activeCourses?.includes(course.id) ? 'REVOKE' : 'GRANT'}</button></div>))}</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
