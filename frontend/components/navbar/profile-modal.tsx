// components/navbar/profile-modal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import api from "@/lib/api";

export default function ProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUser();
    }
  }, [isOpen]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const meResponse = await api.get("/auth/me");
      const userResponse = await api.get(`/users/${meResponse.data.id}`);
      setUser(userResponse.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-2 border-gray-700">
          프로필
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>프로필</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>로딩 중...</p>
        ) : user ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">이름</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
          </div>
        ) : (
          <p>사용자를 찾을 수 없습니다.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
