import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { Lesson, StudentProgress } from '../../types/lms';
import { ArrowLeft, CheckCircle2, Clock, Sparkles, Download, FileText, Video } from 'lucide-react';
import { AIStudyBuddyModal } from './AIStudyBuddyModal';

interface StudentLessonDetailProps {
  lessonId: string;
  onBack: () => void;
}

export const StudentLessonDetail: React.FC<StudentLessonDetailProps> = ({ lessonId, onBack }) => {
  const currentUser = mockProvider.getCurrentUser();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  useEffect(() => {
    async function load() {
      const l = await mockProvider.getLesson(lessonId);
      setLesson(l);
      const progs = await mockProvider.getProgress(currentUser.id);
      const p = progs.find(x => x.lessonId === lessonId);
      setProgress(p || null);
    }
    load();
  }, [lessonId, currentUser]);

  const handleToggleComplete = async () => {
    const newStatus = progress?.status === 'completed' ? 'in_progress' : 'completed';
    const updated = await mockProvider.updateProgress(currentUser.id, lessonId, newStatus);
    setProgress(updated);
  };

  if (!lesson) {
    return <div className="p-8 text-center text-slate-500">Đang tải bài học...</div>;
  }

  const isCompleted = progress?.status === 'completed';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header / Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách bài học
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Hỏi AI về bài học này
          </button>
          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
            {isCompleted ? 'Đã hoàn thành bài học' : 'Đánh dấu hoàn thành'}
          </button>
        </div>
      </div>

      {/* Main Lesson Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6 shadow-xs">
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              Thời lượng: {lesson.durationMinutes} phút
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {lesson.title}
          </h1>
        </div>

        {/* Video Embed if any */}
        {lesson.videoUrl && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
            <iframe
              src={lesson.videoUrl}
              title={lesson.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Lesson Content Markdown */}
        <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
          {lesson.content}
        </div>

        {/* Attachments */}
        {lesson.attachments && lesson.attachments.length > 0 && (
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">Tài liệu đính kèm:</span>
            <div className="flex flex-wrap gap-3">
              {lesson.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  {att.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <AIStudyBuddyModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        contextLessonTitle={lesson.title}
      />
    </div>
  );
};
