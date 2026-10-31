import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Subject } from '../../types/lms';
import { Plus, BookOpen, Trash2, Layers } from 'lucide-react';

export const AdminSubjects: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);

  const loadClasses = async () => {
    const list = await mockProvider.getClasses();
    setClasses(list);
    if (list.length > 0) {
      setSelectedClassId(list[0].id);
      loadSubjects(list[0].id);
    }
  };

  const loadSubjects = async (classId: string) => {
    const subs = await mockProvider.getSubjects(classId);
    setSubjects(subs);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadSubjects(cid);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    await mockProvider.createSubject({
      classId: selectedClassId,
      title,
      description,
      orderIndex: Number(orderIndex)
    });
    setTitle('');
    setDescription('');
    setShowModal(false);
    loadSubjects(selectedClassId);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa chủ đề này?')) {
      await mockProvider.deleteSubject(id);
      loadSubjects(selectedClassId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Quản Lý Chủ Đề / Học Phần</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Phân chia chương mục và nội dung bài giảng theo lớp.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={e => handleClassChange(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Thêm Chủ Đề
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(sub => (
          <div key={sub.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  Chương {sub.orderIndex}
                </span>
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                {sub.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {sub.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Thêm Chủ Đề Mới</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên chủ đề / chương</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Chương 3: Tailwind CSS v4"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Thứ tự chương</label>
                <input
                  type="number"
                  required
                  value={orderIndex}
                  onChange={e => setOrderIndex(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả nội dung chương..."
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
                  Thêm Chủ Đề
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
