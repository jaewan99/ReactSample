// components/notes/note-detail-dialog.tsx
"use client";

import {
  MessageCircle,
  Heart,
  Send,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface NoteDetailDialogProps {
  note: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLike?: (noteId: number, liked: boolean, count: number) => void;
  onCommentChange?: (noteId: number, commentCount: number) => void;
}

export default function NoteDetailDialog({
  note,
  isOpen,
  onOpenChange,
  onLike,
  onCommentChange,
}: NoteDetailDialogProps) {
  const { isLoggedIn, currentUserId, showLoginModal } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Update states when note changes or dialog opens
  useEffect(() => {
    if (note) {
      setIsLiked(note.isLiked || false);
      setLikeCount(note.likeCount || note.Like?.length || 0);
    }
    if (isOpen && note) {
      fetchComments();
    }
  }, [isOpen, note]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/note/${note.id}`);
      setComments(res.data);

      // Notify parent component about comment count change
      if (onCommentChange) {
        onCommentChange(note.id, res.data.length);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  if (!note) return null;

  const handleLike = async () => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    try {
      const result = await api.post(`/likes/${note.id}`);
      const newLikeCount = result.data.liked ? likeCount + 1 : likeCount - 1;
      setIsLiked(result.data.liked);
      setLikeCount(newLikeCount);

      // Notify parent component about the like change
      if (onLike) {
        onLike(note.id, result.data.liked, newLikeCount);
      }
    } catch (error) {
      console.error("Like failed:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }

    try {
      await api.post(`/comments/${note.id}`, { content: comment });
      await fetchComments();
      setComment("");
      // Reset textarea height
      const textarea = document.querySelector(
        'textarea[placeholder="Write a comment..."]'
      ) as HTMLTextAreaElement;
      if (textarea) textarea.style.height = "auto";
    } catch (error) {
      console.error("Comment failed:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      await fetchComments();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditContent(content);
  };

  const handleSaveEdit = async (commentId: number) => {
    try {
      await api.put(`/comments/${commentId}`, { content: editContent });
      await fetchComments();
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>

        <div
          className={`grid ${
            showComments ? "grid-cols-2" : "grid-cols-1"
          } gap-8 h-[65vh]`}
        >
          {/* Left Side - Note Content */}
          <div className="flex flex-col">
            <div className="flex-1 overflow-y-auto pr-4">
              <p className="text-gray-600">{note.content}</p>
            </div>

            {/* Author and Stats - Bottom of left side */}
            <div className="pt-4 border-t mt-4">
              <p className="text-sm text-gray-400 mb-3">by {note.User?.name}</p>
              <div className="flex gap-4">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 hover:text-red-500 transition cursor-pointer"
                >
                  <Heart
                    size={20}
                    className={isLiked ? "fill-red-500 text-red-500" : ""}
                  />
                  <span>{likeCount} likes</span>
                </button>

                <div
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-2 hover:text-gray-600 transition cursor-pointer"
                >
                  <MessageCircle size={20} />
                  <span>{comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Comments (conditionally rendered) */}
          {showComments && (
            <div className="border-l pl-8 flex flex-col">
              <h3 className="font-semibold mb-4">Comments</h3>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No comments yet. Be the first!
                  </p>
                ) : (
                  comments.map((c: any) => (
                    <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                      {editingCommentId === c.id ? (
                        // Edit mode
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full text-sm p-2 border rounded resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(c.id)}
                            >
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCommentId(null)}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm">{c.content}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              by {c.User?.name}
                            </p>
                          </div>

                          {/* Show menu only if logged in and owns the comment */}
                          {isLoggedIn && currentUserId === c.userId && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-600 p-1">
                                  <MoreVertical size={16} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEditComment(c.id, c.content)
                                  }
                                >
                                  <Edit size={14} className="mr-2" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteComment(c.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Comment Form - Only show if logged in */}
              {isLoggedIn ? (
                <form
                  onSubmit={handleSubmitComment}
                  className="flex gap-2 pt-4 border-t"
                >
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="resize-none min-h-[40px] max-h-[120px]"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height =
                        Math.min(target.scrollHeight, 120) + "px";
                    }}
                    required
                  />
                  <Button type="submit" size="icon" className="self-end">
                    <Send size={16} />
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-gray-400 pt-4 border-t text-center">
                  댓글을 작성하려면{" "}
                  <button
                    onClick={showLoginModal}
                    className="text-blue-500 underline hover:text-blue-600"
                  >
                    로그인
                  </button>
                  하세요
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
