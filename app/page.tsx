"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const search = async () => {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-2">Smart Buy AI</h1>
      <p className="mb-4 text-gray-600">
        Find the best place to buy any product
      </p>

      <input
        className="border p-2 w-80 mb-2"
        placeholder="Search product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        onClick={search}
        className="bg-black text-white px-4 py-2 mb-6"
      >
        Find Best Price
      </button>

      {results.length > 0 && (
        <div className="w-full max-w-md space-y-4">

          {/* Best Option */}
          <div className="border p-4 rounded bg-green-50">
            <h2 className="font-bold text-lg">Best Option</h2>
            <p>{results[0].store}</p>

            <a
              href={results[0].link}
              target="_blank"
              className="bg-green-600 text-white px-4 py-2 mt-2 inline-block rounded"
            >
              View Deal
            </a>
          </div>

          {/* باقي النتائج */}
          {results.map((item, i) => (
            <div key={i} className="border p-4 rounded">
              <p>{item.store}</p>

              <a
                href={item.link}
                target="_blank"
                className="bg-blue-600 text-white px-3 py-1 mt-2 inline-block rounded"
              >
                Check Price
              </a>
            </div>
          ))}

        </div>
      )}

    </main>
  );
}