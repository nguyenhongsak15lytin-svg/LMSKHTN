import React, { useState } from 'react';
import { AdminClasses } from './AdminClasses';
import { AdminStudents } from './AdminStudents';
import { AdminSubjects } from './AdminSubjects';
import { AdminLessons } from './AdminLessons';
import { AdminAssignments } from './AdminAssignments';
import { AdminSubmissions } from './AdminSubmissions';
import { AdminGradebook } from './AdminGradebook';
import { AdminAnnouncements } from './AdminAnnouncements';
import { AdminReports } from './AdminReports';
import {
  BookOpen,
  Users,
  Layers,
  FileText,
  CheckSquare,
  FileCheck,
  Table,
  Megaphone,
  BarChart3
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'classes' | 'students' | 'subjects' | 'lessons' | 'assignments' | 'submissions' | 'gradebook' | 'announcements' | 'reports'
  >('classes');

  const navItems = [
    { id: 'classes', label: 'Lớp Học', icon: BookOpen },
    { id: 'students', label: 'Học Viên', icon: Users },
    { id: 'subjects', label: 'Chủ Đề', icon: Layers },
    { id: 'lessons', label: 'Bài Giảng', icon: FileText },
    { id: 'assignments', label: 'Bài Tập & Rubric', icon: CheckSquare },
    { id: 'submissions', label: 'Chấm Điểm', icon: FileCheck },
    { id: 'gradebook', label: 'Bảng Điểm', icon: Table },
    { id: 'announcements', label: 'Thông Báo', icon: Megaphone },
    { id: 'reports', label: 'Báo Cáo', icon: BarChart3 }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)] bg-slate-50 dark:bg-slate-950">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 shrink-0">
        <div className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-3 tracking-wider">
          Khu vực Giáo viên
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
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
        {activeTab === 'classes' && <AdminClasses />}
        {activeTab === 'students' && <AdminStudents />}
        {activeTab === 'subjects' && <AdminSubjects />}
        {activeTab === 'lessons' && <AdminLessons />}
        {activeTab === 'assignments' && <AdminAssignments />}
        {activeTab === 'submissions' && <AdminSubmissions />}
        {activeTab === 'gradebook' && <AdminGradebook />}
        {activeTab === 'announcements' && <AdminAnnouncements />}
        {activeTab === 'reports' && <AdminReports />}
      </main>
    </div>
  );
};
