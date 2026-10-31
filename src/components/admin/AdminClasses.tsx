import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom } from '../../types/lms';
import { Plus, BookOpen, Users, Calendar, Trash2, Edit, CheckCircle2 } from 'lucide-react';

export const AdminClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    const list = await mockProvider.getClasses();
    setClasses(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = mockProvider.getCurrentUser();
    await mockProvider.createClass({
      name,
      code,
      description,
      teacherId: currentUser.id,
      teacherName: currentUser.name
    });
    setName('');
    setCode('');
    setDescription('');
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa lớp học này?')) {
      await mockProvider.deleteClass(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Quản Lý Lớp Học</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Danh sách các lớp học phần do giáo viên quản lý.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Thêm Lớp Học Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  {cls.code}
                </span>
                <button
                  onClick={() => handleDelete(cls.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                {cls.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                {cls.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                {cls.studentCount || 2} học viên
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {cls.createdAt}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tạo Lớp Học Mới</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên lớp học</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ví dụ: Lập trình Web Nâng cao K19"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mã lớp</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="Ví dụ: WEB301"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả học phần</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung và mục tiêu học tập..."
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
                  Tạo Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
