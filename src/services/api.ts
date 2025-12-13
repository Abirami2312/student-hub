import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student types
export interface Student {
  _id: string;
  name: string;
  rollNumber: string;
  department: string;
  year: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentInput {
  name: string;
  rollNumber: string;
  department: string;
  year: string;
}

// Attendance types
export interface Attendance {
  _id: string;
  studentId: string | Student;
  date: string;
  status: 'present' | 'absent';
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceInput {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
}

// Student API calls
export const studentApi = {
  getAll: () => api.get<Student[]>('/students'),
  getById: (id: string) => api.get<Student>(`/students/${id}`),
  create: (data: StudentInput) => api.post<Student>('/students', data),
  update: (id: string, data: StudentInput) => api.put<Student>(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

// Attendance API calls
export const attendanceApi = {
  getAll: () => api.get<Attendance[]>('/attendance'),
  getById: (id: string) => api.get<Attendance>(`/attendance/${id}`),
  getByStudent: (studentId: string) => api.get<Attendance[]>(`/attendance/student/${studentId}`),
  create: (data: AttendanceInput) => api.post<Attendance>('/attendance', data),
  update: (id: string, data: Partial<AttendanceInput>) => api.put<Attendance>(`/attendance/${id}`, data),
  delete: (id: string) => api.delete(`/attendance/${id}`),
};

export default api;
