import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000',

  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('muttiflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.muttiflowRouteAtRequest = window.location.pathname;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUnauthorized = error.response?.status === 401;
    const isAuthRequest = error.config?.url?.startsWith('/auth/');
    const responseBelongsToCurrentPage =
      !error.config?.muttiflowRouteAtRequest ||
      error.config.muttiflowRouteAtRequest === window.location.pathname;

    if (isUnauthorized && !isAuthRequest && responseBelongsToCurrentPage) {
      localStorage.removeItem('muttiflow_token');
      localStorage.removeItem('muttiflow_usuario');
      window.location.assign('/');
    }
    return Promise.reject(error);
  },
);

export default api;
