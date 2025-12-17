// components/notes/note-card.tsx
"use client";

import { MessageCircle, Heart } from "lucide-react";

interface NoteCardProps {
  note: any;
  onCardClick: (note: any) => void;
  onLike: (noteId: number, e: React.MouseEvent) => void;
}

export default function NoteCard({ note, onCardClick, onLike }: NoteCardProps) {
  const getSize = (note: any) => {
    const titleLength = note.title.length;
    const contentLength = note.content.length;
    const totalLength = titleLength + contentLength;

    if (totalLength < 50) return "col-span-1 row-span-1";

    if (totalLength < 150) {
      return note.id % 2 === 0
        ? "col-span-2 row-span-1"
        : "col-span-1 row-span-2";
    }

    if (totalLength < 300) return "col-span-2 row-span-2";

    return "col-span-2 row-span-2";
  };

  return (
    <div
      key={note.id}
      onClick={() => onCardClick(note)}
      className={`${getSize(
        note
      )} border rounded-lg p-4 hover:shadow-lg transition bg-white overflow-hidden flex flex-col cursor-pointer`}
    >
      <h2 className="font-bold mb-2">{note.title}</h2>
      <p className="text-gray-600 text-sm flex-1">{note.content}</p>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-400">by {note.User?.name}</p>
        <div className="flex gap-3 items-center">
          <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <MessageCircle size={16} />
            <span className="text-xs">{note.commentCount || 0}</span>
          </button>
          <button
            onClick={(e) => onLike(note.id, e)}
            className="text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
          >
            <Heart
              size={16}
              className={note.isLiked ? "fill-red-500 text-red-500" : ""}
            />
            <span className="text-xs">{note.likeCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
