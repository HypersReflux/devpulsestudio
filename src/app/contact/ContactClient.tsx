"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function ContactClient() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();

  const initialPlan =
    searchParams.get("plan") || "basic";

  const [form, setForm] = useState({
    email: "",
    details: "",
    plan: initialPlan,
  });

  const [loading, setLoading] = useState(false);

  // =========================
  // Sync URL Plan
  // =========================

  useEffect(() => {
    const planFromUrl = searchParams.get("plan");

    if (planFromUrl) {
      setForm((prev) => ({
        ...prev,
        plan: planFromUrl,
      }));
    }
  }, [searchParams]);

  // =========================
  // Submit
  // =========================

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

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      alert(
        data.message ||
        "Order submitted successfully! Your invoice has been emailed."
      );

      setForm({
        email: "",
        details: "",
        plan: initialPlan,
      });

    } else {
      alert(data.error || "Something went wrong.");
      console.error(data);
    }
  };

  return (
    <>
      <Navbar />

      <main className="p-10 max-w-xl mx-auto">

        <h1 className="text-4xl font-bold">
          Order a Bot
        </h1>

        {session && (
          <p className="text-green-400 mt-2">
            Logged in as {session.user?.name}
          </p>
        )}

        {/* Selected Package */}
        <div className="mt-4 p-4 border border-red-600 rounded-xl bg-black">
          <p className="text-gray-400">
            Selected Package
          </p>

          <h2 className="text-2xl font-bold text-red-500 capitalize">
            {form.plan}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
        >

          {/* Email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="Your Email (backup contact)"
            className="p-3 bg-black border border-gray-700 rounded"
            required
          />

          {/* Plan */}
          <select
            value={form.plan}
            onChange={(e) =>
              setForm({
                ...form,
                plan: e.target.value,
              })
            }
            className="p-3 bg-black border border-gray-700 rounded"
          >
            <option value="basic">
              Basic ($50)
            </option>

            <option value="advanced">
              Advanced ($100)
            </option>

            <option value="premium">
              Premium ($150)
            </option>

            <option value="custom">
              Custom Quote
            </option>
          </select>

          {/* Details */}
          <textarea
            value={form.details}
            onChange={(e) =>
              setForm({
                ...form,
                details: e.target.value,
              })
            }
            placeholder="Describe what you need"
            className="p-3 bg-black border border-gray-700 rounded min-h-[150px]"
            required
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 py-3 rounded-xl hover:bg-red-700 transition"
          >
            {loading
              ? "Sending..."
              : form.plan === "custom"
              ? "Request Custom Quote"
              : "Submit & Receive Invoice"}
          </button>

        </form>

      </main>
    </>
  );
}