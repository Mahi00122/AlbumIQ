import axios from 'axios';

import { API_BASE_URL } from '../config';
import { clearSession, loadSession } from './session';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  if (config.skipAuth) {
    return config;
  }

  const session = await loadSession();
  if (session?.access) {
    config.headers.Authorization = `Bearer ${session.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const detail = String(error?.response?.data?.detail || '');
    if (
      !error?.config?.skipAuth &&
      (status === 401 || detail.toLowerCase().includes('token'))
    ) {
      await clearSession();
    }
    return Promise.reject(error);
  }
);
