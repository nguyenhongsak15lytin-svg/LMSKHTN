import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Assignment, Submission } from '../../types/lms';
import { FileText, CheckCircle2, Clock, Award, MessageSquare, Send, Check } from 'lucide-react';

export const AdminSubmissions: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Grading modal state
  const [gradingSubm, setGradingSubm] = useState<Submission | null>(null);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [rubricScores, setRubricScores] = useState<{ [id: string]: number }>({});
  const [feedback, setFeedback] = useState('');

  const loadClasses = async () => {
    const cList = await mockProvider.getClasses();
    setClasses(cList);
    if (cList.length > 0) {
      setSelectedClassId(cList[0].id);
      loadAssignments(cList[0].id);
    }
  };

  const loadAssignments = async (classId: string) => {
    const aList = await mockProvider.getAssignments(classId);
    setAssignments(aList);
    if (aList.length > 0) {
      setSelectedAssignmentId(aList[0].id);
      loadSubmissions(aList[0].id);
    } else {
      setSelectedAssignmentId('');
      setSubmissions([]);
    }
  };

  const loadSubmissions = async (assignmentId: string) => {
    const sList = await mockProvider.getSubmissions(assignmentId);
    setSubmissions(sList);
    const asg = await mockProvider.getAssignment(assignmentId);
    setCurrentAssignment(asg);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadAssignments(cid);
  };

  const handleAssignmentChange = (aid: string) => {
    setSelectedAssignmentId(aid);
    loadSubmissions(aid);
  };

  const handleOpenGrade = (subm: Submission) => {
    setGradingSubm(subm);
    setFeedback(subm.feedback || '');
    setRubricScores(subm.rubricScores || {});
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubm || !currentAssignment) return;

    // Calculate total score based on rubric weights
    let totalScore = 0;
    currentAssignment.rubric.forEach(crit => {
      const critScore = rubricScores[crit.id] || 0;
      totalScore += (critScore * crit.weight) / 100;
    });

    await mockProvider.gradeSubmission(
      gradingSubm.id,
      Number(totalScore.toFixed(1)),
      rubricScores,
      feedback
    );

    setGradingSubm(null);
    loadSubmissions(selectedAssignmentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Chấm Điểm & Nhận Xét Bài Nộp</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Xem danh sách bài làm của học sinh và chấm điểm theo tiêu chí Rubric.</p>
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
            value={selectedAssignmentId}
            onChange={e => handleAssignmentChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            {assignments.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <th className="p-4">Học viên</th>
              <th className="p-4">Thời gian nộp</th>
              <th className="p-4">Nội dung / Link bài nộp</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Điểm số</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {submissions.map(subm => (
              <tr key={subm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <span className="font-bold text-slate-900 dark:text-white block">{subm.studentName}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{subm.studentEmail}</span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">
                  {new Date(subm.submittedAt).toLocaleString('vi-VN')}
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-slate-700 dark:text-slate-300 truncate">{subm.content}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    subm.status === 'graded'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                  }`}>
                    {subm.status === 'graded' ? 'Đã chấm điểm' : 'Đã nộp bài'}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                  {subm.score !== undefined ? `${subm.score} / 10` : '—'}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleOpenGrade(subm)}
                    className="px-3.5 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
                  >
                    {subm.status === 'graded' ? 'Sửa điểm' : 'Chấm bài'}
                  </button>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Chưa có học viên nào nộp bài tập này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {gradingSubm && currentAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Chấm Bài: {gradingSubm.studentName}
                </h3>
                <p className="text-xs text-slate-500">{currentAssignment.title}</p>
              </div>
              <button onClick={() => setGradingSubm(null)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Nội dung học viên nộp:</span>
              <p className="text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {gradingSubm.content}
              </p>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-500" />
                  Chấm điểm theo tiêu chí Rubric:
                </span>
                <div className="space-y-3">
                  {currentAssignment.rubric.map(crit => (
                    <div key={crit.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">{crit.title}</span>
                        <span className="text-[11px] text-slate-500">Trọng số: {crit.weight}% — {crit.description}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.5}
                          value={rubricScores[crit.id] ?? 10}
                          onChange={e => setRubricScores({ ...rubricScores, [crit.id]: Number(e.target.value) })}
                          className="w-16 px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-mono font-bold"
                        />
                        <span className="text-xs text-slate-500">/ 10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nhận xét & Góp ý cho học viên</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Nhận xét chi tiết ưu điểm và điểm cần cải thiện..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubm(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20"
                >
                  Lưu & Gửi Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
