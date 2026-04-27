type Props = {
  title: string;
  price: string;
  features: string[];
};

export default function PricingCard({ title, price, features }: Props) {
  return (
    <div className="border border-gray-800 p-6 rounded-2xl w-80">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-3xl mt-2">{price}</p>

      <ul className="mt-4 text-gray-400">
        {features.map((f, i) => (
          <li key={i}>• {f}</li>
        ))}
      </ul>

      <button className="mt-6 w-full bg-green-500 py-2 rounded-xl hover:bg-green-600">
        Order Now
      </button>
    </div>
  );
}