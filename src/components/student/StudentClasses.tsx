import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Subject, Lesson } from '../../types/lms';
import { BookOpen, Layers, FileText, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

interface StudentClassesProps {
  onSelectLesson: (lessonId: string) => void;
}

export const StudentClasses: React.FC<StudentClassesProps> = ({ onSelectLesson }) => {
  const currentUser = mockProvider.getCurrentUser();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessonsMap, setLessonsMap] = useState<{ [subjectId: string]: Lesson[] }>({});

  useEffect(() => {
    async function load() {
      const allCls = await mockProvider.getClasses();
      const myCls = allCls.filter(c => currentUser.classIds.includes(c.id));
      setClasses(myCls);
      if (myCls.length > 0) {
        setSelectedClassId(myCls[0].id);
        loadSubjectsAndLessons(myCls[0].id);
      }
    }
    load();
  }, [currentUser]);

  const loadSubjectsAndLessons = async (classId: string) => {
    const subs = await mockProvider.getSubjects(classId);
    setSubjects(subs);
    const map: { [subjectId: string]: Lesson[] } = {};
    for (const sub of subs) {
      const les = await mockProvider.getLessons(sub.id);
      map[sub.id] = les.filter(l => l.isPublished); // Only show published lessons to students
    }
    setLessonsMap(map);
  };

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadSubjectsAndLessons(cid);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Lớp Học Của Tôi</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Danh sách các học phần và bài giảng đã đăng ký.</p>
        </div>
        <div>
          <select
            value={selectedClassId}
            onChange={e => handleClassChange(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {subjects.map(sub => {
          const lessons = lessonsMap[sub.id] || [];
          return (
            <div key={sub.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    Chương {sub.orderIndex}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.title}</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">{lessons.length} bài học</span>
              </div>

              <div className="space-y-2">
                {lessons.map(lesson => (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {lesson.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono mt-0.5">
                          <Clock className="w-3 h-3" /> {lesson.durationMinutes} phút
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
                {lessons.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-2">Chưa có bài giảng nào được xuất bản trong chương này.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
