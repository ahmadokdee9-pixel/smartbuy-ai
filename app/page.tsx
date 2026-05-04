"use client";

import { useState } from "react";

type Offer = {
  id: number;
  product: string;
  store: string;
  price: number;
  oldPrice: number;
  rating: number;
  delivery: string;
  trust: "High" | "Medium" | "New";
  link: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [best, setBest] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Offer[]>([]);
  const [alerts, setAlerts] = useState<Offer[]>([]);

  const stores = [
    { store: "Amazon", mod: 0.92, delivery: "Fast", trust: "High", link: "https://www.amazon.nl/s?k=" },
    { store: "Bol.com", mod: 0.95, delivery: "Fast", trust: "High", link: "https://www.bol.com/nl/nl/s/?searchtext=" },
    { store: "MediaMarkt", mod: 1.05, delivery: "Fast", trust: "High", link: "https://www.mediamarkt.nl/nl/search.html?query=" },
    { store: "Coolblue", mod: 0.98, delivery: "Fast", trust: "High", link: "https://www.coolblue.nl/zoeken?query=" },
    { store: "IKEA", mod: 0.88, delivery: "Medium", trust: "Medium", link: "https://www.ikea.com/nl/en/search/?q=" },
    { store: "AliExpress", mod: 0.75, delivery: "Slow", trust: "Medium", link: "https://www.aliexpress.com/wholesale?SearchText=" },
    { store: "Temu", mod: 0.7, delivery: "Slow", trust: "New", link: "https://www.temu.com/search_result.html?search_key=" },
  ] as const;

  function getBasePrice(text: string) {
    const q = text.toLowerCase();

    if (q.includes("iphone")) return 799;
    if (q.includes("laptop") || q.includes("macbook")) return 999;
    if (q.includes("playstation") || q.includes("gaming")) return 499;
    if (q.includes("sofa")) return 349;
    if (q.includes("shoes")) return 119;
    if (q.includes("jacket")) return 89;
    if (q.includes("coffee")) return 299;
    if (q.includes("perfume")) return 79;
    if (q.includes("air fryer")) return 129;

    return 249;
  }

  function generateOffers(searchText: string): Offer[] {
    const base = getBasePrice(searchText);

    return stores.map((s, index) => {
      const price = Math.round(base * s.mod);
      const oldPrice = Math.round(base * 1.15);
      const rating = Number((3.8 + ((index + 1) * 0.13)).toFixed(1));

      return {
        id: index + 1,
        product: searchText,
        store: s.store,
        price,
        oldPrice,
        rating,
        delivery: s.delivery,
        trust: s.trust,
        link: `${s.link}${encodeURIComponent(searchText)}`,
      };
    });
  }

  function getDealScore(item: Offer) {
    const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;

    let score = discount * 2 + item.rating * 10;

    if (item.trust === "High") score += 10;
    if (item.trust === "Medium") score += 5;
    if (item.delivery === "Fast") score += 5;

    if (item.trust === "New") score -= 10;
    if (item.delivery === "Slow") score -= 5;

    return Math.max(0, Math.min(Math.round(score), 100));
  }

  function getDecision(score: number) {
    if (score >= 90) return "🔥 Buy Now";
    if (score >= 75) return "✅ Good Deal";
    if (score >= 60) return "⏳ Wait";
    return "❌ Avoid";
  }

  function getDecisionStyle(score: number) {
    if (score >= 90) return "bg-emerald-400 text-black";
    if (score >= 75) return "bg-cyan-400 text-black";
    if (score >= 60) return "bg-amber-400 text-black";
    return "bg-red-500 text-white";
  }

  function getAdvice(score: number, item: Offer) {
    if (score >= 90) {
      return `This is the best buying option right now. ${item.store} has strong value based on price, trust, delivery and rating.`;
    }

    if (score >= 75) {
      return `Good deal. ${item.store} is safe to buy from, but you may still compare final delivery costs.`;
    }

    if (score >= 60) {
      return `Average price. Waiting may help you get a better price unless you need it urgently.`;
    }

    return `Not recommended now. This offer has weaker value, slower delivery, lower trust, or a better option exists.`;
  }

  function search() {
    if (!query.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const generated = generateOffers(query).sort(
        (a, b) => getDealScore(b) - getDealScore(a)
      );

      setOffers(generated);
      setBest(generated[0]);
      setLoading(false);
    }, 700);
  }

  function quickSearch(text: string) {
    setQuery(text);
    setLoading(true);

    setTimeout(() => {
      const generated = generateOffers(text).sort(
        (a, b) => getDealScore(b) - getDealScore(a)
      );

      setOffers(generated);
      setBest(generated[0]);
      setLoading(false);
    }, 500);
  }

  function saveItem(item: Offer) {
    if (!saved.some((p) => p.store === item.store && p.product === item.product)) {
      setSaved([...saved, item]);
    }
  }

  function createAlert(item: Offer) {
    if (!alerts.some((p) => p.store === item.store && p.product === item.product)) {
      setAlerts([...alerts, item]);
    }
  }

  function scrollToPricing() {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060815] text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(59,130,246,0.26),transparent_32%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.22),transparent_35%),linear-gradient(135deg,#060815,#0f172a,#111827)]" />
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">Smart Buy AI</h1>
          <p className="text-xs text-white/45">AI shopping decision engine</p>
        </div>

        <div className="hidden md:flex gap-6 text-sm text-white/65">
          <button>AI Deals</button>
          <button>Compare</button>
          <button onClick={scrollToPricing}>Pricing</button>
          <button>Alerts</button>
        </div>

        <button
          onClick={scrollToPricing}
          className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm"
        >
          Start Free
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 text-center">
        <div className="inline-flex bg-white/10 border border-white/15 px-4 py-2 rounded-full text-sm mb-7 backdrop-blur-xl">
          ✦ AI-powered price intelligence
        </div>

        <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          Compare every store.
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
            Buy at the right moment.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-white/65 text-lg mb-8">
          Search any product and Smart Buy AI compares stores, prices, trust,
          delivery, and tells you where to buy, wait, or avoid.
        </p>

        <div className="max-w-3xl mx-auto bg-white/10 border border-white/15 backdrop-blur-2xl rounded-[32px] p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
              }}
              placeholder="Search: gaming laptop, iphone 15, sofa, shoes..."
              className="flex-1 bg-white text-black px-5 py-4 rounded-2xl outline-none"
            />

            <button
              onClick={search}
              className="bg-gradient-to-r from-cyan-400 to-violet-500 px-7 py-4 rounded-2xl font-black hover:scale-[1.02] transition"
            >
              Analyze
            </button>
          </div>

          {loading && (
            <p className="mt-4 text-cyan-300 animate-pulse">
              AI is comparing stores, prices, delivery, trust and timing...
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 flex-wrap mt-6 text-sm">
          {[
            "iphone 15",
            "gaming laptop",
            "sofa",
            "shoes",
            "coffee machine",
            "perfume",
            "air fryer",
          ].map((item) => (
            <button
              key={item}
              onClick={() => quickSearch(item)}
              className="bg-white/10 border border-white/10 px-4 py-2 rounded-full hover:bg-white/20"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {best && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <div className="bg-white/10 border border-white/15 rounded-[34px] p-8 backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-cyan-300 font-bold mb-2">
                  BEST PLACE TO BUY
                </p>
                <h2 className="text-4xl font-black">
                  {best.product} from {best.store}
                </h2>
                <p className="text-6xl font-black text-emerald-300 mt-4">
                  €{best.price}
                </p>
                <p className="line-through text-white/40">€{best.oldPrice}</p>
              </div>

              <div className="bg-black/35 border border-white/10 rounded-3xl p-6 min-w-[210px]">
                <p className="text-white/50">AI Score</p>
                <p className="text-5xl font-black">{getDealScore(best)}/100</p>
                <p
                  className={`mt-3 inline-block px-3 py-1 rounded-full font-black ${getDecisionStyle(
                    getDealScore(best)
                  )}`}
                >
                  {getDecision(getDealScore(best))}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 mt-8">
              <div className="bg-white/10 rounded-2xl p-4">
                Rating: {best.rating}/5
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                Delivery: {best.delivery}
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                Trust: {best.trust}
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                Decision: {getDecision(getDealScore(best))}
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                Compared: {offers.length} stores
              </div>
            </div>

            <div className="mt-6 bg-cyan-400/10 border border-cyan-300/20 rounded-2xl p-4">
              <p className="font-black text-cyan-200">AI Recommendation</p>
              <p className="text-white/70 mt-1">
                {getAdvice(getDealScore(best), best)}
              </p>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <a
                href={best.link}
                target="_blank"
                className="bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black"
              >
                Buy from {best.store}
              </a>

              <button
                onClick={() => saveItem(best)}
                className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold"
              >
                Save
              </button>

              <button
                onClick={() => createAlert(best)}
                className="bg-cyan-400 text-black px-6 py-3 rounded-2xl font-black"
              >
                Create Alert
              </button>
            </div>
          </div>
        </section>
      )}

      {offers.length > 0 && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <h2 className="text-3xl font-black mb-5">Stores compared</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {offers.map((item) => {
              const score = getDealScore(item);

              return (
                <div
                  key={item.id}
                  className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xl font-black">{item.store}</p>
                      <p className="text-white/50">{item.product}</p>
                    </div>

                    <span
                      className={`h-fit px-3 py-1 rounded-full text-xs font-black ${getDecisionStyle(
                        score
                      )}`}
                    >
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
                    <p>{getAdvice(score, item)}</p>
                  </div>

                  <div className="flex gap-2 mt-5 flex-wrap">
                    <a
                      href={item.link}
                      target="_blank"
                      className="bg-white text-black px-4 py-2 rounded-xl font-black"
                    >
                      Check
                    </a>

                    <button
                      onClick={() => saveItem(item)}
                      className="bg-white/10 px-4 py-2 rounded-xl font-bold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => createAlert(item)}
                      className="bg-cyan-400 text-black px-4 py-2 rounded-xl font-black"
                    >
                      Alert
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto bg-white/10 border border-white/10 rounded-3xl">
            <table className="w-full text-left text-sm">
              <thead className="text-white/60 border-b border-white/10">
                <tr>
                  <th className="p-4">Store</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Delivery</th>
                  <th className="p-4">Trust</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4">Recommendation</th>
                </tr>
              </thead>

              <tbody>
                {offers.map((item) => (
                  <tr key={item.id} className="border-b border-white/10">
                    <td className="p-4 font-bold">{item.store}</td>
                    <td className="p-4">€{item.price}</td>
                    <td className="p-4">{item.rating}/5</td>
                    <td className="p-4">{item.delivery}</td>
                    <td className="p-4">{item.trust}</td>
                    <td className="p-4">{getDealScore(item)}/100</td>
                    <td className="p-4">{getDecision(getDealScore(item))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 mt-24 grid md:grid-cols-3 gap-5">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h3 className="text-2xl font-black">Saved products</h3>
          <p className="text-white/60 mt-2">{saved.length} saved items</p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h3 className="text-2xl font-black">Price alerts</h3>
          <p className="text-white/60 mt-2">{alerts.length} active alerts</p>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h3 className="text-2xl font-black">Stores ready</h3>
          <p className="text-white/60 mt-2">
            Amazon, Bol, MediaMarkt, Coolblue, IKEA, AliExpress, Temu
          </p>
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black">Simple plans</h2>
          <p className="text-white/60 mt-2">
            Start free. Upgrade for alerts and deeper AI shopping intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Free", "€0", "Basic search and store comparison"],
            ["Pro", "€9.99", "AI recommendations, alerts, wishlist"],
            ["Business", "€29", "Bulk checks and market insights"],
          ].map(([plan, price, text]) => (
            <div
              key={plan}
              className={`rounded-3xl p-6 border ${
                plan === "Pro"
                  ? "bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border-cyan-300/30 scale-105"
                  : "bg-white/10 border-white/10"
              }`}
            >
              <h3 className="text-xl font-black">{plan}</h3>
              <p className="text-4xl font-black mt-3">{price}</p>
              <p className="text-white/60 mt-2 text-sm">{text}</p>
              <button className="mt-5 bg-white text-black px-5 py-3 rounded-2xl font-black">
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-white/40 py-12 mt-20">
        <p>© 2026 Smart Buy AI</p>
        <p className="mt-1">
          Prototype now. Real store feeds and affiliate links will be connected next.
        </p>
      </footer>
    </main>
  );
}