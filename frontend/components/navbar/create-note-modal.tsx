// components/create-note-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import api from "@/lib/api";

interface CreateNoteModalProps {
  onNoteCreated?: () => void;
}

export default function CreateNoteModal({
  onNoteCreated,
}: CreateNoteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/notes", noteData);
      setIsOpen(false);
      setNoteData({ title: "", content: "" });
      alert("글 작성 완료!");
      if (onNoteCreated) onNoteCreated();
    } catch (error) {
      alert("글 작성 실패");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>새 글 작성</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>새 글 작성</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-2 block">
              제목
            </Label>
            <Input
              id="title"
              value={noteData.title}
              onChange={(e) =>
                setNoteData({ ...noteData, title: e.target.value })
              }
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="content" className="mb-2 block">
              내용
            </Label>
            <textarea
              id="content"
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

          <Button type="submit" className="w-full">
            작성하기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
