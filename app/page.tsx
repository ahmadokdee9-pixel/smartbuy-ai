"use client";

import { useState } from "react";

type Product = {
  name: string;
  store: string;
  price: number;
  oldPrice: number;
  rating: number;
  link: string;
  category: string;
  delivery: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState<Product[]>([]);
  const [best, setBest] = useState<Product | null>(null);

  const products: Product[] = [
    {
      name: "iphone 13",
      store: "Amazon",
      price: 489,
      oldPrice: 549,
      rating: 4.5,
      link: "https://www.amazon.nl/s?k=iphone+13",
      category: "Electronics",
      delivery: "Fast delivery",
    },
    {
      name: "iphone 13",
      store: "Bol.com",
      price: 509,
      oldPrice: 569,
      rating: 4.4,
      link: "https://www.bol.com/nl/nl/s/?searchtext=iphone+13",
      category: "Electronics",
      delivery: "1-2 days",
    },
    {
      name: "iphone 13",
      store: "MediaMarkt",
      price: 529,
      oldPrice: 579,
      rating: 4.3,
      link: "https://www.mediamarkt.nl/nl/search.html?query=iphone+13",
      category: "Electronics",
      delivery: "Store pickup",
    },
    {
      name: "iphone 15",
      store: "Amazon",
      price: 779,
      oldPrice: 849,
      rating: 4.7,
      link: "https://www.amazon.nl/s?k=iphone+15",
      category: "Electronics",
      delivery: "Fast delivery",
    },
    {
      name: "jacket",
      store: "H&M",
      price: 65,
      oldPrice: 89,
      rating: 4.1,
      link: "https://www2.hm.com/nl_nl/search-results.html?q=jacket",
      category: "Clothing",
      delivery: "2-4 days",
    },
    {
      name: "jacket",
      store: "Zara",
      price: 70,
      oldPrice: 99,
      rating: 4.2,
      link: "https://www.zara.com/nl/en/search?searchTerm=jacket",
      category: "Clothing",
      delivery: "2-3 days",
    },
    {
      name: "sofa",
      store: "IKEA",
      price: 299,
      oldPrice: 349,
      rating: 4.3,
      link: "https://www.ikea.com/nl/en/search/?q=sofa",
      category: "Home",
      delivery: "Home delivery",
    },
  ];

  function getDealScore(item: Product) {
    const discountPercent = ((item.oldPrice - item.price) / item.oldPrice) * 100;
    const ratingScore = item.rating * 10;
    const finalScore = Math.round(discountPercent * 2 + ratingScore);
    return Math.min(finalScore, 100);
  }

  function getDiscountPercent(item: Product) {
    return Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
  }

  function getDecision(score: number) {
    if (score >= 85) return "🔥 Buy Now";
    if (score >= 65) return "✅ Good Deal";
    if (score >= 45) return "⚠️ Wait";
    return "❌ Avoid For Now";
  }

  function getAiAnalysis(item: Product) {
    const score = getDealScore(item);
    const saving = item.oldPrice - item.price;

    if (score >= 85) {
      return `This is a strong deal. The price is €${saving} lower than usual, rating is good, and buying now is recommended.`;
    }

    if (score >= 65) {
      return `This is a good deal, but not perfect. You can buy now if you need it, but waiting may give you a slightly better price.`;
    }

    if (score >= 45) {
      return `The price is average. Smart Buy AI recommends waiting a few days unless you need it urgently.`;
    }

    return `This deal is not attractive right now. The discount is weak compared to the usual price. Waiting is recommended.`;
  }

  function getBestTimeToBuy(item: Product) {
    const score = getDealScore(item);

    if (score >= 85) return "Best time: Buy today";
    if (score >= 65) return "Best time: This week";
    if (score >= 45) return "Best time: Wait 7-14 days";
    return "Best time: Wait for a discount";
  }

  function search() {
    let filtered = products;

    if (query.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    filtered = filtered.sort((a, b) => getDealScore(b) - getDealScore(a));

    setResults(filtered);
    setBest(filtered[0] || null);
  }

  function quickSearch(productName: string) {
    setQuery(productName);

    const filtered = products
      .filter((item) => item.name.toLowerCase().includes(productName.toLowerCase()))
      .sort((a, b) => getDealScore(b) - getDealScore(a));

    setResults(filtered);
    setBest(filtered[0] || null);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Smart Buy AI</h1>
          <p className="text-gray-600">
            AI shopping assistant that helps you decide what to buy, where to buy,
            and when to buy.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mb-6 text-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product: iphone 13, jacket, sofa..."
            className="border p-3 w-full rounded mb-4"
          />

          <div className="flex gap-2 justify-center mb-4 flex-wrap">
            {["All", "Electronics", "Clothing", "Home"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded ${
                  category === cat ? "bg-black text-white" : "bg-gray-200 text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={search}
            className="bg-black text-white px-6 py-3 rounded font-semibold"
          >
            Find Best Deal
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-xl font-bold mb-3">🔥 Trending Now</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["iphone 13", "iphone 15", "jacket", "sofa"].map((item) => (
              <button
                key={item}
                onClick={() => quickSearch(item)}
                className="border p-3 rounded hover:bg-gray-100"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {best && (
          <div className="bg-green-50 border border-green-500 p-5 rounded-xl mb-6">
            <h2 className="text-2xl font-bold mb-2">🏆 Best AI Pick</h2>

            <p className="font-bold text-lg">
              {best.name} from {best.store}
            </p>

            <p className="text-2xl font-bold text-green-700">€{best.price}</p>

            <p className="text-sm text-gray-500 line-through">
              Usual price: €{best.oldPrice}
            </p>

            <p className="mt-2">
              Save: <strong>€{best.oldPrice - best.price}</strong>
            </p>

            <div className="mt-3">
              <div className="bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${getDiscountPercent(best)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">Discount: {getDiscountPercent(best)}%</p>
            </div>

            <p className="mt-2">
              Rating: <strong>{best.rating}/5 ⭐</strong>
            </p>

            <p className="mt-2">
              Deal Score: <strong>{getDealScore(best)}/100</strong>
            </p>

            <p className="mt-2 font-bold">{getDecision(getDealScore(best))}</p>

            <div className="mt-4 bg-yellow-100 p-3 rounded">
              <p className="font-semibold">📊 AI Alert</p>
              <p className="text-sm">
                Prices for this product may drop during sales events. Smart Buy AI
                recommends checking again before major shopping days.
              </p>
            </div>

            <p className="mt-4 text-gray-700">{getAiAnalysis(best)}</p>

            <p className="mt-2 font-semibold">{getBestTimeToBuy(best)}</p>

            <p className="mt-2 text-sm text-gray-600">Delivery: {best.delivery}</p>

            <a
              href={best.link}
              target="_blank"
              className="bg-green-600 text-white px-4 py-2 rounded inline-block mt-4"
            >
              View Best Deal
            </a>
          </div>
        )}

        {results.length > 0 && (
          <h2 className="text-xl font-bold mb-4 text-center">All Results</h2>
        )}

        {results.map((item, i) => (
          <div key={i} className="bg-white border p-4 mb-4 rounded-xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{item.store}</p>
                <p className="text-gray-600">{item.name}</p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold">€{item.price}</p>
                <p className="text-sm text-gray-400 line-through">€{item.oldPrice}</p>
              </div>
            </div>

            <div className="mt-3">
              <p>⭐ Rating: {item.rating}/5</p>
              <p>📦 Delivery: {item.delivery}</p>
              <p>🧠 AI Score: {getDealScore(item)}/100</p>
              <p>💰 Discount: {getDiscountPercent(item)}%</p>
              <p className="font-semibold">{getDecision(getDealScore(item))}</p>
            </div>

            <a
              href={item.link}
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded inline-block mt-3"
            >
              Check Price
            </a>
          </div>
        ))}

        {results.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">
            Search for a product to see AI recommendations.
          </p>
        )}
      </section>
    </main>
  );
}