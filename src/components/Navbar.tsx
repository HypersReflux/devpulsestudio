import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-b border-gray-800">
      <h1 className="text-xl font-bold gradient-text">DevPulseStudio</h1>
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/games">Game</Link>
      </div>
    </nav>
  );
}