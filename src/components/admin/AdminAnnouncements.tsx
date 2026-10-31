import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Announcement } from '../../types/lms';
import { Plus, Bell, Megaphone, Calendar, AlertCircle } from 'lucide-react';

export const AdminAnnouncements: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const loadClasses = async () => {
    const cList = await mockProvider.getClasses();
    setClasses(cList);
    if (cList.length > 0) {
      setSelectedClassId(cList[0].id);
      loadAnnouncements(cList[0].id);
    }
  };

  const loadAnnouncements = async (classId: string) => {
    const aList = await mockProvider.getAnnouncements(classId);
    setAnnouncements(aList);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadAnnouncements(cid);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    const currentUser = mockProvider.getCurrentUser();
    await mockProvider.createAnnouncement({
      classId: selectedClassId,
      title,
      content,
      authorName: currentUser.name,
      isImportant
    });
    setTitle('');
    setContent('');
    setIsImportant(false);
    setShowModal(false);
    loadAnnouncements(selectedClassId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Thông Báo Lớp Học</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Đăng tải thông báo quan trọng đến toàn bộ học viên trong lớp.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={e => handleClassChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Đăng Thông Báo
          </button>
        </div>
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
                <span className="text-xs text-slate-500 font-mono">Đăng bởi {ann.authorName}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(ann.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{ann.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Đăng Thông Báo Mới</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề thông báo</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Lịch kiểm tra giữa kỳ..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="important"
                  checked={isImportant}
                  onChange={e => setIsImportant(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="important" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Đánh dấu là thông báo quan trọng</label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Nhập nội dung thông báo gửi đến học viên..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Đăng Thông Báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
