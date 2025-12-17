// components/navbar/register-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.register(registerData);
      login(response.accessToken);
      setIsOpen(false);
      alert("회원가입 성공!");
    } catch (error) {
      alert("회원가입 실패");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>회원가입</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>회원가입</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="register-name">이름</Label>
              <span className="text-xs text-gray-400">최소 2자</span>
            </div>
            <Input
              id="register-name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
              minLength={2}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="register-email">이메일</Label>
              <span className="text-xs text-gray-400">필수</span>
            </div>
            <Input
              id="register-email"
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="register-password">비밀번호</Label>
              <span className="text-xs text-gray-400">최소 6자</span>
            </div>
            <Input
              id="register-password"
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full">
            회원가입
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
