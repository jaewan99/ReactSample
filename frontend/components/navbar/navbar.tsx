// components/navbar.tsx
"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";
import CreateNoteModal from "./create-note-modal";
import ProfileModal from "./profile-modal";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Quotes
        </Link>

        <div className="flex gap-3">
          {isLoggedIn ? (
            <>
              <CreateNoteModal />
              <ProfileModal />
              <Button variant="ghost" onClick={logout}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <LoginModal />
              <RegisterModal />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
