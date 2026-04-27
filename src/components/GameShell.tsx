import React from "react";

export default function GameShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="bg-black border border-gray-700 rounded-xl p-4 shadow-lg">
        {children}
      </div>
    </main>
  );
}