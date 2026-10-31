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

const STORAGE_KEYS = {
  CURRENT_USER_ROLE: 'educore_current_role',
  CURRENT_USER_ID: 'educore_current_user_id',
  USERS: 'educore_users_v2',
  CLASSES: 'educore_classes_v2',
  SUBJECTS: 'educore_subjects_v2',
  LESSONS: 'educore_lessons_v2',
  ASSIGNMENTS: 'educore_assignments_v2',
  SUBMISSIONS: 'educore_submissions_v2',
  ANNOUNCEMENTS: 'educore_announcements_v2',
  PROGRESS: 'educore_progress_v2',
  GRADES: 'educore_grades_v2'
};

const INITIAL_USERS: User[] = [
  {
    id: 'u-teacher-1',
    name: 'TS. Nguyễn Văn Giáo',
    email: 'giaodv@educore.edu.vn',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    classIds: ['c-1', 'c-2']
  },
  {
    id: 'u-teacher-2',
    name: 'ThS. Trần Thị Mai',
    email: 'maitt@educore.edu.vn',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    classIds: ['c-1']
  },
  {
    id: 'u-student-1',
    name: 'Lê Hoàng Minh',
    email: 'minhlh.stu@educore.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    classIds: ['c-1', 'c-2']
  },
  {
    id: 'u-student-2',
    name: 'Phạm Thị Hương',
    email: 'huongpt.stu@educore.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    classIds: ['c-1']
  },
  {
    id: 'u-student-3',
    name: 'Đỗ Minh Quân',
    email: 'quandm.stu@educore.edu.vn',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    classIds: ['c-2']
  }
];

