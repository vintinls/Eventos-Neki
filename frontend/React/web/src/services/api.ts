import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  } else if (config.headers && 'Authorization' in config.headers) {
    delete config.headers['Authorization'];
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err?.response?.status;
    const url = (err?.config?.url || '') as string;

    const isAuthRequest = url.startsWith('/auth');
    const isImageRequest = url.includes('/eventos/') && url.includes('/imagem');

    if (isImageRequest) {
      return Promise.reject(err);
    }

    if ((status === 401 || status === 403) && !isAuthRequest) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('admin');
      sessionStorage.removeItem('admin');

      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    return Promise.reject(err);
  }
);

export default api;
