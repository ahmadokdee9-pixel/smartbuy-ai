"use client";

import { useState } from "react";

type StoreOffer = {
  store: string;
  price: number;
  oldPrice: number;
  rating: number;
  delivery: "Fast" | "Medium" | "Slow";
  trust: "High" | "Medium" | "Low";
  stock: "In stock" | "Limited" | "Check store";
};

export default function Home() {
  const [product, setProduct] = useState("");
  const [budget, setBudget] = useState("");
  const [priority, setPriority] = useState("Best value");
  const [results, setResults] = useState<StoreOffer[]>([]);
  const [best, setBest] = useState<StoreOffer | null>(null);
  const [loading, setLoading] = useState(false);

  const stores = [
    { store: "Amazon", mod: 0.94, rating: 4.5, delivery: "Fast", trust: "High" },
    { store: "Bol.com", mod: 0.97, rating: 4.4, delivery: "Fast", trust: "High" },
    { store: "MediaMarkt", mod: 1.03, rating: 4.3, delivery: "Fast", trust: "High" },
    { store: "Coolblue", mod: 1.0, rating: 4.6, delivery: "Fast", trust: "High" },
    { store: "IKEA", mod: 0.9, rating: 4.1, delivery: "Medium", trust: "Medium" },
    { store: "AliExpress", mod: 0.76, rating: 4.0, delivery: "Slow", trust: "Medium" },
    { store: "Temu", mod: 0.72, rating: 3.9, delivery: "Slow", trust: "Low" },
  ] as const;

  function getBasePrice(text: string) {
    const q = text.toLowerCase();

    if (q.includes("iphone")) return 800;
    if (q.includes("samsung")) return 700;
    if (q.includes("laptop")) return q.includes("gaming") ? 1100 : 750;
    if (q.includes("macbook")) return 1200;
    if (q.includes("tv")) return 650;
    if (q.includes("sofa")) return 350;
    if (q.includes("shoes")) return 120;
    if (q.includes("jacket")) return 90;
    if (q.includes("coffee")) return 300;
    if (q.includes("washing")) return 500;
    if (q.includes("bike")) return 900;

    return 250;
  }

  function getScore(item: StoreOffer) {
    const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;

    let score = discount * 2 + item.rating * 10;

    if (item.trust === "High") score += 12;
    if (item.trust === "Medium") score += 5;
    if (item.trust === "Low") score -= 10;

    if (item.delivery === "Fast") score += 8;
    if (item.delivery === "Slow") score -= 8;

    if (priority === "Cheapest price") {
      score += discount;
    }

    if (priority === "Fast delivery" && item.delivery === "Fast") {
      score += 12;
    }

    if (priority === "Trusted store" && item.trust === "High") {
      score += 12;
    }

    return Math.max(0, Math.min(Math.round(score), 100));
  }

  function getDecision(score: number) {
    if (score >= 88) return "Buy now";
    if (score >= 72) return "Good deal";
    if (score >= 55) return "Wait";
    return "Avoid";
  }

  function getDecisionColor(score: number) {
    if (score >= 88) return "bg-emerald-400 text-black";
    if (score >= 72) return "bg-cyan-400 text-black";
    if (score >= 55) return "bg-yellow-400 text-black";
    return "bg-red-500 text-white";
  }

  function getAdvice(item: StoreOffer) {
    const score = getScore(item);
    const saving = item.oldPrice - item.price;

    if (score >= 88) {
      return `This is the strongest option now. It offers a saving of €${saving}, strong trust, and good buying conditions.`;
    }

    if (score >= 72) {
      return `This is a good deal, but you should still compare delivery and final checkout price.`;
    }

    if (score >= 55) {
      return `This offer is average. Waiting may give you a better price soon.`;
    }

    return `This option is not recommended now. The value is weak compared with other stores.`;
  }

  function analyze() {
    if (!product.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const base = budget ? Math.min(getBasePrice(product), Number(budget)) : getBasePrice(product);

      const generated: StoreOffer[] = stores.map((s, index) => ({
        store: s.store,
        price: Math.round(base * s.mod),
        oldPrice: Math.round(base * 1.18),
        rating: s.rating,
        delivery: s.delivery,
        trust: s.trust,
        stock: index < 4 ? "In stock" : index === 4 ? "Limited" : "Check store",
      }));

      const sorted = generated.sort((a, b) => getScore(b) - getScore(a));

      setResults(sorted);
      setBest(sorted[0]);
      setLoading(false);
    }, 800);
  }

  return (
    <main className="relative min-h-screen bg-[#050713] text-white overflow-hidden text-[15px]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(56,189,248,0.28),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.22),transparent_35%),linear-gradient(135deg,#050713,#0f172a,#111827)]" />
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black">Smart Buy AI</h1>
          <p className="text-xs text-white/45">AI shopping decision engine</p>
        </div>

        <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">
          Pro coming soon
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-16 text-center">
        <div className="inline-flex bg-white/10 border border-white/15 px-4 py-2 rounded-full text-sm mb-7">
          AI-powered buying advisor
        </div>

        <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Tell us what you need.
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
            We find the smartest buy.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-white/65 mb-8">
          Smart Buy AI analyzes multiple stores and gives you a clear recommendation:
          buy now, wait, or avoid.
        </p>

        <div className="max-w-4xl mx-auto bg-white/10 border border-white/15 backdrop-blur-2xl rounded-[32px] p-5 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Product: laptop, iPhone, sofa..."
              className="bg-white text-black px-5 py-4 rounded-2xl outline-none"
            />

            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Budget € optional"
              className="bg-white text-black px-5 py-4 rounded-2xl outline-none"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-white text-black px-5 py-4 rounded-2xl outline-none"
            >
              <option>Best value</option>
              <option>Cheapest price</option>
              <option>Fast delivery</option>
              <option>Trusted store</option>
            </select>
          </div>

          <button
            onClick={analyze}
            className="mt-4 w-full bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-4 rounded-2xl font-black hover:scale-[1.01] transition"
          >
            Analyze Best Buying Option
          </button>

          {loading && (
            <p className="mt-4 text-cyan-300 animate-pulse">
              Smart Buy AI is analyzing stores, price, trust, delivery and timing...
            </p>
          )}
        </div>
      </section>

      {best && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-14">
          <div className="bg-white/10 border border-white/15 rounded-[34px] p-8 backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-cyan-300 font-bold text-sm mb-2">
                  BEST BUYING DECISION
                </p>

                <h2 className="text-4xl font-black">
                  Buy from {best.store}
                </h2>

                <p className="text-6xl font-black text-emerald-300 mt-4">
                  €{best.price}
                </p>

                <p className="line-through text-white/40">
                  usual price €{best.oldPrice}
                </p>
              </div>

              <div className="bg-black/35 border border-white/10 rounded-3xl p-6 min-w-[210px]">
                <p className="text-white/50">AI Score</p>
                <p className="text-5xl font-black">{getScore(best)}/100</p>

                <p className={`mt-3 inline-block px-3 py-1 rounded-full font-black ${getDecisionColor(getScore(best))}`}>
                  {getDecision(getScore(best))}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mt-8">
              <div className="bg-white/10 rounded-2xl p-4">Rating: {best.rating}/5</div>
              <div className="bg-white/10 rounded-2xl p-4">Delivery: {best.delivery}</div>
              <div className="bg-white/10 rounded-2xl p-4">Trust: {best.trust}</div>
              <div className="bg-white/10 rounded-2xl p-4">Stock: {best.stock}</div>
              <div className="bg-white/10 rounded-2xl p-4">Priority: {priority}</div>
            </div>

            <div className="mt-6 bg-cyan-400/10 border border-cyan-300/20 rounded-2xl p-4">
              <p className="font-black text-cyan-200">AI Recommendation</p>
              <p className="text-white/70 mt-1">
                {getAdvice(best)}
              </p>
            </div>
          </div>
        </section>
      )}

      {results.length > 0 && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <h2 className="text-3xl font-black mb-5">Store comparison</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((item) => {
              const score = getScore(item);

              return (
                <div
                  key={item.store}
                  className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xl font-black">{item.store}</p>
                      <p className="text-white/50">{product}</p>
                    </div>

                    <span className={`h-fit px-3 py-1 rounded-full text-xs font-black ${getDecisionColor(score)}`}>
                      {getDecision(score)}
                    </span>
                  </div>

                  <p className="text-4xl font-black mt-5">€{item.price}</p>
                  <p className="line-through text-white/35">€{item.oldPrice}</p>

                  <div className="mt-4 space-y-1 text-sm text-white/65">
                    <p>AI Score: {score}/100</p>
                    <p>Rating: {item.rating}/5</p>
                    <p>Delivery: {item.delivery}</p>
                    <p>Trust: {item.trust}</p>
                    <p>Stock: {item.stock}</p>
                    <p>{getAdvice(item)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black">Future Pro features</h2>
          <p className="text-white/60 mt-2">
            This turns Smart Buy AI into a real tool, not only an affiliate website.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="font-black text-xl">Smart Alerts</h3>
            <p className="text-white/60 mt-2">Notify users when a product becomes a strong buy.</p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="font-black text-xl">Price History</h3>
            <p className="text-white/60 mt-2">Show if the current price is high, normal, or low.</p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
            <h3 className="font-black text-xl">Mobile App</h3>
            <p className="text-white/60 mt-2">Turn this into a PWA and later Android/iOS app.</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-white/40 py-12 mt-20">
        <p>© 2026 Smart Buy AI</p>
        <p className="mt-1">AI shopping advisor prototype. Real product data comes next.</p>
      </footer>
    </main>
  );
}