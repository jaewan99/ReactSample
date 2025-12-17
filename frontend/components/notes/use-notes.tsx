// components/notes/use-notes.ts
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useNotesRefresh } from "@/components/providers/notes-refresh-provider";

const NOTES_PER_PAGE = 20;

export function useNotes() {
  const [allNotes, setAllNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUserId, isLoggedIn, showLoginModal } = useAuth();
  const { refreshTrigger, triggerRefresh } = useNotesRefresh();

  useEffect(() => {
    fetchNotes();
  }, [currentUserId, refreshTrigger]);

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

    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

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

  const handleLikeFromDialog = (
    noteId: number,
    liked: boolean,
    count: number
  ) => {
    // Update notes list
    setAllNotes((prevNotes: any) =>
      prevNotes.map((note: any) =>
        note.id === noteId
          ? {
              ...note,
              isLiked: liked,
              likeCount: count,
            }
          : note
      )
    );

    // Update selected note
    if (selectedNote?.id === noteId) {
      setSelectedNote((prev: any) => ({
        ...prev,
        isLiked: liked,
        likeCount: count,
      }));
    }
  };

  const handleCommentChangeFromDialog = (
    noteId: number,
    commentCount: number
  ) => {
    // Update notes list
    setAllNotes((prevNotes: any) =>
      prevNotes.map((note: any) =>
        note.id === noteId
          ? {
              ...note,
              commentCount,
            }
          : note
      )
    );

    // Update selected note
    if (selectedNote?.id === noteId) {
      setSelectedNote((prev: any) => ({
        ...prev,
        commentCount,
      }));
    }
  };

  const handleEdit = (note: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (noteId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("정말 이 글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/notes/${noteId}`);
      triggerRefresh();
      alert("글이 삭제되었습니다.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("글 삭제에 실패했습니다.");
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
    editingNote,
    isEditModalOpen,
    setIsEditModalOpen,
    handleCardClick,
    handleLike,
    handleLikeFromDialog,
    handleCommentChangeFromDialog,
    handleEdit,
    handleDelete,
    currentPage,
    totalPages,
    goToPage,
  };
}
