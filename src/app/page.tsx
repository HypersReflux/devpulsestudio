import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-10 text-center">
        <h1 className="text-5xl font-bold gradient-text">
          Custom Discord Bots Built for You
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto">
          Moderation, music, economy, and fully custom systems tailored to your server.
        </p>

        <div className="mt-8">
          <a
            href="/pricing"
            className="bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition"
          >
            View Pricing
          </a>
        </div>
      </main>
    </>
  );
}