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

  function ratingValue(rating: number | string) {
    const n = Number(rating);
    return Number.isFinite(n) ? n : 0;
  }

  function getScore(p: Product) {
    let score = 50;
    const rating = ratingValue(p.rating);

    if (p.price < 300) score += 20;
    else if (p.price < 800) score += 14;
    else if (p.price < 1500) score += 8;

    if (rating >= 4.7) score += 25;
    else if (rating >= 4.4) score += 18;
    else if (rating >= 4) score += 10;

    const store = p.store.toLowerCase();
    if (store.includes("amazon") || store.includes("bol") || store.includes("coolblue") || store.includes("mediamarkt")) score += 12;

    return Math.min(100, Math.round(score));
  }

  function decision(score: number) {
    if (score >= 85) return "Best deal";
    if (score >= 70) return "Good choice";
    if (score >= 55) return "Compare first";
    return "Risky";
  }

  function decisionStyle(score: number) {
    if (score >= 85) return "text-emerald-300 border-emerald-300/30 bg-emerald-400/10";
    if (score >= 70) return "text-cyan-300 border-cyan-300/30 bg-cyan-400/10";
    if (score >= 55) return "text-yellow-300 border-yellow-300/30 bg-yellow-400/10";
    return "text-red-300 border-red-300/30 bg-red-400/10";
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

      if (data.products) setProducts(data.products);
      else alert(data.error || "No products found");
    } catch (e) {
      alert("Search failed");
      console.error(e);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050713] text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(34,211,238,0.35),transparent_28%),radial-gradient(circle_at_78%_20%,rgba(168,85,247,0.28),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(16,185,129,0.18),transparent_35%),linear-gradient(135deg,#050713,#0b1020,#111827)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-cyan-400/10 blur-3xl rounded-full" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight">Smart Buy AI</h1>
          <p className="text-xs text-white/45">AI shopping intelligence engine</p>
        </div>

        <div className="hidden md:flex gap-5 text-sm text-white/55">
          <span>AI Deals</span>
          <span>Price Score</span>
          <span>Alerts</span>
          <span>Pro Tools</span>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl text-sm text-white/80 mb-6">
          ✦ Real-time AI shopping advisor
        </div>

        <h2 className="text-5xl md:text-7xl font-black leading-tight">
          Find the smartest way
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-emerald-300 bg-clip-text text-transparent">
            to buy anything.
          </span>
        </h2>

        <p className="text-white/60 max-w-2xl mx-auto mt-5">
          Search real products, compare live prices, and let Smart Buy AI score the best buying option.
        </p>

        <div className="max-w-4xl mx-auto mt-10 p-4 rounded-[32px] bg-white/10 border border-white/15 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search: iPhone 15, gaming laptop, sofa..."
              className="flex-1 bg-white text-black px-5 py-4 rounded-2xl outline-none"
            />

            <button
              onClick={search}
              className="px-8 py-4 rounded-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 shadow-lg"
            >
              Analyze
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 text-xs text-white/60">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">Live prices</div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">AI score</div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-3">Best decision</div>
          </div>
        </div>

        {loading && (
          <p className="mt-6 text-cyan-300 animate-pulse">
            Searching real products and analyzing best buying options...
          </p>
        )}
      </section>

      {best && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-12">
          <div className="relative overflow-hidden rounded-[34px] border border-emerald-300/25 bg-emerald-400/10 backdrop-blur-2xl p-6 shadow-2xl">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-400/20 blur-3xl rounded-full" />

            <p className="relative text-emerald-300 font-black text-sm mb-4">🏆 BEST AI PICK</p>

            <div className="relative grid md:grid-cols-[180px_1fr_170px] gap-6 items-center">
              {best.image && (
                <img
                  src={best.image}
                  alt={best.title}
                  className="w-full h-40 object-contain bg-white rounded-2xl p-3"
                />
              )}

              <div>
                <h3 className="text-2xl md:text-3xl font-black">{best.title}</h3>
                <p className="text-white/60 mt-1">{best.store}</p>
                <p className="text-5xl font-black text-emerald-300 mt-4">€{best.price}</p>
                <p className={`inline-flex mt-3 px-3 py-1 rounded-full border text-sm font-black ${decisionStyle(getScore(best))}`}>
                  {decision(getScore(best))}
                </p>
              </div>

              <div className="rounded-3xl bg-black/30 border border-white/10 p-5 text-center">
                <p className="text-white/50 text-sm">AI Score</p>
                <p className="text-5xl font-black">{getScore(best)}/100</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((p) => {
          const score = getScore(p);

          return (
            <div
              key={p.id}
              className="group rounded-[28px] bg-white/10 border border-white/10 backdrop-blur-xl p-5 hover:bg-white/15 hover:scale-[1.015] transition"
            >
              {p.image && (
                <div className="bg-white rounded-2xl p-3 mb-4">
                  <img src={p.image} alt={p.title} className="w-full h-40 object-contain" />
                </div>
              )}

              <h3 className="font-black text-lg line-clamp-2">{p.title}</h3>
              <p className="text-white/55 text-sm mt-1">{p.store}</p>

              <div className="flex justify-between items-end mt-4">
                <p className="text-3xl font-black">€{p.price}</p>
                <span className={`px-3 py-1 rounded-full border text-xs font-black ${decisionStyle(score)}`}>
                  {decision(score)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/65">
                <div className="rounded-xl bg-white/5 border border-white/10 p-2">Rating: {p.rating}</div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2">AI: {score}/100</div>
              </div>

              <a
                href={p.link}
                target="_blank"
                className="block mt-5 bg-white text-black text-center py-3 rounded-2xl font-black"
              >
                View Offer
              </a>
            </div>
          );
        })}
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-20 pb-16 grid md:grid-cols-3 gap-5">
        <div className="rounded-3xl bg-white/10 border border-white/10 p-6">
          <h3 className="font-black text-xl">Smart Alerts</h3>
          <p className="text-white/55 mt-2 text-sm">Get notified when a product becomes a strong buy.</p>
        </div>

        <div className="rounded-3xl bg-white/10 border border-white/10 p-6">
          <h3 className="font-black text-xl">Price Intelligence</h3>
          <p className="text-white/55 mt-2 text-sm">Understand whether the current price is good or overpriced.</p>
        </div>

        <div className="rounded-3xl bg-white/10 border border-white/10 p-6">
          <h3 className="font-black text-xl">AI Assistant</h3>
          <p className="text-white/55 mt-2 text-sm">Ask what to buy, when to buy, and which option is safer.</p>
        </div>
      </section>
    </main>
  );
}