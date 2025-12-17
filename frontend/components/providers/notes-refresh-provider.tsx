// components/providers/notes-refresh-provider.tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface NotesRefreshContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const NotesRefreshContext = createContext<NotesRefreshContextType | undefined>(
  undefined
);

export function NotesRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <NotesRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </NotesRefreshContext.Provider>
  );
}

export function useNotesRefresh() {
  const context = useContext(NotesRefreshContext);
  if (!context) {
    throw new Error(
      "useNotesRefresh must be used within NotesRefreshProvider"
    );
  }
  return context;
}
