import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { GradeRecord } from '../../types/lms';
import { Award, CheckCircle2, Calendar, MessageSquare } from 'lucide-react';

export const StudentResults: React.FC = () => {
  const currentUser = mockProvider.getCurrentUser();
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  useEffect(() => {
    mockProvider.getGrades(currentUser.id).then(setGrades);
  }, [currentUser]);

  const totalScore = grades.reduce((acc, g) => acc + g.score, 0);
  const avg = grades.length > 0 ? (totalScore / grades.length).toFixed(1) : '9.0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Kết Quả Học Tập & Nhận Xét</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Xem điểm số chi tiết và feedback từ giáo viên cho các bài tập đã nộp.</p>
      </div>

      {/* Summary KPI */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold block mb-1">Điểm Trung Bình Tích Lũy</span>
          <div className="text-3xl font-extrabold font-mono">{avg} <span className="text-lg font-normal text-emerald-200">/ 10</span></div>
        </div>
        <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-xs">
          <Award className="w-8 h-8 text-amber-300" />
        </div>
      </div>

      <div className="space-y-4">
        {grades.map(g => (
          <div key={g.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Điểm số: {g.score} / {g.maxScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">Chấm ngày: {g.gradedAt}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{g.assignmentTitle}</h3>

            {g.feedback && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  Nhận xét của giáo viên:
                </span>
                <p className="text-slate-600 dark:text-slate-300">{g.feedback}</p>
              </div>
            )}
          </div>
        ))}
        {grades.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            Bạn chưa có bài tập nào được chấm điểm.
          </div>
        )}
      </div>
    </div>
  );
};
