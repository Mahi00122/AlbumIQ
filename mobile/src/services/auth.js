import { api } from '../lib/api';
import { clearSession, saveSession } from '../lib/session';

export async function login(credentials) {
  await clearSession();
  const { data } = await api.post('/auth/login/', credentials, { skipAuth: true });
  await saveSession(data);
  return data;
}

export async function registerPhotographer(payload) {
  await clearSession();
  const { data } = await api.post('/auth/register/', payload, { skipAuth: true });
  await saveSession(data);
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/auth/me/');
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch('/auth/me/', payload);
  const currentSession = await loadSession();
  if (currentSession) {
    await saveSession({ ...currentSession, user: data });
  }
  return data;
}

async function loadSession() {
  const module = await import('../lib/session');
  return module.loadSession();
}

export async function requestPasswordReset(payload) {
  const { data } = await api.post('/auth/forgot-password/', payload, { skipAuth: true });
  return data;
}

export async function resetPassword(payload) {
  const { data } = await api.post('/auth/reset-password/', payload, { skipAuth: true });
  return data;
}

export async function logout() {
  await clearSession();
}
