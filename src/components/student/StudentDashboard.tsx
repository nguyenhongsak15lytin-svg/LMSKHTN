import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Assignment, Announcement, GradeRecord } from '../../types/lms';
import { BookOpen, CheckSquare, Award, Megaphone, Clock, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: 'classes' | 'assignments' | 'results' | 'announcements') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const currentUser = mockProvider.getCurrentUser();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  useEffect(() => {
    async function load() {
      const allClasses = await mockProvider.getClasses();
      const myClasses = allClasses.filter(c => currentUser.classIds.includes(c.id));
      setClasses(myClasses);

      if (myClasses.length > 0) {
        const asgs = await mockProvider.getAssignments(myClasses[0].id);
        setAssignments(asgs);
        const anns = await mockProvider.getAnnouncements(myClasses[0].id);
        setAnnouncements(anns);
      }

      const gList = await mockProvider.getGrades(currentUser.id);
      setGrades(gList);
    }
    load();
  }, [currentUser]);

  const avgScore = grades.length > 0 ? (grades.reduce((acc, g) => acc + g.score, 0) / grades.length).toFixed(1) : '9.0';

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Học kỳ 1 - Năm học 2026-2027
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Chào mừng trở lại, {currentUser.name}! 👋
          </h1>
          <p className="text-xs lg:text-sm text-indigo-100 max-w-xl">
            Bạn có 2 bài tập sắp đến hạn trong tuần này. Hãy hoàn thành tiến độ học tập để đạt kết quả xuất sắc nhất!
          </p>
        </div>
        <button
          onClick={() => onNavigate('assignments')}
          className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold text-xs rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg self-start md:self-auto"
        >
          Xem Bài Tập Ngay
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Lớp học đang tham gia</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {classes.length} lớp
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Điểm trung bình (GPA)</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {avgScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bài tập đã hoàn thành</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {grades.length} / {assignments.length}
          </div>
        </div>
      </div>

      {/* Two Columns: Upcoming Assignments & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Bài Tập Sắp Đến Hạn
            </h3>
            <button onClick={() => onNavigate('assignments')} className="text-xs font-semibold text-indigo-600 hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {assignments.map(asg => (
              <div key={asg.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    Thang điểm: {asg.maxScore}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{asg.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    Hạn: {new Date(asg.dueDate).toLocaleString('vi-VN')}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('assignments')}
                  className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Nộp bài
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-600" />
              Thông Báo Mới Nhất
            </h3>
            <button onClick={() => onNavigate('announcements')} className="text-xs font-semibold text-indigo-600 hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 3).map(ann => (
              <div key={ann.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{ann.authorName}</span>
                  <span>{new Date(ann.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
