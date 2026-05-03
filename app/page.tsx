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
      text: "Ask me if a product is worth buying, when to buy, or which deal is better.",
    },
  ]);

  const products: Product[] = [
    // Electronics
    { name: "iphone 13", store: "Amazon", price: 489, oldPrice: 549, rating: 4.5, link: "https://www.amazon.nl/s?k=iphone+13", category: "Electronics", delivery: "Fast delivery" },
    { name: "iphone 13", store: "Bol.com", price: 509, oldPrice: 569, rating: 4.4, link: "https://www.bol.com/nl/nl/s/?searchtext=iphone+13", category: "Electronics", delivery: "1-2 days" },
    { name: "iphone 15", store: "Amazon", price: 779, oldPrice: 849, rating: 4.7, link: "https://www.amazon.nl/s?k=iphone+15", category: "Electronics", delivery: "Fast delivery" },
    { name: "samsung galaxy s24", store: "MediaMarkt", price: 699, oldPrice: 799, rating: 4.6, link: "https://www.mediamarkt.nl/nl/search.html?query=samsung%20galaxy%20s24", category: "Electronics", delivery: "Store pickup" },
    { name: "macbook air", store: "Amazon", price: 999, oldPrice: 1199, rating: 4.8, link: "https://www.amazon.nl/s?k=macbook+air", category: "Electronics", delivery: "Fast delivery" },
    { name: "airpods pro", store: "Bol.com", price: 229, oldPrice: 279, rating: 4.6, link: "https://www.bol.com/nl/nl/s/?searchtext=airpods+pro", category: "Electronics", delivery: "1-2 days" },

    // Fashion
    { name: "jacket", store: "Zara", price: 70, oldPrice: 99, rating: 4.2, link: "https://www.zara.com/nl/en/search?searchTerm=jacket", category: "Fashion", delivery: "2-3 days" },
    { name: "jacket", store: "H&M", price: 65, oldPrice: 89, rating: 4.1, link: "https://www2.hm.com/nl_nl/search-results.html?q=jacket", category: "Fashion", delivery: "2-4 days" },
    { name: "shoes", store: "Nike", price: 95, oldPrice: 129, rating: 4.4, link: "https://www.nike.com/nl/search?q=shoes", category: "Fashion", delivery: "2-3 days" },
    { name: "hoodie", store: "Zalando", price: 49, oldPrice: 79, rating: 4.3, link: "https://www.zalando.nl/catalogus/?q=hoodie", category: "Fashion", delivery: "2-4 days" },

    // Home
    { name: "sofa", store: "IKEA", price: 299, oldPrice: 349, rating: 4.3, link: "https://www.ikea.com/nl/en/search/?q=sofa", category: "Home", delivery: "Home delivery" },
    { name: "desk", store: "IKEA", price: 89, oldPrice: 119, rating: 4.2, link: "https://www.ikea.com/nl/en/search/?q=desk", category: "Home", delivery: "Home delivery" },
    { name: "chair", store: "Bol.com", price: 75, oldPrice: 110, rating: 4.1, link: "https://www.bol.com/nl/nl/s/?searchtext=chair", category: "Home", delivery: "1-2 days" },
    { name: "lamp", store: "IKEA", price: 35, oldPrice: 49, rating: 4.0, link: "https://www.ikea.com/nl/en/search/?q=lamp", category: "Home", delivery: "Home delivery" },

    // Beauty
    { name: "perfume", store: "Douglas", price: 59, oldPrice: 89, rating: 4.5, link: "https://www.douglas.nl/nl/search?q=perfume", category: "Beauty", delivery: "2-3 days" },
    { name: "skincare", store: "Bol.com", price: 29, oldPrice: 45, rating: 4.2, link: "https://www.bol.com/nl/nl/s/?searchtext=skincare", category: "Beauty", delivery: "1-2 days" },

    // Sports
    { name: "fitness watch", store: "Amazon", price: 129, oldPrice: 179, rating: 4.4, link: "https://www.amazon.nl/s?k=fitness+watch", category: "Sports", delivery: "Fast delivery" },
    { name: "football shoes", store: "Nike", price: 89, oldPrice: 130, rating: 4.3, link: "https://www.nike.com/nl/search?q=football+shoes", category: "Sports", delivery: "2-3 days" },

    // Gaming
    { name: "playstation 5", store: "MediaMarkt", price: 449, oldPrice: 549, rating: 4.8, link: "https://www.mediamarkt.nl/nl/search.html?query=playstation%205", category: "Gaming", delivery: "Store pickup" },
    { name: "gaming headset", store: "Amazon", price: 69, oldPrice: 99, rating: 4.4, link: "https://www.amazon.nl/s?k=gaming+headset", category: "Gaming", delivery: "Fast delivery" },
  ];

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Gaming",
  ];

  const trending = [
    "iphone 15",
    "macbook air",
    "airpods pro",
    "jacket",
    "playstation 5",
    "sofa",
    "perfume",
    "gaming headset",
  ];

  function getDealScore(item: Product) {
    const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;
    return Math.min(Math.round(discount * 2 + item.rating * 10), 100);
  }

  function getDiscountPercent(item: Product) {
    return Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
  }

  function getDecision(score: number) {
    if (score >= 85) return "Strong Buy";
    if (score >= 65) return "Good Deal";
    if (score >= 45) return "Wait";
    return "Avoid";
  }

  function getDecisionColor(score: number) {
    if (score >= 85) return "text-emerald-300";
    if (score >= 65) return "text-sky-300";
    if (score >= 45) return "text-amber-300";
    return "text-red-300";
  }

  function getBestTime(score: number) {
    if (score >= 85) return "Buy today";
    if (score >= 65) return "This week";
    if (score >= 45) return "Wait 7-14 days";
    return "Wait for a discount";
  }

  function getAdvancedAI(item: Product) {
    const score = getDealScore(item);
    const saving = item.oldPrice - item.price;

    if (score >= 85) {
      return `Strong buy signal. You save €${saving}, the rating is high, and this deal looks close to a premium buying opportunity.`;
    }

    if (score >= 65) {
      return `Good value. This is a reasonable deal now, but Smart Buy AI still sees a chance for a slightly better price.`;
    }

    if (score >= 45) {
      return `Average price zone. Waiting a few days may be better unless you need this product urgently.`;
    }

    return `Weak deal signal. The discount is not attractive compared with the usual price. Waiting is recommended.`;
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
    }, 700);
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
    }, 600);
  }

  function saveProduct(item: Product) {
    const exists = wishlist.some(
      (p) => p.name === item.name && p.store === item.store
    );

    if (!exists) setWishlist([...wishlist, item]);
  }

  function createAlert(item: Product) {
    const exists = alerts.some(
      (p) => p.name === item.name && p.store === item.store
    );

    if (!exists) setAlerts([...alerts, item]);
  }

  function sendChat() {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      text: chatInput,
    };

    let aiText =
      "Search for a product first, then I can explain the deal score and best buying time.";

    if (best) {
      aiText = `${best.name} from ${best.store}: ${getDecision(
        getDealScore(best)
      )}. Best time: ${getBestTime(getDealScore(best))}. ${getAdvancedAI(best)}`;
    }

    setChatMessages([...chatMessages, userMessage, { role: "ai", text: aiText }]);
    setChatInput("");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A12] text-white p-6 font-sans">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#070A12_0%,#10172A_45%,#111827_100%)]" />
        <div className="absolute top-[-120px] left-[-80px] h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[130px]" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute top-[25%] left-[45%] h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:34px_34px] opacity-25" />
      </div>

      <section className="max-w-7xl mx-auto">
        <nav className="flex justify-between items-center mb-12">
          <div>
            <div className="text-2xl font-black tracking-tight">
              Smart Buy AI
            </div>
            <p className="text-xs text-slate-400">AI Shopping Intelligence</p>
          </div>

          <div className="hidden md:flex gap-6 text-sm text-slate-300">
            <span className="hover:text-white">AI Deals</span>
            <span className="hover:text-white">Price Score</span>
            <span className="hover:text-white">Wishlist</span>
            <span className="hover:text-white">Alerts</span>
          </div>
        </nav>

        <div className="text-center mb-10">
          <div className="inline-block bg-white/8 border border-white/15 px-4 py-2 rounded-full text-sm mb-5 backdrop-blur-xl text-slate-200">
            ✦ AI-powered shopping assistant
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight tracking-tight">
            Buy smarter.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 text-transparent bg-clip-text">
              Decide faster.
            </span>
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Compare products, analyze deal quality, track prices, save favorites,
            and ask Smart Buy AI when to buy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.07] border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
            <p className="text-slate-400 text-sm">Estimated user savings</p>
            <h2 className="text-3xl font-black mt-2">€1,240</h2>
          </div>

          <div className="bg-white/[0.07] border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
            <p className="text-slate-400 text-sm">AI deals analyzed</p>
            <h2 className="text-3xl font-black mt-2">128</h2>
          </div>

          <div className="bg-white/[0.07] border border-white/10 backdrop-blur-xl p-5 rounded-3xl">
            <p className="text-slate-400 text-sm">Active price alerts</p>
            <h2 className="text-3xl font-black mt-2">{alerts.length}</h2>
          </div>
        </div>

        <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/15 p-6 rounded-[28px] shadow-2xl mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: iPhone, laptop, shoes, sofa, perfume..."
            className="w-full p-4 rounded-2xl bg-[#F8FAFC] text-slate-950 mb-5 outline-none shadow-inner"
          />

          <div className="flex gap-2 justify-center mb-5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  category === cat
                    ? "bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-400/20"
                    : "bg-white/[0.07] text-slate-300 border border-white/10 hover:bg-white/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={search}
            className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-white px-6 py-4 rounded-2xl font-black transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(56,189,248,0.35)]"
          >
            Analyze Best Deal
          </button>

          {loading && (
            <p className="text-center text-cyan-300 animate-pulse mt-4">
              Smart Buy AI is analyzing price, timing, trust, and value...
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-slate-200">Trending searches</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {trending.map((item) => (
              <button
                key={item}
                onClick={() => quickSearch(item)}
                className="bg-white/[0.07] border border-white/10 rounded-2xl p-4 text-left hover:bg-white/[0.12] hover:scale-[1.02] transition-all"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wide">Trending</p>
                <p className="font-bold mt-1">{item}</p>
              </button>
            ))}
          </div>
        </div>

        {best && !loading && (
          <div className="bg-gradient-to-br from-emerald-500/15 to-cyan-500/10 border border-emerald-400/30 p-6 rounded-[28px] mb-8 shadow-xl">
            <div className="flex justify-between items-start gap-5 flex-wrap">
              <div>
                <h2 className="text-2xl font-black mb-2">Best AI Pick</h2>
                <p className="text-xl font-semibold">
                  {best.name} from {best.store}
                </p>
                <p className="text-5xl font-black text-emerald-300 mt-3">
                  €{best.price}
                </p>
                <p className="text-slate-400 line-through">€{best.oldPrice}</p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-3xl p-5 min-w-[180px]">
                <p className="text-sm text-slate-400">AI Score</p>
                <p className="text-4xl font-black">{getDealScore(best)}/100</p>
                <p className={`mt-2 font-bold ${getDecisionColor(getDealScore(best))}`}>
                  {getDecision(getDealScore(best))}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="bg-white/15 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-cyan-300 h-3 rounded-full"
                  style={{ width: `${getDiscountPercent(best)}%` }}
                />
              </div>
              <p className="text-sm mt-2 text-slate-300">
                Discount: {getDiscountPercent(best)}% — Save €
                {best.oldPrice - best.price}
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-5">
              <div className="bg-white/[0.08] p-4 rounded-2xl">Rating: {best.rating}/5</div>
              <div className="bg-white/[0.08] p-4 rounded-2xl">Delivery: {best.delivery}</div>
              <div className="bg-white/[0.08] p-4 rounded-2xl">Best time: {getBestTime(getDealScore(best))}</div>
              <div className="bg-white/[0.08] p-4 rounded-2xl">Verified store</div>
            </div>

            <div className="mt-5 bg-amber-300/15 border border-amber-300/20 p-4 rounded-2xl">
              <p className="font-bold text-amber-200">AI Market Alert</p>
              <p className="text-sm text-slate-200 mt-1">{getAdvancedAI(best)}</p>
            </div>

            <div className="mt-5 flex gap-3 flex-wrap">
              <a
                href={best.link}
                target="_blank"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-6 py-3 rounded-2xl font-black"
              >
                View Best Deal
              </a>

              <button
                onClick={() => saveProduct(best)}
                className="bg-white/[0.10] border border-white/15 hover:bg-white/[0.18] px-6 py-3 rounded-2xl font-bold"
              >
                Save
              </button>

              <button
                onClick={() => createAlert(best)}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-6 py-3 rounded-2xl font-black"
              >
                Create Alert
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {results.length > 0 && !loading && (
              <h2 className="text-2xl font-black mb-4">All Results</h2>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {results.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/[0.07] border border-white/10 p-5 rounded-3xl hover:bg-white/[0.12] hover:scale-[1.01] transition-all"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-black text-xl">{item.store}</p>
                      <p className="text-slate-400">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black">€{item.price}</p>
                      <p className="line-through text-slate-500">€{item.oldPrice}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-300 space-y-1">
                    <p>Rating: {item.rating}/5</p>
                    <p>Delivery: {item.delivery}</p>
                    <p>AI Score: {getDealScore(item)}/100</p>
                    <p>Discount: {getDiscountPercent(item)}%</p>
                    <p>Price trend: monitored</p>
                    <p className={`font-bold ${getDecisionColor(getDealScore(item))}`}>
                      {getDecision(getDealScore(item))}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <a
                      href={item.link}
                      target="_blank"
                      className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-xl font-bold"
                    >
                      Check Price
                    </a>

                    <button
                      onClick={() => saveProduct(item)}
                      className="bg-white/[0.10] border border-white/15 hover:bg-white/[0.18] px-4 py-2 rounded-xl font-bold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => createAlert(item)}
                      className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-4 py-2 rounded-xl font-black"
                    >
                      Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {results.length === 0 && !loading && (
              <p className="text-center text-slate-500 mt-10">
                Search for a product to see AI recommendations.
              </p>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white/[0.07] border border-white/10 p-5 rounded-3xl">
              <h2 className="text-xl font-black mb-3">AI Shopping Chat</h2>

              <div className="h-56 overflow-y-auto space-y-3 mb-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "bg-cyan-500/10 border border-cyan-400/10"
                        : "bg-white/[0.12] text-right"
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
                  className="flex-1 p-3 rounded-xl bg-white text-slate-950 outline-none"
                />
                <button
                  onClick={sendChat}
                  className="bg-cyan-400 text-slate-950 px-4 rounded-xl font-black"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="bg-white/[0.07] border border-white/10 p-5 rounded-3xl">
              <h2 className="text-xl font-black mb-3">Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-slate-500 text-sm">No saved products yet.</p>
              ) : (
                wishlist.map((item, i) => (
                  <div key={i} className="border-b border-white/10 py-2">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-slate-400">
                      {item.store} — €{item.price}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white/[0.07] border border-white/10 p-5 rounded-3xl">
              <h2 className="text-xl font-black mb-3">Price Alerts</h2>
              {alerts.length === 0 ? (
                <p className="text-slate-500 text-sm">No alerts created yet.</p>
              ) : (
                alerts.map((item, i) => (
                  <div key={i} className="border-b border-white/10 py-2">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-slate-400">
                      Notify below €{item.price - 20}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        <footer className="mt-20 text-center text-slate-500 text-sm">
          <p>© 2026 Smart Buy AI</p>
          <p className="mt-1">
            AI-powered shopping assistant | Affiliate links may earn commission
          </p>
        </footer>
      </section>
    </main>
  );
}