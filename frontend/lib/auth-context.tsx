// lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

interface AuthContextType {
  isLoggedIn: boolean;
  currentUserId: number | null;
  setIsLoggedIn: (value: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
  showLoginModal: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setCurrentUserId(res.data.id);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    fetchCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUserId(null);
  };

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        currentUserId,
        setIsLoggedIn,
        login,
        logout,
        showLoginModal,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
