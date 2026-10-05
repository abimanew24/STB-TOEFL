import axios from 'axios';

// Base Axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Menyisipkan Token JWT & Header SEB
api.interceptors.request.use((config) => {
  let token = null;
  const pathname = window.location.pathname;

  if (pathname.startsWith('/proctor')) {
    token = localStorage.getItem('proctor_token');
  } else if (pathname.startsWith('/student')) {
    token = localStorage.getItem('student_token');
  } else {
    // Fallback if not specifically on a known route
    token = localStorage.getItem('student_token') || localStorage.getItem('proctor_token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Header SEB (dikirim hanya jika aplikasi berjalan di lingkungan SEB)
  const sebHash = localStorage.getItem('seb_hash');
  if (sebHash) {
    config.headers['X-SafeExamBrowser-ConfigKeyHash'] = sebHash;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Penanganan Error 401 & 403
api.interceptors.response.use((response) => response, (error) => {
  if (error.response) {
    if (error.response.status === 403 && error.response.data?.code === 'SEB_HEADER_MISSING') {
      if (window.location.pathname !== '/seb-forbidden') {
        window.location.href = '/seb-forbidden';
      }
    }
  }
  return Promise.reject(error);
});

export default api;
