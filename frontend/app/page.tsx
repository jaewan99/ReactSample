// app/page.tsx
"use client";

import NoteCard from "@/components/notes/note-cards";
import NoteDetailDialog from "@/components/notes/note-detail-dialog";
import { useNotes } from "@/components/notes/use-notes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const {
    notes,
    selectedNote,
    isDialogOpen,
    setIsDialogOpen,
    handleCardClick,
    handleLike,
    currentPage,
    totalPages,
    goToPage,
  } = useNotes();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-4 auto-rows-[150px] gap-4 grid-flow-dense">
          {notes.map((note: any) => (
            <NoteCard
              key={note.id}
              note={note}
              onCardClick={handleCardClick}
              onLike={handleLike}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </Button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>

      <NoteDetailDialog
        note={selectedNote}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
