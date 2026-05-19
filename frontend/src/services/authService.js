import api from "./api";
import { clearSession, saveSession } from "../utils/session";


export async function login(credentials) {
  clearSession();
  const { data } = await api.post("/auth/login/", credentials, {
    skipAuth: true
  });
  saveSession(data);
  return data;
}


export async function registerPhotographer(payload) {
  clearSession();
  const { data } = await api.post("/auth/register/", payload, {
    skipAuth: true
  });
  saveSession(data);
  return data;
}


export async function getProfile() {
  const { data } = await api.get("/auth/me/");
  return data;
}


export async function updateProfile(payload) {
  const { data } = await api.patch("/auth/me/", payload);
  const currentSession = JSON.parse(window.localStorage.getItem("ai_wedding_photo_finder_session") || "null");
  if (currentSession) {
    const nextSession = { ...currentSession, user: data };
    saveSession(nextSession);
  }
  return data;
}


export async function requestPasswordReset(payload) {
  const { data } = await api.post("/auth/forgot-password/", payload, {
    skipAuth: true
  });
  return data;
}


export async function resetPassword(payload) {
  const { data } = await api.post("/auth/reset-password/", payload, {
    skipAuth: true
  });
  return data;
}


export function logout() {
  clearSession();
}
