import { createContext, startTransition, useContext, useState } from "react";

import { getProfile, login as loginRequest, logout as logoutRequest } from "../services/authService";
import { loadSession } from "../utils/session";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());

  const value = {
    user: session?.user ?? null,
    access: session?.access ?? null,
    refresh: session?.refresh ?? null,
    isAuthenticated: Boolean(session?.access),
    async login(credentials) {
      const payload = await loginRequest(credentials);
      startTransition(() => {
        setSession(payload);
      });
      return payload;
    },
    async refreshProfile() {
      const profile = await getProfile();
      startTransition(() => {
        setSession((current) => (current ? { ...current, user: profile } : current));
      });
      return profile;
    },
    logout() {
      logoutRequest();
      startTransition(() => {
        setSession(null);
      });
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }
  return context;
}
