import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Quotes
        </Link>

        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost">로그인</Button>
          </Link>
          <Link href="/register">
            <Button>회원가입</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
