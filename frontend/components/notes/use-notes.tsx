// components/notes/use-notes.ts
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const NOTES_PER_PAGE = 20;

export function useNotes() {
  const [allNotes, setAllNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUserId } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [currentUserId]);

  useEffect(() => {
    // Update displayed notes when page changes
    const startIndex = (currentPage - 1) * NOTES_PER_PAGE;
    const endIndex = startIndex + NOTES_PER_PAGE;
    setNotes(allNotes.slice(startIndex, endIndex));
  }, [currentPage, allNotes]);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      const notesWithStatus = res.data.map((note: any) => ({
        ...note,
        likeCount: note.Like?.length || 0,
        commentCount: note.Comment?.length || 0,
        isLiked: currentUserId
          ? note.Like?.some((like: any) => like.userId === currentUserId)
          : false,
      }));
      setAllNotes(notesWithStatus);
      setTotalPages(Math.ceil(notesWithStatus.length / NOTES_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleCardClick = (note: any) => {
    setSelectedNote(note);
    setIsDialogOpen(true);
  };

  const handleLike = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await api.post(`/likes/${noteId}`);

      setAllNotes((prevNotes: any) =>
        prevNotes.map((note: any) =>
          note.id === noteId
            ? {
                ...note,
                isLiked: result.data.liked,
                likeCount:
                  result.data.count ||
                  (result.data.liked ? note.likeCount + 1 : note.likeCount - 1),
              }
            : note
        )
      );

      if (selectedNote?.id === noteId) {
        setSelectedNote((prev: any) => ({
          ...prev,
          isLiked: result.data.liked,
          likeCount:
            result.data.count ||
            (result.data.liked ? prev.likeCount + 1 : prev.likeCount - 1),
        }));
      }
    } catch (error) {
      console.error("Like failed:", error);
      await fetchNotes();
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    notes,
    selectedNote,
    isDialogOpen,
    setIsDialogOpen,
    handleCardClick,
    handleLike,
    currentPage,
    totalPages,
    goToPage,
  };
}
