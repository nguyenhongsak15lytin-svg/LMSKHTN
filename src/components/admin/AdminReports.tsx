import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { Users, BookOpen, Layers, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const [reports, setReports] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalLessons: 0,
    averageScore: 0,
    submissionRate: 0
  });

  useEffect(() => {
    mockProvider.getSystemReports().then(setReports);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Báo Cáo & Thống Kê Hệ Thống</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Tổng quan chỉ số học tập, tỷ lệ hoàn thành và chất lượng giảng dạy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng số học viên</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {reports.totalStudents}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12% so với tháng trước
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tổng số lớp học</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {reports.totalClasses}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Đang hoạt động ổn định</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Điểm trung bình toàn trường</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {reports.averageScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Chất lượng đạt chuẩn
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tỷ lệ nộp bài tập</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {reports.submissionRate}%
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Đúng hạn 92%</span>
        </div>
      </div>
    </div>
  );
};
