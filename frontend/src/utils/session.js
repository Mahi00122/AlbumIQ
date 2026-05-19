const SESSION_STORAGE_KEY = "ai_wedding_photo_finder_session";
const LEGACY_ADMIN_SESSION_KEY = "wedding-ai-admin-session";
const SELECTED_ADMIN_EVENT_KEY = "wedding-ai-selected-admin-event-id";


export function loadSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}


export function saveSession(session) {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}


export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
  window.localStorage.removeItem(SELECTED_ADMIN_EVENT_KEY);
}
