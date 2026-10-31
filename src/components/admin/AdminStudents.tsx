import React, { useEffect, useState } from 'react';
import { mockProvider } from '../../services/mockProvider';
import { User, ClassRoom } from '../../types/lms';
import { Users, Mail, BookMarked, UserPlus, Trash2 } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const loadData = async () => {
    const sList = await mockProvider.getStudents();
    const cList = await mockProvider.getClasses();
    setStudents(sList);
    setClasses(cList);
    if (cList.length > 0 && !selectedClassId) {
      setSelectedClassId(cList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleEnroll = async (studentId: string, isEnrolled: boolean) => {
    if (!selectedClassId) return;
    if (isEnrolled) {
      await mockProvider.removeStudentFromClass(selectedClassId, studentId);
    } else {
      await mockProvider.addStudentToClass(selectedClassId, studentId);
    }
    loadData();
  };

  const filteredStudents = students;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Quản Lý Học Viên</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Danh sách học viên và quản lý phân bổ lớp học.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chọn lớp:</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <th className="p-4">Học viên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Lớp đang tham gia</th>
              <th className="p-4 text-right">Trạng thái trong lớp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {filteredStudents.map(student => {
              const isEnrolled = student.classIds.includes(selectedClassId);
              return (
                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-full object-cover" />
                    <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-mono">{student.email}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {student.classIds.map(cid => {
                        const cl = classes.find(c => c.id === cid);
                        return (
                          <span key={cid} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                            {cl ? cl.code : cid}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleEnroll(student.id, isEnrolled)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        isEnrolled
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {isEnrolled ? 'Rời lớp' : 'Thêm vào lớp'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
