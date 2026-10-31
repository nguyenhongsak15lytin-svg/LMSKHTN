export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  classIds: string[];
}

export interface ClassRoom {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  teacherName: string;
  subjectCount?: number;
  studentCount?: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  classId: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  content: string;
  videoUrl?: string;
  attachments?: { name: string; url: string }[];
  isPublished: boolean;
  orderIndex: number;
  durationMinutes: number;
}

export interface RubricCriterion {
  id: string;
  title: string;
  weight: number; // percentage e.g. 30
  description: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  rubric: RubricCriterion[];
  isPublished: boolean;
  createdAt: string;
}

export type SubmissionStatus = 'submitted' | 'graded' | 'late' | 'missing';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  content: string;
  attachments?: { name: string; url: string }[];
  submittedAt: string;
  status: SubmissionStatus;
  score?: number;
  rubricScores?: { [criterionId: string]: number }; // points per criterion
  feedback?: string;
  gradedAt?: string;
}

export interface Announcement {
  id: string;
  classId: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  isImportant?: boolean;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  updatedAt: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  assignmentId: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  feedback?: string;
  gradedAt: string;
}

export interface DataProvider {
  // Current user & Auth
  getCurrentUser(): User;
  switchUserRole(role: UserRole, userId?: string): void;
  getUsers(): User[];

  // Classes
  getClasses(): Promise<ClassRoom[]>;
  getClass(id: string): Promise<ClassRoom | null>;
  createClass(data: Omit<ClassRoom, 'id' | 'createdAt'>): Promise<ClassRoom>;
  updateClass(id: string, data: Partial<ClassRoom>): Promise<ClassRoom>;
  deleteClass(id: string): Promise<void>;

  // Students & Class Members
  getStudents(): Promise<User[]>;
  addStudentToClass(classId: string, studentId: string): Promise<void>;
  removeStudentFromClass(classId: string, studentId: string): Promise<void>;

  // Subjects
  getSubjects(classId: string): Promise<Subject[]>;
  createSubject(data: Omit<Subject, 'id'>): Promise<Subject>;
  updateSubject(id: string, data: Partial<Subject>): Promise<Subject>;
  deleteSubject(id: string): Promise<void>;

  // Lessons
  getLessons(subjectId: string): Promise<Lesson[]>;
  getLesson(lessonId: string): Promise<Lesson | null>;
  createLesson(data: Omit<Lesson, 'id'>): Promise<Lesson>;
  updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;

  // Assignments
  getAssignments(classId: string): Promise<Assignment[]>;
  getAssignment(assignmentId: string): Promise<Assignment | null>;
  createAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment>;
  updateAssignment(id: string, data: Partial<Assignment>): Promise<Assignment>;
  deleteAssignment(id: string): Promise<void>;

  // Submissions
  getSubmissions(assignmentId?: string, studentId?: string): Promise<Submission[]>;
  submitAssignment(data: Omit<Submission, 'id' | 'submittedAt' | 'status'>): Promise<Submission>;
  gradeSubmission(submissionId: string, score: number, rubricScores: { [criterionId: string]: number }, feedback: string): Promise<Submission>;

  // Announcements
  getAnnouncements(classId?: string): Promise<Announcement[]>;
  createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement>;

  // Progress
  getProgress(studentId: string): Promise<StudentProgress[]>;
  updateProgress(studentId: string, lessonId: string, status: 'not_started' | 'in_progress' | 'completed'): Promise<StudentProgress>;

  // Grades & Report
  getGrades(studentId?: string, classId?: string): Promise<GradeRecord[]>;
  getSystemReports(): Promise<{
    totalStudents: number;
    totalClasses: number;
    totalLessons: number;
    averageScore: number;
    submissionRate: number;
  }>;
}
