import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { ClassRoom, User, Assignment, GradeRecord } from '../../types/lms';
import { Table, Award, Download, Search } from 'lucide-react';

export const AdminGradebook: React.FC = () => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [students, setStudents] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  const loadData = async () => {
    const cList = await mockProvider.getClasses();
    const sList = await mockProvider.getStudents();
    setClasses(cList);
    setStudents(sList);
    if (cList.length > 0) {
      setSelectedClassId(cList[0].id);
      loadClassData(cList[0].id);
    }
  };

  const loadClassData = async (classId: string) => {
    const aList = await mockProvider.getAssignments(classId);
    const gList = await mockProvider.getGrades(undefined, classId);
    setAssignments(aList);
    setGrades(gList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClassChange = (cid: string) => {
    setSelectedClassId(cid);
    loadClassData(cid);
  };

  const classStudents = students.filter(s => s.classIds.includes(selectedClassId));

  const handleExportCSV = () => {
    let csv = "StudentName,Email," + assignments.map(a => `"${a.title}"`).join(',') + "\n";
    classStudents.forEach(stu => {
      let row = `"${stu.name}","${stu.email}",`;
      row += assignments.map(a => {
        const g = grades.find(x => x.studentId === stu.id && x.assignmentId === a.id);
        return g ? g.score : '';
      }).join(',');
      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'EduCore_Gradebook.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Bảng Điểm Tổng Hợp (Gradebook)</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Theo dõi toàn bộ kết quả học tập và điểm số của học viên trong lớp.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClassId}
            onChange={e => handleClassChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-xl hover:bg-emerald-100 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Xuất Bảng Điểm CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <th className="p-4">Học viên</th>
              {assignments.map(a => (
                <th key={a.id} className="p-4 max-w-[200px] truncate">{a.title}</th>
              ))}
              <th className="p-4 text-center">Điểm trung bình</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {classStudents.map(stu => {
              const stuGrades = grades.filter(g => g.studentId === stu.id);
              const totalScore = stuGrades.reduce((acc, g) => acc + g.score, 0);
              const avg = stuGrades.length > 0 ? (totalScore / stuGrades.length).toFixed(1) : '—';

              return (
                <tr key={stu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={stu.avatar} alt={stu.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{stu.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{stu.email}</span>
                    </div>
                  </td>
                  {assignments.map(a => {
                    const g = grades.find(x => x.studentId === stu.id && x.assignmentId === a.id);
                    return (
                      <td key={a.id} className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {g ? `${g.score} / ${g.maxScore}` : <span className="text-slate-300 dark:text-slate-600">Chưa có</span>}
                      </td>
                    );
                  })}
                  <td className="p-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {avg !== '—' ? `${avg} / 10` : '—'}
                  </td>
                </tr>
              );
            })}
            {classStudents.length === 0 && (
              <tr>
                <td colSpan={assignments.length + 2} className="p-8 text-center text-slate-500">
                  Chưa có học viên nào trong lớp này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
