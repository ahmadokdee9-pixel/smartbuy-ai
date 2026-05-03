"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [best, setBest] = useState<any>(null);
  const [category, setCategory] = useState("All");

  const fakeData = [
    { store: "Amazon", price: 899, link: "https://www.amazon.com", category: "Electronics" },
    { store: "Bol.com", price: 920, link: "https://www.bol.com", category: "Electronics" },
    { store: "MediaMarkt", price: 950, link: "https://www.mediamarkt.nl", category: "Electronics" },

    { store: "Zara", price: 70, link: "https://www.zara.com", category: "Clothing" },
    { store: "H&M", price: 65, link: "https://www.hm.com", category: "Clothing" },

    { store: "IKEA", price: 120, link: "https://www.ikea.com", category: "Home" },
  ];

  const search = () => {
    let filtered = fakeData;

    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }

    filtered = filtered.sort((a, b) => a.price - b.price);

    setResults(filtered);
    setBest(filtered[0]);
  };

  return (
    <main className="p-10 text-center max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Smart Buy AI</h1>
      <p className="mb-6 text-gray-500">
        Find the best price and compare stores instantly
      </p>

      {/* Search */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product (iphone, jacket...)"
        className="border p-2 w-full mb-4 rounded"
      />

      {/* Categories */}
      <div className="flex gap-2 justify-center mb-4">
        {["All", "Electronics", "Clothing", "Home"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded ${
              category === cat
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <button
        onClick={search}
        className="bg-black text-white px-4 py-2 rounded mb-6"
      >
        Find Best Price
      </button>

      {/* Best Deal */}
      {best && (
        <div className="border p-4 rounded mb-6 bg-green-50">
          <h2 className="font-bold text-lg">🔥 Best Deal</h2>
          <p>{best.store}</p>
          <p className="text-xl font-bold">€{best.price}</p>
          <a
            href={best.link}
            target="_blank"
            className="bg-green-600 text-white px-3 py-1 rounded inline-block mt-2"
          >
            View Deal
          </a>
        </div>
      )}

      {/* Results */}
      {results.map((item, i) => (
        <div key={i} className="border p-3 mb-3 rounded">
          <p className="font-bold">{item.store}</p>
          <p>€{item.price}</p>
          <a
            href={item.link}
            target="_blank"
            className="bg-blue-500 text-white px-3 py-1 rounded inline-block mt-2"
          >
            Check Price
          </a>
        </div>
      ))}
    </main>
  );
}