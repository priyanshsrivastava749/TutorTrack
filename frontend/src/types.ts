export type Role = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  uniqueId?: string; // For students to be identified by teachers
  uniqueId?: string; // For students to be identified by teachers
  teacherIds?: string[]; // If student is linked to teachers
  resourcesLink?: string; // Notion link specific to this student
  submissionFolderLink?: string; // Default Google Drive folder for this student's submissions
  resourceUploadLink?: string; // Folder where student uploads resource requests
}

export interface Assignment {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  chapter: string;
  instructionLink: string; // GDrive link for the assignment task
  submissionLink: string; // GDrive folder to upload to or student submission link
  studentWorkLink?: string; // The actual link submitted by the student
  checkedLink?: string; // Teacher's corrected copy link
  dueDate: string;
  status: 'pending' | 'submitted';
  assignedDate: string;
  submittedDate?: string;
}

export interface ResourceQuery {
  id: string;
  studentId: string;
  teacherId: string;
  subject: string;
  topic: string;
  fileLink: string;
  status: 'pending' | 'resolved';
  date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
