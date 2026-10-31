import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, Assignment, RubricCriterion } from '../../types/lms';
import { Plus, Calendar, Award, Trash2, CheckCircle2, ListOrdered } from 'lucide-react';

export const AdminAssignments: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState(10);
  const [rubric, setRubric] = useState<RubricCriterion[]>([
    { id: 'r-1', title: 'Độ chính xác kỹ thuật', weight: 50, description: 'Đạt yêu cầu logic và xử lý.' },
    { id: 'r-2', title: 'Giao diện & Trải nghiệm', weight: 50, description: 'Thiết kế trực quan, mượt mà.' }
  ]);

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
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadAssignments(cid);
  };

  const handleAddRubricCriterion = () => {
    setRubric([
      ...rubric,
      { id: `r-${Date.now()}`, title: '', weight: 20, description: '' }
    ]);
  };

  const handleUpdateCriterion = (index: number, field: keyof RubricCriterion, val: any) => {
    const updated = [...rubric];
    updated[index] = { ...updated[index], [field]: val };
    setRubric(updated);
  };

  const handleRemoveCriterion = (index: number) => {
    setRubric(rubric.filter((_, i) => i !== index));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;
    await mockProvider.createAssignment({
      classId: selectedClassId,
      title,
      description,
      dueDate,
      maxScore: Number(maxScore),
      rubric,
      isPublished: true
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    setShowModal(false);
    loadAssignments(selectedClassId);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
      await mockProvider.deleteAssignment(id);
      loadAssignments(selectedClassId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Quản Lý Bài Tập & Rubric</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Giao bài tập, thiết lập hạn nộp và tiêu chí chấm điểm rubric.</p>
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
            Giao Bài Tập Mới
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map(asg => (
          <div key={asg.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    Thang điểm: {asg.maxScore}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    Hạn nộp: {new Date(asg.dueDate).toLocaleString('vi-VN')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{asg.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{asg.description}</p>
              </div>
              <button
                onClick={() => handleDelete(asg.id)}
                className="p-2.5 text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors self-start"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Rubric Breakdown */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Tiêu chí chấm điểm (Rubric):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {asg.rubric?.map(criterion => (
                  <div key={criterion.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{criterion.title}</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{criterion.weight}%</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{criterion.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 my-8">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Giao Bài Tập Mới</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tiêu đề bài tập</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Bài tập lớn 2: E-commerce Cart & Checkout"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hạn nộp (Due Date)</label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Thang điểm tối đa</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={e => setMaxScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mô tả & Yêu cầu bài tập</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mô tả chi tiết yêu cầu kỹ thuật và nộp bài..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Rubric Builder */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-500" />
                    Thiết lập Tiêu chí Rubric (Tổng trọng số = 100%)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRubricCriterion}
                    className="px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100"
                  >
                    + Thêm tiêu chí
                  </button>
                </div>

                {rubric.map((crit, idx) => (
                  <div key={crit.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="md:col-span-5">
                      <input
                        type="text"
                        placeholder="Tên tiêu chí (vd: Giao diện)"
                        value={crit.title}
                        onChange={e => handleUpdateCriterion(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="number"
                        placeholder="Trọng số %"
                        value={crit.weight}
                        onChange={e => handleUpdateCriterion(idx, 'weight', Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="Mô tả ngắn"
                        value={crit.description}
                        onChange={e => handleUpdateCriterion(idx, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveCriterion(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
                  Giao Bài Tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
