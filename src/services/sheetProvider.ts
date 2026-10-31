import {
  DataProvider,
  User,
  ClassRoom,
  Subject,
  Lesson,
  Assignment,
  Submission,
  Announcement,
  StudentProgress,
  GradeRecord,
  UserRole
} from '../types/lms';
import { mockProvider } from './mockProvider';

const SCRIPT_URL_KEY = 'educore_google_script_url';
const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxzjZuPAEvxD5btq2YkDS-9iNt3hw6KGlMH_VczG7VY_l4gxlMa5Cgoh2Mjh8tpSGr9/exec';

export function getScriptUrl(): string {
  return localStorage.getItem(SCRIPT_URL_KEY) || DEFAULT_WEB_APP_URL;
}

export function setScriptUrl(url: string) {
  localStorage.setItem(SCRIPT_URL_KEY, url);
}

// Google Sheets Data Provider implementation connecting to Apps Script Web App
export const sheetProvider: DataProvider & {
  testConnection(): Promise<{ ok: boolean; message?: string; error?: string }>;
  pushAllToSheet(): Promise<boolean>;
  pullAllFromSheet(): Promise<boolean>;
} = {
  getCurrentUser(): User {
    return mockProvider.getCurrentUser();
  },

  switchUserRole(role: UserRole, userId?: string) {
    mockProvider.switchUserRole(role, userId);
  },

  getUsers(): User[] {
    return mockProvider.getUsers();
  },

  async getClasses(): Promise<ClassRoom[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí lớp học'] && data['Quản lí lớp học'].length > 0) {
        return data['Quản lí lớp học'];
      }
    } catch (e) {
      console.warn('Fallback to mock provider due to network error:', e);
    }
    return mockProvider.getClasses();
  },

  async getClass(id: string): Promise<ClassRoom | null> {
    const list = await this.getClasses();
    return list.find(c => c.id === id) || null;
  },

  async createClass(data: Omit<ClassRoom, 'id' | 'createdAt'>): Promise<ClassRoom> {
    const newClass = await mockProvider.createClass(data);
    await this.pushAllToSheet().catch(console.error);
    return newClass;
  },

  async updateClass(id: string, data: Partial<ClassRoom>): Promise<ClassRoom> {
    const updated = await mockProvider.updateClass(id, data);
    await this.pushAllToSheet().catch(console.error);
    return updated;
  },

  async deleteClass(id: string): Promise<void> {
    await mockProvider.deleteClass(id);
    await this.pushAllToSheet().catch(console.error);
  },

  async getStudents(): Promise<User[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí học sinh'] && data['Quản lí học sinh'].length > 0) {
        return data['Quản lí học sinh'].map((u: any) => ({
          ...u,
          classIds: typeof u.classIdsJson === 'string' ? JSON.parse(u.classIdsJson || '[]') : (u.classIds || [])
        }));
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getStudents();
  },

  async addStudentToClass(classId: string, studentId: string): Promise<void> {
    await mockProvider.addStudentToClass(classId, studentId);
    await this.pushAllToSheet().catch(console.error);
  },

  async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
    await mockProvider.removeStudentFromClass(classId, studentId);
    await this.pushAllToSheet().catch(console.error);
  },

  async getSubjects(classId: string): Promise<Subject[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí môn học']) {
        return data['Quản lí môn học'].filter((s: any) => s.classId === classId);
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getSubjects(classId);
  },

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    const sub = await mockProvider.createSubject(data);
    await this.pushAllToSheet().catch(console.error);
    return sub;
  },

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    const sub = await mockProvider.updateSubject(id, data);
    await this.pushAllToSheet().catch(console.error);
    return sub;
  },

  async deleteSubject(id: string): Promise<void> {
    await mockProvider.deleteSubject(id);
    await this.pushAllToSheet().catch(console.error);
  },

  async getLessons(subjectId: string): Promise<Lesson[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí bài giảng']) {
        return data['Quản lí bài giảng']
          .filter((l: any) => l.subjectId === subjectId)
          .map((l: any) => ({
            ...l,
            isPublished: String(l.isPublished) === 'true' || l.isPublished === true,
            attachments: typeof l.attachmentsJson === 'string' ? JSON.parse(l.attachmentsJson || '[]') : (l.attachments || [])
          }));
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getLessons(subjectId);
  },

  async getLesson(lessonId: string): Promise<Lesson | null> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí bài giảng']) {
        const found = data['Quản lí bài giảng'].find((l: any) => l.id === lessonId);
        if (found) {
          return {
            ...found,
            isPublished: String(found.isPublished) === 'true' || found.isPublished === true,
            attachments: typeof found.attachmentsJson === 'string' ? JSON.parse(found.attachmentsJson || '[]') : (found.attachments || [])
          };
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getLesson(lessonId);
  },

  async createLesson(data: Omit<Lesson, 'id'>): Promise<Lesson> {
    const l = await mockProvider.createLesson(data);
    await this.pushAllToSheet().catch(console.error);
    return l;
  },

  async updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson> {
    const l = await mockProvider.updateLesson(id, data);
    await this.pushAllToSheet().catch(console.error);
    return l;
  },

  async deleteLesson(id: string): Promise<void> {
    await mockProvider.deleteLesson(id);
    await this.pushAllToSheet().catch(console.error);
  },

  async getAssignments(classId: string): Promise<Assignment[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí bài tập']) {
        return data['Quản lí bài tập']
          .filter((a: any) => a.classId === classId)
          .map((a: any) => ({
            ...a,
            isPublished: String(a.isPublished) === 'true' || a.isPublished === true,
            rubric: typeof a.rubricJson === 'string' ? JSON.parse(a.rubricJson || '[]') : (a.rubric || [])
          }));
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getAssignments(classId);
  },

  async getAssignment(assignmentId: string): Promise<Assignment | null> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí bài tập']) {
        const found = data['Quản lí bài tập'].find((a: any) => a.id === assignmentId);
        if (found) {
          return {
            ...found,
            isPublished: String(found.isPublished) === 'true' || found.isPublished === true,
            rubric: typeof found.rubricJson === 'string' ? JSON.parse(found.rubricJson || '[]') : (found.rubric || [])
          };
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getAssignment(assignmentId);
  },

  async createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    const a = await mockProvider.createAssignment(data);
    await this.pushAllToSheet().catch(console.error);
    return a;
  },

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
    const a = await mockProvider.updateAssignment(id, data);
    await this.pushAllToSheet().catch(console.error);
    return a;
  },

  async deleteAssignment(id: string): Promise<void> {
    await mockProvider.deleteAssignment(id);
    await this.pushAllToSheet().catch(console.error);
  },

  async getSubmissions(assignmentId?: string, studentId?: string): Promise<Submission[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí nộp bài']) {
        let list = data['Quản lí nộp bài'].map((s: any) => ({
          ...s,
          attachments: typeof s.attachmentsJson === 'string' ? JSON.parse(s.attachmentsJson || '[]') : (s.attachments || []),
          rubricScores: typeof s.rubricScoresJson === 'string' ? JSON.parse(s.rubricScoresJson || '{}') : (s.rubricScores || {})
        }));
        if (assignmentId) list = list.filter((s: any) => s.assignmentId === assignmentId);
        if (studentId) list = list.filter((s: any) => s.studentId === studentId);
        return list;
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getSubmissions(assignmentId, studentId);
  },

  async submitAssignment(data: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Promise<Submission> {
    const subm = await mockProvider.submitAssignment(data);
    await this.pushAllToSheet().catch(console.error);
    return subm;
  },

  async gradeSubmission(
    submissionId: string,
    score: number,
    rubricScores: { [criterionId: string]: number },
    feedback: string
  ): Promise<Submission> {
    const subm = await mockProvider.gradeSubmission(submissionId, score, rubricScores, feedback);
    await this.pushAllToSheet().catch(console.error);
    return subm;
  },

  async getAnnouncements(classId?: string): Promise<Announcement[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí thông báo']) {
        let list = data['Quản lí thông báo'].map((a: any) => ({
          ...a,
          isImportant: String(a.isImportant) === 'true' || a.isImportant === true
        }));
        if (classId) list = list.filter((a: any) => a.classId === classId);
        return list;
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getAnnouncements(classId);
  },

  async createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
    const ann = await mockProvider.createAnnouncement(data);
    await this.pushAllToSheet().catch(console.error);
    return ann;
  },

  async getProgress(studentId: string): Promise<StudentProgress[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Tiến độ học tập']) {
        return data['Tiến độ học tập'].filter((p: any) => p.studentId === studentId);
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getProgress(studentId);
  },

  async updateProgress(studentId: string, lessonId: string, status: 'not_started' | 'in_progress' | 'completed'): Promise<StudentProgress> {
    const prog = await mockProvider.updateProgress(studentId, lessonId, status);
    await this.pushAllToSheet().catch(console.error);
    return prog;
  },

  async getGrades(studentId?: string, classId?: string): Promise<GradeRecord[]> {
    try {
      const data = await callWebApp('getAllData');
      if (data && data['Quản lí điểm số']) {
        let list = data['Quản lí điểm số'];
        if (studentId) list = list.filter((g: any) => g.studentId === studentId);
        if (classId) list = list.filter((g: any) => g.classId === classId);
        return list;
      }
    } catch (e) {
      console.warn(e);
    }
    return mockProvider.getGrades(studentId, classId);
  },

  async getSystemReports() {
    return mockProvider.getSystemReports();
  },

  // Helper functions for Web App sync test
  async testConnection() {
    try {
      const url = getScriptUrl();
      const res = await fetch(url, { method: 'GET', redirect: 'follow' });
      const json = await res.json();
      if (json && json.ok) {
        return { ok: true, message: json.message || 'Kết nối Google Apps Script Web App thành công!' };
      }
      return { ok: false, error: 'Phản hồi từ Web App không hợp lệ.' };
    } catch (err: any) {
      return { ok: false, error: err.toString() };
    }
  },

  async pushAllToSheet() {
    const url = getScriptUrl();
    // Gather all local storage data mapped to sheet names
    const payload = {
      "Quản lí lớp học": JSON.parse(localStorage.getItem('educore_classes_v2') || '[]'),
      "Quản lí học sinh": JSON.parse(localStorage.getItem('educore_users_v2') || '[]').filter((u: any) => u.role === 'student').map((u: any) => ({
        ...u,
        classIdsJson: JSON.stringify(u.classIds || [])
      })),
      "Quản lí môn học": JSON.parse(localStorage.getItem('educore_subjects_v2') || '[]'),
      "Quản lí bài giảng": JSON.parse(localStorage.getItem('educore_lessons_v2') || '[]').map((l: any) => ({
        ...l,
        attachmentsJson: JSON.stringify(l.attachments || [])
      })),
      "Quản lí bài tập": JSON.parse(localStorage.getItem('educore_assignments_v2') || '[]').map((a: any) => ({
        ...a,
        rubricJson: JSON.stringify(a.rubric || [])
      })),
      "Quản lí nộp bài": JSON.parse(localStorage.getItem('educore_submissions_v2') || '[]').map((s: any) => ({
        ...s,
        attachmentsJson: JSON.stringify(s.attachments || []),
        rubricScoresJson: JSON.stringify(s.rubricScores || {})
      })),
      "Quản lí thông báo": JSON.parse(localStorage.getItem('educore_announcements_v2') || '[]'),
      "Tiến độ học tập": JSON.parse(localStorage.getItem('educore_progress_v2') || '[]'),
      "Quản lí điểm số": JSON.parse(localStorage.getItem('educore_grades_v2') || '[]')
    };

    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'syncAll', payload })
    });
    const json = await res.json();
    return json.ok;
  },

  async pullAllFromSheet() {
    try {
      const data = await callWebApp('getAllData');
      if (data) {
        if (data['Quản lí lớp học']) localStorage.setItem('educore_classes_v2', JSON.stringify(data['Quản lí lớp học']));
        if (data['Quản lí môn học']) localStorage.setItem('educore_subjects_v2', JSON.stringify(data['Quản lí môn học']));
        if (data['Quản lí bài giảng']) {
          const lessons = data['Quản lí bài giảng'].map((l: any) => ({
            ...l,
            isPublished: String(l.isPublished) === 'true' || l.isPublished === true,
            attachments: typeof l.attachmentsJson === 'string' ? JSON.parse(l.attachmentsJson || '[]') : []
          }));
          localStorage.setItem('educore_lessons_v2', JSON.stringify(lessons));
        }
        if (data['Quản lí bài tập']) {
          const asgs = data['Quản lí bài tập'].map((a: any) => ({
            ...a,
            isPublished: String(a.isPublished) === 'true' || a.isPublished === true,
            rubric: typeof a.rubricJson === 'string' ? JSON.parse(a.rubricJson || '[]') : []
          }));
          localStorage.setItem('educore_assignments_v2', JSON.stringify(asgs));
        }
        if (data['Quản lí nộp bài']) {
          const subs = data['Quản lí nộp bài'].map((s: any) => ({
            ...s,
            attachments: typeof s.attachmentsJson === 'string' ? JSON.parse(s.attachmentsJson || '[]') : [],
            rubricScores: typeof s.rubricScoresJson === 'string' ? JSON.parse(s.rubricScoresJson || '{}') : {}
          }));
          localStorage.setItem('educore_submissions_v2', JSON.stringify(subs));
        }
        if (data['Quản lí thông báo']) localStorage.setItem('educore_announcements_v2', JSON.stringify(data['Quản lí thông báo']));
        if (data['Tiến độ học tập']) localStorage.setItem('educore_progress_v2', JSON.stringify(data['Tiến độ học tập']));
        if (data['Quản lí điểm số']) localStorage.setItem('educore_grades_v2', JSON.stringify(data['Quản lí điểm số']));
        return true;
      }
    } catch (e) {
      console.error('Pull from sheet failed:', e);
    }
    return false;
  }
};

async function callWebApp(action: string, payload: any = {}) {
  const url = getScriptUrl();
  const res = await fetch(url, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  });
  const json = await res.json();
  if (json && json.ok) {
    return json.data;
  }
  throw new Error(json.error || 'Unknown Web App error');
}
