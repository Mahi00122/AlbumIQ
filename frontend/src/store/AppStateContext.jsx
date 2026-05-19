import { createContext, useContext, useEffect, useState } from "react";

import { clearSession, loadSession } from "../utils/session";

const AppStateContext = createContext(null);

const defaultGuestFlow = {
  eventCode: "",
  event: null,
  selfieName: "",
  selfiePreview: "",
  matches: [],
  matchedCount: 0,
  searchId: "",
  searchError: ""
};

const defaultAdminSession = {
  isLoggedIn: false,
  name: "Studio Admin",
  user: null
};

export function AppStateProvider({ children }) {
  const [guestFlow, setGuestFlow] = useState(() => {
    const saved = window.localStorage.getItem("wedding-ai-guest-flow");
    return saved ? JSON.parse(saved) : defaultGuestFlow;
  });
  const [guestSelfieFile, setGuestSelfieFile] = useState(null);

  const [adminSession, setAdminSession] = useState(() => {
    const savedSession = loadSession();
    if (savedSession?.access && savedSession?.user) {
      return {
        isLoggedIn: true,
        name:
          savedSession.user.full_name ||
          savedSession.user.username ||
          savedSession.user.email ||
          "Studio Admin",
        user: savedSession.user
      };
    }
    return defaultAdminSession;
  });

  const [selectedAdminEventId, setSelectedAdminEventId] = useState(() => {
    return window.localStorage.getItem("wedding-ai-selected-admin-event-id") || "";
  });

  useEffect(() => {
    window.localStorage.setItem("wedding-ai-guest-flow", JSON.stringify(guestFlow));
  }, [guestFlow]);

  useEffect(() => {
    window.localStorage.setItem("wedding-ai-admin-session", JSON.stringify(adminSession));
  }, [adminSession]);

  useEffect(() => {
    if (selectedAdminEventId) {
      window.localStorage.setItem("wedding-ai-selected-admin-event-id", selectedAdminEventId);
      return;
    }

    window.localStorage.removeItem("wedding-ai-selected-admin-event-id");
  }, [selectedAdminEventId]);

  const value = {
    guestFlow,
    guestSelfieFile,
    adminSession,
    selectedAdminEventId,
    setGuestEvent({ eventCode, event }) {
      setGuestFlow((current) => ({
        ...current,
        eventCode,
        event,
        matches: [],
        matchedCount: 0,
        searchId: "",
        searchError: ""
      }));
    },
    setGuestEventCode(eventCode) {
      setGuestFlow((current) => ({ ...current, eventCode }));
    },
    setGuestSelfie({ selfieName, selfiePreview, selfieFile }) {
      setGuestSelfieFile(selfieFile || null);
      setGuestFlow((current) => ({
        ...current,
        selfieName,
        selfiePreview,
        matches: [],
        matchedCount: 0,
        searchId: "",
        searchError: ""
      }));
    },
    setGuestResults({ matches, matchedCount, searchId, searchError = "" }) {
      setGuestFlow((current) => ({
        ...current,
        matches,
        matchedCount,
        searchId,
        searchError
      }));
    },
    clearGuestFlow() {
      setGuestSelfieFile(null);
      setGuestFlow(defaultGuestFlow);
    },
    loginAdmin(payload) {
      const user = payload?.user || payload || null;
      setAdminSession({
        isLoggedIn: true,
        name: user?.full_name || user?.username || user?.email || "Studio Admin",
        user
      });
    },
    updateAdminProfile(user) {
      setAdminSession((current) => ({
        ...current,
        name: user?.full_name || user?.username || user?.email || "Studio Admin",
        user
      }));
    },
    logoutAdmin() {
      clearSession();
      setAdminSession(defaultAdminSession);
      setSelectedAdminEventId("");
    },
    setSelectedAdminEventId
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return context;
}
