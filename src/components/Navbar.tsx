"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
      <h1 className="text-xl font-bold text-red-500">DevPulseStudio</h1>

      <div className="flex gap-6 items-center">
        <Link href="/">Home</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/games">Game</Link>

        {!session ? (
          <button
            onClick={() => signIn("discord")}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut()}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}