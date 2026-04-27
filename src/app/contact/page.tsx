import Navbar from "@/components/Navbar";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="p-10 max-w-xl mx-auto">
        <h1 className="text-4xl font-bold">Order a Bot</h1>

        <form className="mt-6 flex flex-col gap-4">
          <input
            placeholder="Your Discord Username"
            className="p-3 bg-black border border-gray-700 rounded"
          />

          <textarea
            placeholder="Describe what you need"
            className="p-3 bg-black border border-gray-700 rounded"
          />

          <button className="bg-red-600 py-3 rounded-xl hover:bg-red-700">
            Submit Request
          </button>
        </form>
      </main>
    </>
  );
}