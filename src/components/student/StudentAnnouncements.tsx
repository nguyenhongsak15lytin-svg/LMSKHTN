import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { Announcement } from '../../types/lms';
import { Megaphone, AlertCircle, Calendar } from 'lucide-react';

export const StudentAnnouncements: React.FC = () => {
  const currentUser = mockProvider.getCurrentUser();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    async function load() {
      const allAnns: Announcement[] = [];
      for (const cid of currentUser.classIds) {
        const anns = await mockProvider.getAnnouncements(cid);
        allAnns.push(...anns);
      }
      setAnnouncements(allAnns);
    }
    load();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Thông Báo Từ Giáo Viên</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Các thông báo và cập nhật quan trọng từ các lớp học của bạn.</p>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className={`p-6 rounded-2xl border transition-all shadow-xs ${
            ann.isImportant
              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {ann.isImportant && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Quan trọng
                  </span>
                )}
                <span className="text-xs text-slate-500 font-mono">Giảng viên: {ann.authorName}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(ann.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{ann.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            Chưa có thông báo nào.
          </div>
        )}
      </div>
    </div>
  );
};
