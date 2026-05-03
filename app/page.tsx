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
  const [loading, setLoading] = useState(false);

  const products: Product[] = [
    { name: "iphone 13", store: "Amazon", price: 489, oldPrice: 549, rating: 4.5, link: "https://www.amazon.nl/s?k=iphone+13", category: "Electronics", delivery: "Fast delivery" },
    { name: "iphone 13", store: "Bol.com", price: 509, oldPrice: 569, rating: 4.4, link: "https://www.bol.com/nl/nl/s/?searchtext=iphone+13", category: "Electronics", delivery: "1-2 days" },
    { name: "iphone 13", store: "MediaMarkt", price: 529, oldPrice: 579, rating: 4.3, link: "https://www.mediamarkt.nl/nl/search.html?query=iphone+13", category: "Electronics", delivery: "Store pickup" },
    { name: "iphone 15", store: "Amazon", price: 779, oldPrice: 849, rating: 4.7, link: "https://www.amazon.nl/s?k=iphone+15", category: "Electronics", delivery: "Fast delivery" },
    { name: "jacket", store: "H&M", price: 65, oldPrice: 89, rating: 4.1, link: "https://www2.hm.com/nl_nl/search-results.html?q=jacket", category: "Clothing", delivery: "2-4 days" },
    { name: "jacket", store: "Zara", price: 70, oldPrice: 99, rating: 4.2, link: "https://www.zara.com/nl/en/search?searchTerm=jacket", category: "Clothing", delivery: "2-3 days" },
    { name: "sofa", store: "IKEA", price: 299, oldPrice: 349, rating: 4.3, link: "https://www.ikea.com/nl/en/search/?q=sofa", category: "Home", delivery: "Home delivery" },
  ];

  function getDealScore(item: Product) {
    const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;
    return Math.min(Math.round(discount * 2 + item.rating * 10), 100);
  }

  function getDiscountPercent(item: Product) {
    return Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
  }

  function getDecision(score: number) {
    if (score >= 85) return "🔥 Buy Now";
    if (score >= 65) return "✅ Good Deal";
    if (score >= 45) return "⚠️ Wait";
    return "❌ Avoid";
  }

  function getBestTime(score: number) {
    if (score >= 85) return "Buy today";
    if (score >= 65) return "This week";
    if (score >= 45) return "Wait 7-14 days";
    return "Wait for discount";
  }

  function getAiAnalysis(item: Product) {
    const score = getDealScore(item);
    const saving = item.oldPrice - item.price;

    if (score >= 85) return `Strong deal. You save €${saving}. Buying now is recommended.`;
    if (score >= 65) return `Good deal. You can buy now, but waiting may give you a slightly better price.`;
    if (score >= 45) return `Average price. Smart Buy AI recommends waiting if it is not urgent.`;
    return `Weak deal. Waiting is recommended because the discount is not attractive.`;
  }

  function search() {
    setLoading(true);

    setTimeout(() => {
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
      setLoading(false);
    }, 900);
  }

  function quickSearch(productName: string) {
    setQuery(productName);
    setLoading(true);

    setTimeout(() => {
      const filtered = products
        .filter((item) => item.name.toLowerCase().includes(productName.toLowerCase()))
        .sort((a, b) => getDealScore(b) - getDealScore(a));

      setResults(filtered);
      setBest(filtered[0] || null);
      setLoading(false);
    }, 700);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-indigo-500 opacity-20 blur-3xl top-[-100px] left-[-100px]" />
        <div className="absolute w-[600px] h-[600px] bg-purple-500 opacity-20 blur-3xl bottom-[-100px] right-[-100px]" />
      </div>

      <section className="max-w-6xl mx-auto">
        <nav className="flex justify-between items-center mb-10">
          <div className="text-2xl font-bold">Smart Buy AI</div>
          <div className="hidden md:flex gap-5 text-sm text-slate-300">
            <span>AI Deals</span>
            <span>Price Score</span>
            <span>Best Time</span>
            <span>Trusted Stores</span>
          </div>
        </nav>

        <div className="text-center mb-10">
          <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-4">
            ⚡ AI Shopping Assistant
          </div>

          <h1 className="text-5xl font-extrabold mb-4">
            Buy smarter. Save faster.
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto">
            Compare deals, understand price quality, and know when to buy with AI-powered recommendations.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product: iphone 13, jacket, sofa..."
            className="w-full p-4 rounded-xl bg-white text-black mb-4 outline-none"
          />

          <div className="flex gap-2 justify-center mb-5 flex-wrap">
            {["All", "Electronics", "Clothing", "Home"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full ${
                  category === cat
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-slate-200 border border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={search}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.7)]"
          >
            🔍 Find Best Deal
          </button>

          {loading && (
            <p className="text-center text-indigo-300 animate-pulse mt-4">
              🤖 AI is analyzing best deals...
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {["iphone 13", "iphone 15", "jacket", "sofa"].map((item) => (
            <button
              key={item}
              onClick={() => quickSearch(item)}
              className="bg-white/10 border border-white/20 rounded-xl p-4 text-left hover:bg-white/20 hover:scale-[1.02] transition-all duration-300"
            >
              <p className="text-sm text-slate-400">Trending</p>
              <p className="font-bold">{item}</p>
            </button>
          ))}
        </div>

        {best && !loading && (
          <div className="bg-emerald-500/10 border border-emerald-400/40 p-6 rounded-2xl mb-8 shadow-xl">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold mb-2">🏆 Best AI Pick</h2>
                <p className="text-xl font-semibold">
                  {best.name} from {best.store}
                </p>
                <p className="text-4xl font-extrabold text-emerald-300 mt-2">
                  €{best.price}
                </p>
                <p className="text-slate-400 line-through">€{best.oldPrice}</p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 min-w-[170px]">
                <p className="text-sm text-slate-300">AI Score</p>
                <p className="text-4xl font-bold">{getDealScore(best)}/100</p>
                <p className="mt-2">{getDecision(getDealScore(best))}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="bg-white/20 h-3 rounded-full">
                <div
                  className="bg-emerald-400 h-3 rounded-full"
                  style={{ width: `${getDiscountPercent(best)}%` }}
                />
              </div>
              <p className="text-sm mt-2">
                Discount: {getDiscountPercent(best)}% — Save €{best.oldPrice - best.price}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <div className="bg-white/10 p-4 rounded-xl">⭐ Rating: {best.rating}/5</div>
              <div className="bg-white/10 p-4 rounded-xl">📦 Delivery: {best.delivery}</div>
              <div className="bg-white/10 p-4 rounded-xl">⏳ Best time: {getBestTime(getDealScore(best))}</div>
            </div>

            <div className="mt-4 bg-white/10 p-3 rounded-xl">
              <p className="text-sm text-slate-300">
                🔐 Verified Stores | AI Checked | Trusted Deals
              </p>
            </div>

            <div className="mt-5 bg-yellow-300/20 border border-yellow-300/30 p-4 rounded-xl">
              <p className="font-bold">📊 AI Alert</p>
              <p className="text-sm text-slate-200">{getAiAnalysis(best)}</p>
            </div>

            <a
              href={best.link}
              target="_blank"
              className="inline-block mt-5 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              View Best Deal
            </a>
          </div>
        )}

        {results.length > 0 && !loading && (
          <h2 className="text-2xl font-bold mb-4">All Results</h2>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {results.map((item, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 p-5 rounded-2xl hover:bg-white/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-bold text-xl">{item.store}</p>
                  <p className="text-slate-300">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">€{item.price}</p>
                  <p className="line-through text-slate-400">€{item.oldPrice}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-300 space-y-1">
                <p>⭐ Rating: {item.rating}/5</p>
                <p>📦 Delivery: {item.delivery}</p>
                <p>🧠 AI Score: {getDealScore(item)}/100</p>
                <p>💰 Discount: {getDiscountPercent(item)}%</p>
                <p className="font-bold text-white">{getDecision(getDealScore(item))}</p>
              </div>

              <a
                href={item.link}
                target="_blank"
                className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
              >
                Check Price
              </a>
            </div>
          ))}
        </div>

        {results.length === 0 && !loading && (
          <p className="text-center text-slate-400 mt-10">
            Search for a product to see AI recommendations.
          </p>
        )}

        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p>© 2026 Smart Buy AI</p>
          <p className="mt-1">AI-powered shopping assistant</p>
        </footer>
      </section>
    </main>
  );
}