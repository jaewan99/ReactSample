// components/notes/edit-note-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import api from "@/lib/api";

interface EditNoteModalProps {
  note: any | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteUpdated?: () => void;
}

export default function EditNoteModal({
  note,
  isOpen,
  onOpenChange,
  onNoteUpdated,
}: EditNoteModalProps) {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (note) {
      setNoteData({
        title: note.title || "",
        content: note.content || "",
      });
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    try {
      await api.put(`/notes/${note.id}`, noteData);
      onOpenChange(false);
      alert("글 수정 완료!");
      if (onNoteUpdated) onNoteUpdated();
    } catch (error) {
      alert("글 수정 실패");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>글 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title" className="mb-2 block">
              제목
            </Label>
            <Input
              id="edit-title"
              value={noteData.title}
              onChange={(e) =>
                setNoteData({ ...noteData, title: e.target.value })
              }
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-content" className="mb-2 block">
              내용
            </Label>
            <textarea
              id="edit-content"
              value={noteData.content}
              onChange={(e) =>
                setNoteData({ ...noteData, content: e.target.value })
              }
              placeholder="내용을 입력하세요"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[200px] max-h-[400px] overflow-y-auto"
              rows={10}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 400) + "px";
              }}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              수정하기
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
