import Navbar from "@/components/Navbar";
import PricingCard from "@/components/PricingCard";

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main className="p-10 flex gap-8 justify-center flex-wrap">
        <PricingCard
          title="Basic Bot"
          price="$50"
          features={[
            "Moderation commands",
            "Basic setup",
            "1 custom feature",
          ]}
        />

        <PricingCard
          title="Advanced Bot"
          price="$100"
          features={[
            "Everything in Basic",
            "Custom commands",
          ]}
        />

        <PricingCard
          title="Premium Bot"
          price="$150"
          features={[
            "Everything in Advanced",
            "Database systems",
            "Fully custom features",
          ]}
        />
      </main>
    </>
  );
}