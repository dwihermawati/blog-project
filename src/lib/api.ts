import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isSessionExpiredHandled = false;
let isTimeoutHandled = false;

// ✅ Handling error 401 (expired token)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      !window.location.pathname.includes('/login') &&
      !isSessionExpiredHandled
    ) {
      isSessionExpiredHandled = true;
      console.warn('Unauthorized! Auto logging out...');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('userAvatarUrl');

      toast.error('Session expired. Please log in again.');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }

    // ✅ Handling error timeout (ECONNABORTED)
    if (error.code === 'ECONNABORTED' && !isTimeoutHandled) {
      isTimeoutHandled = true;
      toast.error(
        'Request timed out. Please check your connection or try again.'
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
