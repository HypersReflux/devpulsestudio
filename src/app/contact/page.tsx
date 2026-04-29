"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function Contact() {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    details: "",
    plan: "basic",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 🔴 Require login
    if (!session) {
      signIn("discord");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      alert("✅ Order sent! Check your Discord.");
      setForm({ details: "", plan: "basic" });
    } else {
      alert("❌ Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="p-10 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold">Order a Bot</h1>

        {session && (
          <p className="text-green-400 mt-2">
            Logged in as {session.user?.name}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <select
            value={form.plan}
            onChange={(e) =>
              setForm({ ...form, plan: e.target.value })
            }
            className="p-3 bg-black border border-gray-700 rounded"
          >
            <option value="basic">Basic ($50)</option>
            <option value="advanced">Advanced ($100)</option>
            <option value="premium">Premium ($150)</option>
          </select>

          <textarea
            value={form.details}
            onChange={(e) =>
              setForm({ ...form, details: e.target.value })
            }
            placeholder="Describe what you need"
            className="p-3 bg-black border border-gray-700 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 py-3 rounded-xl hover:bg-red-700 transition"
          >
            {loading ? "Sending..." : "Submit Request"}
          </button>
        </form>
      </main>
    </>
  );
}