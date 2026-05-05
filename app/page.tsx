"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  title: string;
  store: string;
  price: number;
  displayPrice?: string;
  rating: number | string;
  link: string;
  image: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  function getRatingValue(rating: number | string) {
    const value = Number(rating);
    return Number.isFinite(value) ? value : 0;
  }

  function getScore(product: Product) {
    const rating = getRatingValue(product.rating);

    let score = 50;

    if (product.price > 0 && product.price < 300) score += 20;
    else if (product.price < 800) score += 15;
    else if (product.price < 1500) score += 8;

    if (rating >= 4.7) score += 25;
    else if (rating >= 4.4) score += 18;
    else if (rating >= 4.0) score += 10;

    const store = product.store.toLowerCase();
    if (store.includes("apple")) score += 12;
    if (store.includes("amazon")) score += 10;
    if (store.includes("bol")) score += 10;
    if (store.includes("coolblue")) score += 10;
    if (store.includes("mediamarkt")) score += 10;

    return Math.min(100, Math.round(score));
  }

  function getDecision(score: number) {
    if (score >= 85) return "🔥 Best deal";
    if (score >= 70) return "👍 Good choice";
    if (score >= 55) return "⏳ Compare first";
    return "⚠️ Risky";
  }

  function getDecisionColor(score: number) {
    if (score >= 85) return "text-emerald-300";
    if (score >= 70) return "text-cyan-300";
    if (score >= 55) return "text-yellow-300";
    return "text-red-300";
  }

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => getScore(b) - getScore(a));
  }, [products]);

  const best = sortedProducts[0];

  async function search() {
    if (!query.trim()) return;

    setLoading(true);
    setProducts([]);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.products) {
        setProducts(data.products);
      } else {
        alert(data.error || "No products found");
      }
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050713] text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(56,189,248,0.25),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.22),transparent_35%),linear-gradient(135deg,#050713,#0f172a,#111827)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <section className="text-center pt-20 px-6">
        <h1 className="text-5xl md:text-7xl font-black mb-4">Smart Buy AI</h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Search any product and get real prices + AI-powered buying decision
        </p>
      </section>

      <section className="max-w-3xl mx-auto mt-10 px-6">
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-3xl p-4 flex gap-3 shadow-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search for anything... iPhone, laptop, sofa"
            className="flex-1 bg-white text-black px-5 py-4 rounded-2xl outline-none"
          />

          <button
            onClick={search}
            className="bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 rounded-2xl font-bold"
          >
            Search
          </button>
        </div>
      </section>

      {loading && (
        <p className="text-center mt-6 text-cyan-300 animate-pulse">
          Searching real products...
        </p>
      )}

      {best && !loading && (
        <section className="max-w-5xl mx-auto mt-12 px-6">
          <div className="bg-emerald-400/10 border border-emerald-300/30 rounded-3xl p-6 backdrop-blur-xl">
            <p className="text-emerald-300 font-black text-sm mb-2">
              🏆 BEST AI PICK
            </p>
            <div className="grid md:grid-cols-[160px_1fr_160px] gap-6 items-center">
              {best.image && (
                <img
                  src={best.image}
                  alt={best.title}
                  className="w-full h-36 object-contain bg-white rounded-2xl"
                />
              )}

              <div>
                <h2 className="text-2xl font-black">{best.title}</h2>
                <p className="text-white/60 mt-1">{best.store}</p>
                <p className="text-4xl font-black text-emerald-300 mt-3">
                  €{best.price}
                </p>
                <p className={`mt-2 font-black ${getDecisionColor(getScore(best))}`}>
                  {getDecision(getScore(best))}
                </p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 text-center">
                <p className="text-white/50 text-sm">AI Score</p>
                <p className="text-4xl font-black">{getScore(best)}/100</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto mt-12 px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((p) => {
          const score = getScore(p);

          return (
            <div
              key={p.id}
              className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl hover:scale-[1.02] transition"
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-40 object-contain bg-white rounded-xl mb-4"
                />
              )}

              <h3 className="font-bold text-lg line-clamp-2">{p.title}</h3>

              <p className="text-2xl font-black mt-3">€{p.price}</p>

              <p className={`mt-2 text-sm font-bold ${getDecisionColor(score)}`}>
                {getDecision(score)}
              </p>

              <p className="text-white/60 text-sm mt-1">
                {p.store} • Rating: {p.rating}
              </p>

              <p className="text-white/50 text-sm mt-1">AI Score: {score}/100</p>

              <a
                href={p.link}
                target="_blank"
                className="block mt-4 bg-white text-black text-center py-2 rounded-xl font-bold"
              >
                View Offer
              </a>
            </div>
          );
        })}
      </section>
    </main>
  );
}