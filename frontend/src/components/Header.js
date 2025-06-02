// src/components/Header.js
"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-6 px-0">
      <div className="w-full flex items-center">
        <Link href="/" className="text-xl font-bold ml-4">
          Aluno Online
        </Link>
      </div>
    </header>
  );
}
