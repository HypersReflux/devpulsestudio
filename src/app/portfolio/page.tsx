import Navbar from "@/components/Navbar";

export default function Portfolio() {
  return (
    <>
      <Navbar />
      <main className="p-10">
        <h1 className="text-4xl font-bold">Previous Work</h1>

        <div className="mt-6 space-y-4">
          <div className="border p-4 rounded-xl">
            <h2 className="text-xl">Music Bot System</h2>
            <p className="text-gray-400">
              Queue system, YouTube integration, and filters.
            </p>
          </div>

          <div className="border p-4 rounded-xl">
            <h2 className="text-xl">Moderation Bot</h2>
            <p className="text-gray-400">
              Anti-raid, auto-ban, logging, and role control.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}