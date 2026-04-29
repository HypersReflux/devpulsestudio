"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Login</h1>

      

<button onClick={() => signIn("discord")}>
  Login with Discord
</button>
    </div>
  );
}