const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'c-1',
    name: 'Lập trình Web Nâng cao (React & Node.js) - K19',
    code: 'WEB301',
    description: 'Học phần chuyên sâu về React 19, TypeScript, Tailwind CSS, State Management và Full-stack architecture.',
    teacherId: 'u-teacher-1',
    teacherName: 'TS. Nguyễn Văn Giáo',
    subjectCount: 3,
    studentCount: 2,
    createdAt: '2026-02-01'
  },
  {
    id: 'c-2',
    name: 'Toán Cao Cấp A1 - Giải Tích',
    code: 'MAT101',
    description: 'Giới hạn, đạo hàm, tích phân và ứng dụng trong khoa học máy tính và kỹ thuật.',
    teacherId: 'u-teacher-2',
    teacherName: 'ThS. Trần Thị Mai',
    subjectCount: 2,
    studentCount: 2,
    createdAt: '2026-02-05'
  }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', classId: 'c-1', title: 'Chương 1: Kiến trúc React 19 & JSX Mới', description: 'Tìm hiểu Server Components, Hooks nâng cao và tối ưu render.', orderIndex: 1 },
  { id: 'sub-2', classId: 'c-1', title: 'Chương 2: TypeScript & Quản lý State', description: 'Kiểu dữ liệu nâng cao, Generic, Zod validation và Context API.', orderIndex: 2 },
  { id: 'sub-3', classId: 'c-1', title: 'Chương 3: Tailwind CSS & Design Systems', description: 'Xây dựng UI components chuyên nghiệp với Tailwind v4.', orderIndex: 3 },
  { id: 'sub-4', classId: 'c-2', title: 'Chương 1: Giới hạn và Hàm số', description: 'Các định nghĩa cơ bản và tính liên tục.', orderIndex: 1 },
  { id: 'sub-5', classId: 'c-2', title: 'Chương 2: Phép tính vi tích phân một biến', description: 'Đạo hàm và ứng dụng khảo sát hàm số.', orderIndex: 2 }
];

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'l-1',
    subjectId: 'sub-1',
    title: 'Bài 1.1: Tổng quan React 19 & Các tính năng mới',
    content: `# Giới thiệu React 19\n\nReact 19 mang đến những cải tiến mạnh mẽ về hiệu năng, Actions, useActionState, và các API bất đồng bộ trực quan hơn.\n\n### Nội dung chính:\n1. Server Components vs Client Components\n2. Hook useActionState và useFormStatus\n3. Tối ưu bundle size`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    attachments: [{ name: 'Slide_React19_Overview.pdf', url: '#' }],
    isPublished: true,
    orderIndex: 1,
    durationMinutes: 45
  },
  {
    id: 'l-2',
    subjectId: 'sub-1',
    title: 'Bài 1.2: Thực hành Component Lifecycle & Refs',
    content: `# Component Lifecycle trong React 19\n\nTìm hiểu cách cleanup effects, useRef tối ưu DOM access và useTransition cho trải nghiệm mượt mà.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    attachments: [{ name: 'Lab1_SourceCode.zip', url: '#' }],
    isPublished: true,
    orderIndex: 2,
    durationMinutes: 60
  },
  {
    id: 'l-3',
    subjectId: 'sub-2',
    title: 'Bài 2.1: TypeScript nâng cao trong React',
    content: `# Generic Components & Discriminated Unions\n\nCách định nghĩa props linh hoạt và an toàn tuyệt đối với TypeScript.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    attachments: [],
    isPublished: true,
    orderIndex: 1,
    durationMinutes: 50
  },
  {
    id: 'l-4',
    subjectId: 'sub-3',
    title: 'Bài 3.1: Tailwind CSS v4 & Styling Architecture',
    content: `# Tailwind v4 Configuration\n\nSử dụng @import "tailwindcss";, custom variables và thiết kế responsive hoàn hảo.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    attachments: [],
    isPublished: false,
    orderIndex: 1,
    durationMinutes: 40
  }
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    classId: 'c-1',
    title: 'Bài tập lớn 1: Xây dựng Dashboard Quản Lý Kho Hàng với React & Tailwind',
    description: 'Yêu cầu: Tạo giao diện Dashboard đầy đủ bảng dữ liệu, biểu đồ thống kê, form thêm sửa xóa sản phẩm có validation.',
    dueDate: '2026-11-15T23:59:00',
    maxScore: 10,
    rubric: [
      { id: 'r-1', title: 'Độ chính xác giao diện & Responsive', weight: 40, description: 'Chuẩn thiết kế Tailwind, không vỡ layout trên mobile/desktop.' },
      { id: 'r-2', title: 'Logic code & TypeScript types', weight: 40, description: 'Code sạch, không lỗi type, phân tách components hợp lý.' },
      { id: 'r-3', title: 'Tính năng mở rộng & Sáng tạo', weight: 20, description: 'Thêm hiệu ứng mượt mà hoặc tính năng phụ trợ hữu ích.' }
    ],
    isPublished: true,
    createdAt: '2026-10-01'
  },
  {
    id: 'asg-2',
    classId: 'c-1',
    title: 'Quiz trắc nghiệm kiến thức React 19',
    description: 'Trả lời 20 câu hỏi trắc nghiệm về các hooks mới và kiến trúc React 19.',
    dueDate: '2026-11-05T23:59:00',
    maxScore: 10,
    rubric: [
      { id: 'r-21', title: 'Điểm số trắc nghiệm đúng', weight: 100, description: 'Mỗi câu trả lời đúng tính 0.5 điểm.' }
    ],
    isPublished: true,
    createdAt: '2026-10-10'
  }
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'subm-1',
    assignmentId: 'asg-1',
    studentId: 'u-student-1',
    studentName: 'Lê Hoàng Minh',
    studentEmail: 'minhlh.stu@educore.edu.vn',
    content: 'Đã hoàn thành bài tập lớn tại GitHub: https://github.com/minhlh/warehouse-dashboard-react19',
    attachments: [{ name: 'SourceCode_MinhLH.zip', url: '#' }],
    submittedAt: '2026-10-25T14:30:00',
    status: 'graded',
    score: 9.5,
    rubricScores: { 'r-1': 3.8, 'r-2': 3.8, 'r-3': 1.9 },
    feedback: 'Bài làm rất xuất sắc, code sạch sẽ, phân chia component chuẩn chỉnh!',
    gradedAt: '2026-10-26T09:00:00'
  },
  {
    id: 'subm-2',
    assignmentId: 'asg-1',
    studentId: 'u-student-2',
    studentName: 'Phạm Thị Hương',
    studentEmail: 'huongpt.stu@educore.edu.vn',
    content: 'Em gửi bài tập quản lý kho hàng ạ. Link demo: https://warehouse-demo.vercel.app',
    attachments: [{ name: 'Report_HuongPT.pdf', url: '#' }],
    submittedAt: '2026-10-26T20:15:00',
    status: 'submitted'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    classId: 'c-1',
    title: 'Lịch nghỉ học tuần tới và hướng dẫn đồ án',
    content: 'Thầy cô thông báo lớp sẽ nghỉ buổi học thứ 4 tuần sau và học bù vào chủ nhật. Các nhóm chú ý tiến độ đồ án giữa kỳ.',
    authorName: 'TS. Nguyễn Văn Giáo',
    createdAt: '2026-10-28T08:00:00',
    isImportant: true
  },
  {
    id: 'ann-2',
    classId: 'c-1',
    title: 'Tài liệu tham khảo React 19 Official Docs',
    content: 'Các em xem trước tài liệu chính thức từ trang chủ React.dev để chuẩn bị cho bài kiểm tra sắp tới.',
    authorName: 'TS. Nguyễn Văn Giáo',
    createdAt: '2026-10-20T10:30:00',
    isImportant: false
  }
];

const INITIAL_PROGRESS: StudentProgress[] = [
  { id: 'prog-1', studentId: 'u-student-1', lessonId: 'l-1', status: 'completed', updatedAt: '2026-10-22' },
  { id: 'prog-2', studentId: 'u-student-1', lessonId: 'l-2', status: 'completed', updatedAt: '2026-10-23' },
  { id: 'prog-3', studentId: 'u-student-1', lessonId: 'l-3', status: 'in_progress', updatedAt: '2026-10-27' },
  { id: 'prog-4', studentId: 'u-student-2', lessonId: 'l-1', status: 'completed', updatedAt: '2026-10-24' }
];

const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'g-1',
    studentId: 'u-student-1',
    studentName: 'Lê Hoàng Minh',
    classId: 'c-1',
    assignmentId: 'asg-1',
    assignmentTitle: 'Bài tập lớn 1: Xây dựng Dashboard Quản Lý Kho Hàng với React & Tailwind',
    score: 9.5,
    maxScore: 10,
    feedback: 'Bài làm rất xuất sắc, code sạch sẽ!',
    gradedAt: '2026-10-26'
  }
];

function loadStorage<T>(key: string, initial: T): T {
  try {
    const val = localStorage.getItem(key);
    if (val) return JSON.parse(val);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export const mockProvider: DataProvider & { getGoogleSheetSchema(): { [sheetName: string]: string[] } } = {
  getCurrentUser(): User {
    const role = (localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) as UserRole) || 'admin';
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || (role === 'admin' ? 'u-teacher-1' : 'u-student-1');
    const users = loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const found = users.find(u => u.id === userId);
    if (found) return found;
    return users[0];
  },

  switchUserRole(role: UserRole, userId?: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, role);
    const users = loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      const target = users.find(u => u.role === role);
      if (target) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, target.id);
      }
    }
    window.location.reload();
  },

  getUsers(): User[] {
    return loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async getClasses(): Promise<ClassRoom[]> {
    return loadStorage<ClassRoom[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  },

  async getClass(id: string): Promise<ClassRoom | null> {
    const list = await this.getClasses();
    return list.find(c => c.id === id) || null;
  },

  async createClass(data: Omit<ClassRoom, 'id' | 'createdAt'>): Promise<ClassRoom> {
    const list = await this.getClasses();
    const newClass: ClassRoom = {
      ...data,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      subjectCount: 0,
      studentCount: 0
    };
    saveStorage(STORAGE_KEYS.CLASSES, [newClass, ...list]);
    return newClass;
  },

  async updateClass(id: string, data: Partial<ClassRoom>): Promise<ClassRoom> {
    let list = await this.getClasses();
    let updated: ClassRoom = list[0];
    list = list.map(c => {
      if (c.id === id) {
        updated = { ...c, ...data };
        return updated;
      }
      return c;
    });
    saveStorage(STORAGE_KEYS.CLASSES, list);
    return updated;
  },

  async deleteClass(id: string): Promise<void> {
    let list = await this.getClasses();
    list = list.filter(c => c.id !== id);
    saveStorage(STORAGE_KEYS.CLASSES, list);
  },

  async getStudents(): Promise<User[]> {
    const users = loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    return users.filter(u => u.role === 'student');
  },

  async addStudentToClass(classId: string, studentId: string): Promise<void> {
    const users = loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map(u => {
      if (u.id === studentId && !u.classIds.includes(classId)) {
        return { ...u, classIds: [...u.classIds, classId] };
      }
      return u;
    });
    saveStorage(STORAGE_KEYS.USERS, updated);
  },

  async removeStudentFromClass(classId: string, studentId: string): Promise<void> {
    const users = loadStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const updated = users.map(u => {
      if (u.id === studentId) {
        return { ...u, classIds: u.classIds.filter(id => id !== classId) };
      }
      return u;
    });
    saveStorage(STORAGE_KEYS.USERS, updated);
  },

  async getSubjects(classId: string): Promise<Subject[]> {
    const list = loadStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    return list.filter(s => s.classId === classId).sort((a, b) => a.orderIndex - b.orderIndex);
  },

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    const list = loadStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    const newSubject: Subject = { ...data, id: `sub-${Date.now()}` };
    saveStorage(STORAGE_KEYS.SUBJECTS, [...list, newSubject]);
    return newSubject;
  },

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    let list = loadStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    let updated = list[0];
    list = list.map(s => {
      if (s.id === id) {
        updated = { ...s, ...data };
        return updated;
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBJECTS, list);
    return updated;
  },

  async deleteSubject(id: string): Promise<void> {
    let list = loadStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    list = list.filter(s => s.id !== id);
    saveStorage(STORAGE_KEYS.SUBJECTS, list);
  },

  async getLessons(subjectId: string): Promise<Lesson[]> {
    const list = loadStorage<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    return list.filter(l => l.subjectId === subjectId).sort((a, b) => a.orderIndex - b.orderIndex);
  },

  async getLesson(lessonId: string): Promise<Lesson | null> {
    const list = loadStorage<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    return list.find(l => l.id === lessonId) || null;
  },

  async createLesson(data: Omit<Lesson, 'id'>): Promise<Lesson> {
    const list = loadStorage<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    const newLesson: Lesson = { ...data, id: `l-${Date.now()}` };
    saveStorage(STORAGE_KEYS.LESSONS, [...list, newLesson]);
    return newLesson;
  },

  async updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson> {
    let list = loadStorage<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    let updated = list[0];
    list = list.map(l => {
      if (l.id === id) {
        updated = { ...l, ...data };
        return updated;
      }
      return l;
    });
    saveStorage(STORAGE_KEYS.LESSONS, list);
    return updated;
  },

  async deleteLesson(id: string): Promise<void> {
    let list = loadStorage<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    list = list.filter(l => l.id !== id);
    saveStorage(STORAGE_KEYS.LESSONS, list);
  },

  async getAssignments(classId: string): Promise<Assignment[]> {
    const list = loadStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    return list.filter(a => a.classId === classId);
  },

  async getAssignment(assignmentId: string): Promise<Assignment | null> {
    const list = loadStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    return list.find(a => a.id === assignmentId) || null;
  },

  async createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
    const list = loadStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const newAssignment: Assignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    saveStorage(STORAGE_KEYS.ASSIGNMENTS, [newAssignment, ...list]);
    return newAssignment;
  },

  async updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment> {
    let list = loadStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    let updated = list[0];
    list = list.map(a => {
      if (a.id === id) {
        updated = { ...a, ...data };
        return updated;
      }
      return a;
    });
    saveStorage(STORAGE_KEYS.ASSIGNMENTS, list);
    return updated;
  },

  async deleteAssignment(id: string): Promise<void> {
    let list = loadStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    list = list.filter(a => a.id !== id);
    saveStorage(STORAGE_KEYS.ASSIGNMENTS, list);
  },

  async getSubmissions(assignmentId?: string, studentId?: string): Promise<Submission[]> {
    let list = loadStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    if (assignmentId) list = list.filter(s => s.assignmentId === assignmentId);
    if (studentId) list = list.filter(s => s.studentId === studentId);
    return list;
  },

  async submitAssignment(data: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Promise<Submission> {
    let list = loadStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    // Check if already submitted
    const existingIndex = list.findIndex(s => s.assignmentId === data.assignmentId && s.studentId === data.studentId);
    const newSubm: Submission = {
      ...data,
      id: existingIndex >= 0 ? list[existingIndex].id : `subm-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    if (existingIndex >= 0) {
      list[existingIndex] = newSubm;
    } else {
      list.unshift(newSubm);
    }
    saveStorage(STORAGE_KEYS.SUBMISSIONS, list);
    return newSubm;
  },

  async gradeSubmission(
    submissionId: string,
    score: number,
    rubricScores: { [criterionId: string]: number },
    feedback: string
  ): Promise<Submission> {
    let list = loadStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    let updated = list[0];
    list = list.map(s => {
      if (s.id === submissionId) {
        updated = {
          ...s,
          score,
          rubricScores,
          feedback,
          status: 'graded',
          gradedAt: new Date().toISOString()
        };
        return updated;
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, list);

    // Also update GradeRecords
    const grades = loadStorage<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
    const assignment = await this.getAssignment(updated.assignmentId);
    if (assignment) {
      const existingGradeIdx = grades.findIndex(g => g.studentId === updated.studentId && g.assignmentId === updated.assignmentId);
      const gradeRecord: GradeRecord = {
        id: existingGradeIdx >= 0 ? grades[existingGradeIdx].id : `g-${Date.now()}`,
        studentId: updated.studentId,
        studentName: updated.studentName,
        classId: assignment.classId,
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        score,
        maxScore: assignment.maxScore,
        feedback,
        gradedAt: new Date().toISOString().split('T')[0]
      };
      if (existingGradeIdx >= 0) {
        grades[existingGradeIdx] = gradeRecord;
      } else {
        grades.push(gradeRecord);
      }
      saveStorage(STORAGE_KEYS.GRADES, grades);
    }

    return updated;
  },

  async getAnnouncements(classId?: string): Promise<Announcement[]> {
    let list = loadStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (classId) list = list.filter(a => a.classId === classId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
    const list = loadStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    saveStorage(STORAGE_KEYS.ANNOUNCEMENTS, [newAnn, ...list]);
    return newAnn;
  },

  async getProgress(studentId: string): Promise<StudentProgress[]> {
    const list = loadStorage<StudentProgress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    return list.filter(p => p.studentId === studentId);
  },

  async updateProgress(studentId: string, lessonId: string, status: 'not_started' | 'in_progress' | 'completed'): Promise<StudentProgress> {
    let list = loadStorage<StudentProgress[]>(STORAGE_KEYS.PROGRESS, INITIAL_PROGRESS);
    const idx = list.findIndex(p => p.studentId === studentId && p.lessonId === lessonId);
    const updated: StudentProgress = {
      id: idx >= 0 ? list[idx].id : `prog-${Date.now()}`,
      studentId,
      lessonId,
      status,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    saveStorage(STORAGE_KEYS.PROGRESS, list);
    return updated;
  },

  async getGrades(studentId?: string, classId?: string): Promise<GradeRecord[]> {
    let list = loadStorage<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
    if (studentId) list = list.filter(g => g.studentId === studentId);
    if (classId) list = list.filter(g => g.classId === classId);
    return list;
  },

  async getSystemReports() {
    const students = await this.getStudents();
    const classes = await this.getClasses();
    const grades = loadStorage<GradeRecord[]>(STORAGE_KEYS.GRADES, INITIAL_GRADES);
    const submissions = loadStorage<Submission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const lessons = loadStorage<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);

    const totalScore = grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 10, 0);
    const averageScore = grades.length > 0 ? Number((totalScore / grades.length).toFixed(1)) : 8.2;
    const submissionRate = 88; // percentage

    return {
      totalStudents: students.length,
      totalClasses: classes.length,
      totalLessons: lessons.length,
      averageScore,
      submissionRate
    };
  },

  // Google Sheets Schema definition for future sheetProvider
  getGoogleSheetSchema() {
    return {
      'Classes': ['id', 'name', 'code', 'description', 'teacherId', 'teacherName', 'createdAt'],
      'Students': ['id', 'name', 'email', 'avatar', 'classIds'],
      'Subjects': ['id', 'classId', 'title', 'description', 'orderIndex'],
      'Lessons': ['id', 'subjectId', 'title', 'content', 'videoUrl', 'isPublished', 'orderIndex', 'durationMinutes'],
      'Assignments': ['id', 'classId', 'title', 'description', 'dueDate', 'maxScore', 'isPublished', 'createdAt'],
      'Submissions': ['id', 'assignmentId', 'studentId', 'studentName', 'content', 'submittedAt', 'status', 'score', 'feedback'],
      'Announcements': ['id', 'classId', 'title', 'content', 'authorName', 'createdAt', 'isImportant'],
      'Progress': ['id', 'studentId', 'lessonId', 'status', 'updatedAt'],
      'Grades': ['id', 'studentId', 'studentName', 'classId', 'assignmentId', 'score', 'maxScore', 'gradedAt']
    };
  }
};
