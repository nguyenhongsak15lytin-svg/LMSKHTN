import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Subject, Lesson } from '../../types/lms';
import { Plus, BookOpen, Trash2, Sparkles, Eye, EyeOff, Clock, Video } from 'lucide-react';
import { AILessonGeneratorModal } from './AILessonGeneratorModal';

export const AdminLessons: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isPublished, setIsPublished] = useState(true);

  const loadClasses = async () => {
    const cList = await mockProvider.getClasses();
    setClasses(cList);
    if (cList.length > 0) {
      setSelectedClassId(cList[0].id);
      loadSubjects(cList[0].id);
    }
  };

  const loadSubjects = async (classId: string) => {
    const sList = await mockProvider.getSubjects(classId);
    setSubjects(sList);
    if (sList.length > 0) {
      setSelectedSubjectId(sList[0].id);
      loadLessons(sList[0].id);
    } else {
      setSelectedSubjectId('');
      setLessons([]);
    }
  };

  const loadLessons = async (subjectId: string) => {
    const lList = await mockProvider.getLessons(subjectId);
    setLessons(lList);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadSubjects(cid);
  };

  const handleSubjectChange = (sid: string) => {
    setSelectedSubjectId(sid);
    loadLessons(sid);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;
    await mockProvider.createLesson({
      subjectId: selectedSubjectId,
      title,
      content,
      videoUrl,
      isPublished,
      orderIndex: lessons.length + 1,
      durationMinutes: Number(durationMinutes)
    });
    setTitle('');
    setContent('');
    setVideoUrl('');
    setShowModal(false);
    loadLessons(selectedSubjectId);
  };

  const handleTogglePublish = async (lesson: Lesson) => {
    await mockProvider.updateLesson(lesson.id, { isPublished: !lesson.isPublished });
    loadLessons(selectedSubjectId);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài giảng này?')) {
      await mockProvider.deleteLesson(id);
      loadLessons(selectedSubjectId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Quản Lý Bài Giảng & Nội Dung</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Soạn thảo, xuất bản bài học và tích hợp AI Lesson Generator.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedClassId}
            onChange={e => handleClassChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={selectedSubjectId}
            onChange={e => handleSubjectChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            AI Soạn Bài
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Thêm Bài Giảng
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {lessons.map(lesson => (
          <div key={lesson.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                  Bài {lesson.orderIndex}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  lesson.isPublished
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                }`}>
                  {lesson.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lesson.durationMinutes} phút
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {lesson.content.replace(/[#*`]/g, '')}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleTogglePublish(lesson)}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  lesson.isPublished
                    ? 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                {lesson.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {lesson.isPublished ? 'Gỡ xuất bản' : 'Xuất bản ngay'}
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Thêm Bài Giảng Mới</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề bài học</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Bài 1.3: Advanced Routing & Layouts"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
                  <select
                    value={isPublished ? 'true' : 'false'}
                    onChange={e => setIsPublished(e.target.value === 'true')}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="true">Xuất bản ngay</option>
                    <option value="false">Lưu bản nháp</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Video URL (Embed)</label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nội dung bài giảng (Markdown)</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="# Tiêu đề\n\nNội dung chi tiết bài học..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
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
                  Lưu Bài Giảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AILessonGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onApplyGenerated={(genTitle, genContent) => {
          setTitle(genTitle);
          setContent(genContent);
          setShowModal(true);
        }}
      />
    </div>
  );
};
