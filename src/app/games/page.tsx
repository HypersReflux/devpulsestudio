import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function GamesMenu() {
  return (
    <>
      <Navbar />

      <main className="p-10 text-center">
        <h1 className="text-4xl font-bold">Arcade</h1>

        <p className="text-gray-400 mt-2">
          Select a game to play
        </p>

        <div className="grid grid-cols-2 gap-6 mt-10 max-w-xl mx-auto">

          <Link href="/games/asteroids">
            <div className="p-6 bg-black border rounded hover:bg-gray-900 cursor-pointer">
              🚀 Asteroids
            </div>
          </Link>

          <Link href="/games/snake">
            <div className="p-6 bg-black border rounded hover:bg-gray-900 cursor-pointer">
              🐍 Snake
            </div>
          </Link>

          <Link href="/games/flappy">
            <div className="p-6 bg-black border rounded hover:bg-gray-900 cursor-pointer">
              🐦 Flappy Bird
            </div>
          </Link>

          <Link href="/games/invaders">
            <div className="p-6 bg-black border rounded hover:bg-gray-900 cursor-pointer">
              👾 Space Invaders
            </div>
          </Link>

        </div>
      </main>
    </>
  );
}