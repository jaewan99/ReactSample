// components/auth/global-login-modal.tsx
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
} from "../ui/dialog";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function GlobalLoginModal() {
  const [loginData, setLoginData] = useState({ name: "", password: "" });
  const { login, isLoginModalOpen, setIsLoginModalOpen } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login(loginData);
      login(response.accessToken);
      setIsLoginModalOpen(false);
      setLoginData({ name: "", password: "" }); // Reset form
      alert("로그인 성공!");
    } catch (error) {
      alert("로그인 실패");
      console.error(error);
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="login-name" className="mb-2 block">
              이름
            </Label>
            <Input
              id="login-name"
              value={loginData.name}
              onChange={(e) =>
                setLoginData({ ...loginData, name: e.target.value })
              }
              required
              minLength={2}
            />
          </div>
          <div>
            <Label htmlFor="login-password" className="mb-2 block">
              비밀번호
            </Label>
            <Input
              id="login-password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full">
            로그인
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
