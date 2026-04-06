import axios from 'axios';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    // Agar Android Emyulyatorda bo'lsa (Emulator)
    if (window.origin.includes('capacitor') || window.origin.includes('ionic') || window.origin.includes('http://localhost') && /android/i.test(navigator.userAgent)) {
       return 'http://10.0.2.2:3001/api'; // Android emulyatorining localhost IPv4 i
    }
    // Mahalliy tarmoq orqali kirilsa (Wi-Fi)
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }
  return 'http://localhost:3001/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
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
      if (currentPath !== '/login' && currentPath !== '/landing') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/landing';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
