import React from 'react';
import { User } from '../types/lms';
import { BookOpen, Shield, GraduationCap, Table, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  currentRole: 'admin' | 'student';
  onSwitchRole: (role: 'admin' | 'student') => void;
  onOpenSheetSchema: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentRole,
  onSwitchRole,
  onOpenSheetSchema
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Zone 1: Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-md shadow-indigo-500/20">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block">
            EduCore LMS
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Hệ Thống Quản Lí Học Tập
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation / Mode Switcher */}
      <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => onSwitchRole('admin')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            currentRole === 'admin'
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          Khu vực Giáo viên (/admin)
        </button>
        <button
          onClick={() => onSwitchRole('student')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            currentRole === 'student'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Khu vực Học sinh (/app)
        </button>
      </div>

      {/* Zone 3: Actions & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenSheetSchema}
          title="Xem cấu trúc Google Sheets Database"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <Table className="w-4 h-4" />
          <span>Google Sheets DB</span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div className="hidden lg:block text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[140px]">
              {currentUser.name}
            </span>
            <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <UserCheck className="w-3 h-3 inline" />
              {currentRole === 'admin' ? 'Giáo viên / Admin' : 'Học sinh'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
