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

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState<Product[]>([]);
  const [best, setBest] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<Product[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi, I am Smart Buy AI. Ask me if a product is worth buying.",
    },
  ]);

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

  function getAdvancedAI(item: Product) {
    const score = getDealScore(item);
    const saving = item.oldPrice - item.price;

    if (score >= 85) {
      return `Strong buy signal. This product is €${saving} below usual price and looks close to a strong deal zone.`;
    }

    if (score >= 65) {
      return `Good opportunity. You can buy now if you need it, but Smart Buy AI sees room for a slightly better price.`;
    }

    if (score >= 45) {
      return `Market looks average. Waiting 7 to 14 days may be smarter unless this purchase is urgent.`;
    }

    return `This looks overpriced. Smart Buy AI recommends avoiding this deal until a stronger discount appears.`;
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
    }, 800);
  }

  function quickSearch(productName: string) {
    setQuery(productName);
    setLoading(true);

    setTimeout(() => {
      const filtered = products
        .filter((item) =>
          item.name.toLowerCase().includes(productName.toLowerCase())
        )
        .sort((a, b) => getDealScore(b) - getDealScore(a));

      setResults(filtered);
      setBest(filtered[0] || null);
      setLoading(false);
    }, 700);
  }

  function saveProduct(item: Product) {
    const exists = wishlist.some(
      (p) => p.name === item.name && p.store === item.store
    );

    if (!exists) {
      setWishlist([...wishlist, item]);
    }
  }

  function createAlert(item: Product) {
    const exists = alerts.some(
      (p) => p.name === item.name && p.store === item.store
    );

    if (!exists) {
      setAlerts([...alerts, item]);
    }
  }

  function sendChat() {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: chatInput,
    };

    let aiText =
      "Search for a product first, then I can analyze the best deal for you.";

    if (best) {
      aiText = `For ${best.name}, Smart Buy AI recommends: ${getDecision(
        getDealScore(best)
      )}. Best time: ${getBestTime(
        getDealScore(best)
      )}. ${getAdvancedAI(best)}`;
    }

    const aiMessage: ChatMessage = {
      role: "ai",
      text: aiText,
    };

    setChatMessages([...chatMessages, userMessage, aiMessage]);
    setChatInput("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white p-6">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950" />
        <div className="absolute top-[-120px] left-[-120px] h-[500px] w-[500px] rounded-full bg-indigo-500/30 blur-[120px]" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[600px] w-[600px] rounded-full bg-purple-500/30 blur-[130px]" />
        <div className="absolute top-[30%] left-[35%] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:30px_30px] opacity-20" />
      </div>

      <section className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-10">
          <div className="text-2xl font-black tracking-tight">
            Smart Buy AI
          </div>

          <div className="hidden md:flex gap-6 text-sm text-slate-300">
            <span>AI Deals</span>
            <span>Price Score</span>
            <span>Wishlist</span>
            <span>Price Alerts</span>
          </div>
        </nav>

        <div className="text-center mb-10">
          <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-5 backdrop-blur-xl">
            ⚡ AI Shopping Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-tight">
            Buy smarter. <br />
            <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 text-transparent bg-clip-text">
              Save faster.
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto">
            Compare deals, analyze price quality, save products, create alerts,
            and ask Smart Buy AI when to buy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-5 rounded-2xl">
            <p className="text-slate-300">💰 Estimated Savings</p>
            <h2 className="text-3xl font-bold mt-2">€1,240</h2>
          </div>

          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-5 rounded-2xl">
            <p className="text-slate-300">🤖 AI Deals Found</p>
            <h2 className="text-3xl font-bold mt-2">128</h2>
          </div>

          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-5 rounded-2xl">
            <p className="text-slate-300">🔔 Active Alerts</p>
            <h2 className="text-3xl font-bold mt-2">{alerts.length}</h2>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-2xl mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product: iphone 13, jacket, sofa..."
            className="w-full p-4 rounded-2xl bg-white text-black mb-4 outline-none"
          />

          <div className="flex gap-2 justify-center mb-5 flex-wrap">
            {["All", "Electronics", "Clothing", "Home"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full transition ${
                  category === cat
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
                    : "bg-white/10 text-slate-200 border border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={search}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(99,102,241,0.8)]"
          >
            🔍 Find Best Deal
          </button>

          {loading && (
            <p className="text-center text-indigo-300 animate-pulse mt-4">
              🤖 Smart Buy AI is analyzing prices, timing, and deal quality...
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {["iphone 13", "iphone 15", "jacket", "sofa"].map((item) => (
            <button
              key={item}
              onClick={() => quickSearch(item)}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 text-left hover:bg-white/20 hover:scale-[1.02] transition-all"
            >
              <p className="text-sm text-slate-400">Trending</p>
              <p className="font-bold">{item}</p>
            </button>
          ))}
        </div>

        {best && !loading && (
          <div className="bg-emerald-500/10 border border-emerald-400/40 p-6 rounded-3xl mb-8 shadow-xl">
            <div className="flex justify-between items-start gap-5 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold mb-2">🏆 Best AI Pick</h2>
                <p className="text-xl font-semibold">
                  {best.name} from {best.store}
                </p>
                <p className="text-5xl font-extrabold text-emerald-300 mt-3">
                  €{best.price}
                </p>
                <p className="text-slate-400 line-through">€{best.oldPrice}</p>
              </div>

              <div className="bg-black/30 rounded-3xl p-5 min-w-[180px]">
                <p className="text-sm text-slate-300">AI Score</p>
                <p className="text-4xl font-bold">{getDealScore(best)}/100</p>
                <p className="mt-2 font-semibold">
                  {getDecision(getDealScore(best))}
                </p>
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
                Discount: {getDiscountPercent(best)}% — Save €
                {best.oldPrice - best.price}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-5">
              <div className="bg-white/10 p-4 rounded-2xl">
                ⭐ Rating: {best.rating}/5
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                📦 Delivery: {best.delivery}
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                ⏳ Best time: {getBestTime(getDealScore(best))}
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                🔐 Verified Store
              </div>
            </div>

            <div className="mt-5 bg-yellow-300/20 border border-yellow-300/30 p-4 rounded-2xl">
              <p className="font-bold">📊 AI Alert</p>
              <p className="text-sm text-slate-200">{getAdvancedAI(best)}</p>
            </div>

            <div className="mt-5 flex gap-3 flex-wrap">
              <a
                href={best.link}
                target="_blank"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold"
              >
                View Best Deal
              </a>

              <button
                onClick={() => saveProduct(best)}
                className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-2xl font-bold"
              >
                ❤️ Save
              </button>

              <button
                onClick={() => createAlert(best)}
                className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-2xl font-bold text-black"
              >
                🔔 Notify me
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {results.length > 0 && !loading && (
              <h2 className="text-2xl font-bold mb-4">All Results</h2>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {results.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 p-5 rounded-3xl hover:bg-white/20 hover:scale-[1.02] transition-all"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-xl">{item.store}</p>
                      <p className="text-slate-300">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">€{item.price}</p>
                      <p className="line-through text-slate-400">
                        €{item.oldPrice}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-300 space-y-1">
                    <p>⭐ Rating: {item.rating}/5</p>
                    <p>📦 Delivery: {item.delivery}</p>
                    <p>🧠 AI Score: {getDealScore(item)}/100</p>
                    <p>💰 Discount: {getDiscountPercent(item)}%</p>
                    <p>📉 Price trend: dropping soon</p>
                    <p className="font-bold text-white">
                      {getDecision(getDealScore(item))}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <a
                      href={item.link}
                      target="_blank"
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl font-semibold"
                    >
                      Check Price
                    </a>

                    <button
                      onClick={() => saveProduct(item)}
                      className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-xl font-semibold"
                    >
                      ❤️ Save
                    </button>

                    <button
                      onClick={() => createAlert(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl font-semibold text-black"
                    >
                      🔔 Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {results.length === 0 && !loading && (
              <p className="text-center text-slate-400 mt-10">
                Search for a product to see AI recommendations.
              </p>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl">
              <h2 className="text-xl font-bold mb-3">🤖 AI Shopping Chat</h2>

              <div className="h-56 overflow-y-auto space-y-3 mb-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl text-sm ${
                      msg.role === "ai"
                        ? "bg-indigo-500/20"
                        : "bg-white/20 text-right"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask: should I buy now?"
                  className="flex-1 p-3 rounded-xl bg-white text-black outline-none"
                />
                <button
                  onClick={sendChat}
                  className="bg-indigo-500 px-4 rounded-xl font-bold"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl">
              <h2 className="text-xl font-bold mb-3">❤️ Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-slate-400 text-sm">No saved products yet.</p>
              ) : (
                wishlist.map((item, i) => (
                  <div key={i} className="border-b border-white/10 py-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-300">
                      {item.store} — €{item.price}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl">
              <h2 className="text-xl font-bold mb-3">🔔 Price Alerts</h2>
              {alerts.length === 0 ? (
                <p className="text-slate-400 text-sm">No alerts created yet.</p>
              ) : (
                alerts.map((item, i) => (
                  <div key={i} className="border-b border-white/10 py-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-300">
                      Notify below €{item.price - 20}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        <footer className="mt-20 text-center text-slate-400 text-sm">
          <p>© 2026 Smart Buy AI</p>
          <p className="mt-1">
            AI-powered shopping assistant | Affiliate links may earn commission
          </p>
        </footer>
      </section>
    </main>
  );
}