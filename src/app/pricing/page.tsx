import Navbar from "@/components/Navbar";
import PricingCard from "@/components/PricingCard";
import Link from "next/link";

export default function Pricing() {
  return (
    <>
      <Navbar />

      <main className="p-10 flex gap-8 justify-center flex-wrap">

        <div>
          <PricingCard
            title="Basic Bot"
            price="$50"
            features={[
              "Moderation commands",
              "Basic setup",
              "1 custom feature",
            ]}
          />

          <Link href="/contact?plan=basic">
            <button className="w-full mt-4 bg-red-600 py-3 rounded-xl hover:bg-red-700 transition">
              Order Basic
            </button>
          </Link>
        </div>

        <div>
          <PricingCard
            title="Advanced Bot"
            price="$100"
            features={[
              "Everything in Basic",
              "Custom commands",
            ]}
          />

          <Link href="/contact?plan=advanced">
            <button className="w-full mt-4 bg-red-600 py-3 rounded-xl hover:bg-red-700 transition">
              Order Advanced
            </button>
          </Link>
        </div>

        <div>
          <PricingCard
            title="Premium Bot"
            price="$150"
            features={[
              "Everything in Advanced",
              "Database systems",
              "Fully custom features",
            ]}
          />

          <Link href="/contact?plan=premium">
            <button className="w-full mt-4 bg-red-600 py-3 rounded-xl hover:bg-red-700 transition">
              Order Premium
            </button>
          </Link>
        </div>

        <div>
          <PricingCard
            title="Custom Bot"
            price="Contact for Quote"
            features={[
              "Tailored to your needs",
              "Flexible pricing",
              "Priority support",
            ]}
          />

          <Link href="/contact?plan=custom">
            <button className="w-full mt-4 bg-red-600 py-3 rounded-xl hover:bg-red-700 transition">
              Request Custom Quote
            </button>
          </Link>
        </div>

      </main>
    </>
  );
}