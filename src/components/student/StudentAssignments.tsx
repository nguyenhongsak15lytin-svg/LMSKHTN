import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Assignment, Submission } from '../../types/lms';
import { CheckSquare, Calendar, Award, Send, CheckCircle2, FileText, Upload } from 'lucide-react';

export const StudentAssignments: React.FC = () => {
  const currentUser = mockProvider.getCurrentUser();
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Submitting modal
  const [submittingAsg, setSubmittingAsg] = useState<Assignment | null>(null);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');

  const loadData = async () => {
    const allCls = await mockProvider.getClasses();
    const myCls = allCls.filter(c => currentUser.classIds.includes(c.id));
    setClasses(myCls);
    if (myCls.length > 0) {
      setSelectedClassId(myCls[0].id);
      loadClassData(myCls[0].id);
    }
  };

  const loadClassData = async (classId: string) => {
    const asgs = await mockProvider.getAssignments(classId);
    setAssignments(asgs);
    const subs = await mockProvider.getSubmissions(undefined, currentUser.id);
    setSubmissions(subs);
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadClassData(cid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAsg) return;

    await mockProvider.submitAssignment({
      assignmentId: submittingAsg.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      content,
      attachments: fileName ? [{ name: fileName, url: '#' }] : []
    });

    setSubmittingAsg(null);
    setContent('');
    setFileName('');
    loadClassData(selectedClassId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bài Tập & Nộp Bài</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Danh sách bài tập được giao và trạng thái nộp bài của bạn.</p>
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

      <div className="space-y-4">
        {assignments.map(asg => {
          const subm = submissions.find(s => s.assignmentId === asg.id);
          const isSubmitted = !!subm;
          const isGraded = subm?.status === 'graded';

          return (
            <div key={asg.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      Thang điểm: {asg.maxScore}
                    </span>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      isGraded
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : isSubmitted
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                    }`}>
                      {isGraded ? `Đã chấm: ${subm.score} / ${asg.maxScore}` : isSubmitted ? 'Đã nộp bài (Chờ chấm)' : 'Chưa nộp'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      Hạn: {new Date(asg.dueDate).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{asg.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{asg.description}</p>
                </div>

                <button
                  onClick={() => {
                    setSubmittingAsg(asg);
                    setContent(subm?.content || '');
                  }}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors shadow-xs ${
                    isSubmitted
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {isSubmitted ? 'Chỉnh sửa bài nộp' : 'Nộp bài ngay'}
                </button>
              </div>

              {/* Feedback if graded */}
              {isGraded && subm.feedback && (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Nhận xét của giáo viên:</span>
                  <p className="text-slate-700 dark:text-slate-300">{subm.feedback}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {submittingAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Nộp Bài Tập</h3>
              <button onClick={() => setSubmittingAsg(null)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{submittingAsg.title}</span>
                <p className="text-xs text-slate-500 mb-3">{submittingAsg.description}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nội dung bài làm / Link GitHub / Vercel</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Nhập link source code hoặc mô tả bài làm của bạn..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên file đính kèm (giả lập)</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="Ví dụ: SourceCode_MinhLH.zip"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAsg(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                  Xác Nhận Nộp Bài
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
