// lib/notes-context.tsx
"use client";

import { createContext, useContext } from "react";

interface NotesContextType {
  refreshNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({
  children,
  refreshNotes,
}: {
  children: React.ReactNode;
  refreshNotes: () => void;
}) {
  return (
    <NotesContext.Provider value={{ refreshNotes }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotesContext must be used within NotesProvider");
  }
  return context;
}
