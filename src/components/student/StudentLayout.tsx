import React, { useState } from 'react';
import { StudentDashboard } from './StudentDashboard';
import { StudentClasses } from './StudentClasses';
import { StudentLessonDetail } from './StudentLessonDetail';
import { StudentAssignments } from './StudentAssignments';
import { StudentResults } from './StudentResults';
import { StudentAnnouncements } from './StudentAnnouncements';
import { AIStudyBuddyModal } from './AIStudyBuddyModal';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Award,
  Megaphone,
  Sparkles
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'assignments' | 'results' | 'announcements' | 'lesson-detail'>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [showAIModal, setShowAIModal] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'classes', label: 'Lớp Học Của Tôi', icon: BookOpen },
    { id: 'assignments', label: 'Bài Tập & Nộp Bài', icon: CheckSquare },
    { id: 'results', label: 'Kết Quả & Điểm', icon: Award },
    { id: 'announcements', label: 'Thông Báo', icon: Megaphone }
  ];

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lesson-detail');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950 relative">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0">
        <div className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-3 tracking-wider">
          Khu vực Học sinh (/app)
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (activeTab === 'lesson-detail' && item.id === 'classes');
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl">
        {activeTab === 'dashboard' && <StudentDashboard onNavigate={tab => setActiveTab(tab)} />}
        {activeTab === 'classes' && <StudentClasses onSelectLesson={handleSelectLesson} />}
        {activeTab === 'lesson-detail' && <StudentLessonDetail lessonId={selectedLessonId} onBack={() => setActiveTab('classes')} />}
        {activeTab === 'assignments' && <StudentAssignments />}
        {activeTab === 'results' && <StudentResults />}
        {activeTab === 'announcements' && <StudentAnnouncements />}
      </main>

      {/* Floating AI Study Buddy Button */}
      <button
        onClick={() => setShowAIModal(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
        Trợ lý AI Học Tập 24/7
      </button>

      <AIStudyBuddyModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
};
