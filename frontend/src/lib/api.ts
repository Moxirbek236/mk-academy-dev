import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — har bir so'rovga avtomatik token qo'shadi
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — HECH QANDAY o'zgartirmasdan qaytaradi
// Har bir sahifa o'zi res.data dan foydalanadi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar token muddati tugagan bo'lsa — avtomatik logout
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/landing') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/landing';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
