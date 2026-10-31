import React, { useState } from 'react';
import { generateAILessonContent } from '../../services/geminiService';
import { Sparkles, Loader2, X, BookOpen } from 'lucide-react';

interface AILessonGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGenerated: (title: string, content: string) => void;
}

export const AILessonGeneratorModal: React.FC<AILessonGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyGenerated
}) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Nâng cao');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    const result = await generateAILessonContent(topic, level);
    setLoading(false);
    onApplyGenerated(result.title, result.content);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Soạn Bài Giảng Tự Động
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sử dụng Gemini AI để tạo nội dung bài giảng chuyên sâu theo chuẩn sư phạm.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Chủ đề bài giảng / Từ khóa trọng tâm
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ví dụ: Xây dựng Custom Hooks trong React 19"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Trình độ học viên
            </label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Cơ bản">Cơ bản (Beginner)</option>
              <option value="Trung bình">Trung bình (Intermediate)</option>
              <option value="Nâng cao">Nâng cao (Advanced)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo nội dung AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tạo Bài Giảng
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
