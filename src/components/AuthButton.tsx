"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (!session) {
    return <button onClick={() => signIn("discord")}>Login</button>;
  }

  return (
    <div>
      <span>{session.user?.name}</span>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}