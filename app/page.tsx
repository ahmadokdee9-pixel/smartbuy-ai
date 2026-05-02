"use client";

import { useState } from "react";

export default function Home() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSearch = async () => {
    if (!product) return;

    const res = await fetch(`/api/search?q=${product}`);
    const data = await res.json();

    setResults(data);

    // 🧠 AI ANALYSIS
    if (data.length > 0) {
      const cheapest = data.reduce((a: any, b: any) =>
        a.price < b.price ? a : b
      );

      const highest = data.reduce((a: any, b: any) =>
        a.price > b.price ? a : b
      );

      const average =
        data.reduce((sum: number, item: any) => sum + item.price, 0) /
        data.length;

      const diff = average - cheapest.price;

      let decision = "";
      let score = 0;
      let aiText = "";

      if (diff > 50) {
        decision = "🔥 Best Deal";
        score = 90;
        aiText = `This is a strong deal for ${product}. Prices are significantly below market average. Buying now is highly recommended.`;
      } else if (diff > 20) {
        decision = "👍 Good Deal";
        score = 75;
        aiText = `This is a good price for ${product}, but not the lowest ever. Still worth buying.`;
      } else if (diff > 0) {
        decision = "⚠️ Average Price";
        score = 50;
        aiText = `The price is average. You may find better deals later. Consider waiting.`;
      } else {
        decision = "❌ Bad Deal";
        score = 30;
        aiText = `This price is higher than normal. It is better to wait before buying ${product}.`;
      }

      setAnalysis({
        cheapest,
        highest,
        average,
        decision,
        score,
        aiText,
      });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-10 gap-6">
      <h1 className="text-3xl font-bold">Smart Buy AI</h1>
      <p>Find the best price and the best place to buy.</p>

      <input
        className="border p-2 w-80"
        placeholder="Example: iPhone 13"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2"
      >
        Find Best Price
      </button>

      {/* 🧠 AI RESULT */}
      {analysis && (
        <div className="border p-4 w-96 bg-green-50 rounded-lg">
          <h2 className="font-bold text-lg">Best Price Now</h2>

          <p className="font-semibold">
            {analysis.cheapest.store}: €{analysis.cheapest.price}
          </p>

          <p className="text-green-700">{analysis.decision}</p>

          <p>
            You can save €
            {analysis.highest.price - analysis.cheapest.price}
          </p>

          <a
            href={analysis.cheapest.link}
            target="_blank"
            className="bg-green-600 text-white px-3 py-1 mt-2 inline-block rounded"
          >
            Buy Best Deal
          </a>

          <hr className="my-2" />

          <p className="text-sm">{analysis.aiText}</p>
        </div>
      )}

      {/* 🛒 ALL RESULTS */}
      {results.map((item, i) => (
        <div key={i} className="border p-4 w-96 rounded">
          <p className="font-semibold">
            {item.store}: €{item.price}
          </p>

          <a
            href={item.link}
            target="_blank"
            className="bg-blue-600 text-white px-3 py-1 mt-2 inline-block rounded"
          >
            Buy Now
          </a>
        </div>
      ))}
    </main>
  );
}