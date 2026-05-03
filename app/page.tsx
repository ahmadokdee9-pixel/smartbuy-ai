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
  const [results, setResults] = useState<Product[]>([]);
  const [best, setBest] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const products: Product[] = [
    { name: "iphone 15", store: "Amazon", price: 779, oldPrice: 849, rating: 4.7, link: "https://www.amazon.nl/s?k=iphone+15", category: "Electronics", delivery: "Fast delivery" },
    { name: "iphone 13", store: "Bol.com", price: 509, oldPrice: 569, rating: 4.4, link: "https://www.bol.com/nl/nl/s/?searchtext=iphone+13", category: "Electronics", delivery: "1-2 days" },
    { name: "macbook air", store: "Amazon", price: 999, oldPrice: 1199, rating: 4.8, link: "https://www.amazon.nl/s?k=macbook+air", category: "Electronics", delivery: "Fast delivery" },
    { name: "gaming laptop", store: "MediaMarkt", price: 899, oldPrice: 1099, rating: 4.6, link: "https://www.mediamarkt.nl/nl/search.html?query=gaming%20laptop", category: "Electronics", delivery: "Store pickup" },
    { name: "jacket", store: "Zara", price: 70, oldPrice: 99, rating: 4.2, link: "https://www.zara.com/nl/en/search?searchTerm=jacket", category: "Fashion", delivery: "2-3 days" },
    { name: "sofa", store: "IKEA", price: 299, oldPrice: 349, rating: 4.3, link: "https://www.ikea.com/nl/en/search/?q=sofa", category: "Home", delivery: "Home delivery" },
    { name: "playstation 5", store: "MediaMarkt", price: 449, oldPrice: 549, rating: 4.8, link: "https://www.mediamarkt.nl/nl/search.html?query=playstation%205", category: "Gaming", delivery: "Store pickup" },
    { name: "airpods pro", store: "Bol.com", price: 229, oldPrice: 279, rating: 4.6, link: "https://www.bol.com/nl/nl/s/?searchtext=airpods+pro", category: "Electronics", delivery: "1-2 days" },
    { name: "perfume", store: "Douglas", price: 59, oldPrice: 89, rating: 4.5, link: "https://www.douglas.nl/nl/search?q=perfume", category: "Beauty", delivery: "2-3 days" },
    { name: "gaming headset", store: "Amazon", price: 69, oldPrice: 99, rating: 4.4, link: "https://www.amazon.nl/s?k=gaming+headset", category: "Gaming", delivery: "Fast delivery" },
  ];

  function getDealScore(item: Product) {
    const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;
    return Math.min(Math.round(discount * 2 + item.rating * 10), 100);
  }

  function getDiscount(item: Product) {
    return Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100);
  }

  function getDecision(score: number) {
    if (score >= 85) return "Strong Buy";
    if (score >= 65) return "Good Deal";
    if (score >= 45) return "Wait";
    return "Avoid";
  }

  function getWhy(item: Product) {
    return `Smart Buy AI chose this because it has a strong balance between price, discount, rating, and delivery. You save €${item.oldPrice - item.price} compared with the usual price.`;
  }

  function search() {
    setLoading(true);

    setTimeout(() => {
      const filtered = products
        .filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => getDealScore(b) - getDealScore(a));

      setResults(filtered);
      setBest(filtered[0] || null);
      setLoading(false);
    }, 800);
  }

  function quickSearch(item: string) {
    setQuery(item);
    setLoading(true);

    setTimeout(() => {
      const filtered = products
        .filter((p) => p.name.toLowerCase().includes(item.toLowerCase()))
        .sort((a, b) => getDealScore(b) - getDealScore(a));

      setResults(filtered);
      setBest(filtered[0] || null);
      setLoading(false);
    }, 600);
  }

  function createPriceAlert() {
    if (!email.trim()) {
      setAlertMessage("Please enter your email first.");
      return;
    }

    setAlertMessage("Price alert created. You will be notified when the price drops.");
    setEmail("");
  }

  return (
    <main className="min-h-screen bg-[#070711] text-white overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.35),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.25),transparent_30%),linear-gradient(135deg,#070711,#111827,#1e1b4b)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 blur-[140px] rounded-full" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="font-black text-2xl">Smart Buy AI</div>

        <div className="hidden md:flex gap-6 text-sm text-white/70">
          <span>AI Deals</span>
          <span>Compare</span>
          <span>Pricing</span>
          <span>Alerts</span>
        </div>

        <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">
          Start Free
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full mb-6 backdrop-blur-xl text-sm">
          ✦ AI-powered shopping decision engine
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          Find the smartest way
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent">
            to buy anything.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-white/70 text-lg mb-8">
          Compare stores, analyze deal quality, predict buying timing, and get a clear AI recommendation before spending money.
        </p>

        <div className="max-w-3xl mx-auto bg-black/30 border border-white/15 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask: best gaming laptop under €1000..."
              className="flex-1 bg-white/95 text-black px-5 py-4 rounded-2xl outline-none"
            />

            <button
              onClick={search}
              className="bg-gradient-to-r from-fuchsia-500 to-orange-400 px-7 py-4 rounded-2xl font-black hover:scale-[1.02] transition"
            >
              Analyze
            </button>
          </div>

          {loading && (
            <p className="text-cyan-300 animate-pulse mt-4">
              AI is analyzing stores, prices, trust, and timing...
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 flex-wrap mt-6 text-sm">
          {["iphone 15", "macbook air", "gaming laptop", "sofa", "playstation 5", "airpods pro"].map((item) => (
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

      <section className="max-w-6xl mx-auto px-6 mt-16 grid md:grid-cols-4 gap-4">
        {[
          ["AI Deal Score", "Price + rating + discount"],
          ["Smart Timing", "Buy now or wait"],
          ["Trusted Stores", "Compare store options"],
          ["Price Alerts", "Track future drops"],
        ].map(([title, text]) => (
          <div key={title} className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
            <h3 className="font-black text-lg">{title}</h3>
            <p className="text-white/60 text-sm mt-2">{text}</p>
          </div>
        ))}
      </section>

      {best && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <div className="bg-white/10 border border-white/15 rounded-[32px] p-6 md:p-8 backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-cyan-300 font-bold mb-2">BEST AI PICK</p>
                <h2 className="text-3xl font-black">
                  {best.name} from {best.store}
                </h2>
                <p className="text-5xl font-black text-emerald-300 mt-4">
                  €{best.price}
                </p>
                <p className="line-through text-white/40">€{best.oldPrice}</p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-3xl p-6 min-w-[190px]">
                <p className="text-white/50">AI Score</p>
                <p className="text-5xl font-black">{getDealScore(best)}/100</p>
                <p className="mt-2 text-orange-300 font-bold">
                  {getDecision(getDealScore(best))}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 rounded-2xl p-4">Rating: {best.rating}/5</div>
              <div className="bg-white/10 rounded-2xl p-4">Delivery: {best.delivery}</div>
              <div className="bg-white/10 rounded-2xl p-4">Discount: {getDiscount(best)}%</div>
              <div className="bg-white/10 rounded-2xl p-4">Store: Verified</div>
            </div>

            <div className="mt-6 bg-orange-400/15 border border-orange-300/20 rounded-2xl p-4">
              <p className="font-bold text-orange-200">Why this pick?</p>
              <p className="text-white/75 mt-1">{getWhy(best)}</p>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <a
                href={best.link}
                target="_blank"
                className="inline-block bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black"
              >
                View Deal
              </a>

              <button className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold">
                Save to Wishlist
              </button>
            </div>
          </div>
        </section>
      )}

      {results.length > 0 && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-10">
          <h2 className="text-2xl font-black mb-5">Compare offers</h2>

          <div className="overflow-x-auto bg-white/10 border border-white/10 rounded-3xl">
            <table className="w-full text-left text-sm">
              <thead className="text-white/60 border-b border-white/10">
                <tr>
                  <th className="p-4">Store</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4">Decision</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="p-4 font-bold">{item.store}</td>
                    <td className="p-4 text-white/70">{item.name}</td>
                    <td className="p-4">€{item.price}</td>
                    <td className="p-4">{item.rating}/5</td>
                    <td className="p-4">{getDealScore(item)}/100</td>
                    <td className="p-4 text-orange-300">{getDecision(getDealScore(item))}</td>
                    <td className="p-4">
                      <a
                        href={item.link}
                        target="_blank"
                        className="bg-white text-black px-3 py-2 rounded-xl font-bold"
                      >
                        Check
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black">Popular categories</h2>
          <p className="text-white/60 mt-3">Smart Buy AI is built to expand across all shopping needs.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {["Electronics", "Fashion", "Home", "Gaming", "Beauty", "Sports", "Phones", "Laptops"].map((cat) => (
            <div key={cat} className="bg-white/10 border border-white/10 rounded-3xl p-6 text-center">
              <p className="text-2xl mb-2">✦</p>
              <h3 className="font-black">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-24 grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-3xl font-black">Create a price alert</h2>
          <p className="text-white/60 mt-2">
            Get notified when a product becomes a better deal.
          </p>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 bg-white text-black px-4 py-3 rounded-2xl outline-none"
            />

            <button
              onClick={createPriceAlert}
              className="bg-cyan-400 text-black px-5 py-3 rounded-2xl font-black"
            >
              Notify me
            </button>
          </div>

          {alertMessage && (
            <p className="text-cyan-300 text-sm mt-3">{alertMessage}</p>
          )}
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-3xl font-black">Pro features</h2>
          <ul className="mt-5 space-y-3 text-white/70">
            <li>Advanced AI recommendations</li>
            <li>Price drop alerts</li>
            <li>Wishlist and tracked products</li>
            <li>Best time to buy analysis</li>
            <li>Real store feeds coming soon</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black">Frequently asked questions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {[
            ["Is Smart Buy AI free?", "Yes. Basic comparison is free. Pro features can be added later."],
            ["Are prices real now?", "Currently this is a prototype. Real product feeds and affiliate links will be connected next."],
            ["How does the AI score work?", "It combines price, discount, rating, delivery, and estimated deal timing."],
            ["Can I track price drops?", "Yes. Price alerts are already prepared in the interface and can be connected to email later."],
          ].map(([q, a]) => (
            <div key={q} className="bg-white/10 border border-white/10 rounded-3xl p-6">
              <h3 className="font-black text-lg">{q}</h3>
              <p className="text-white/60 mt-2">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black">Choose your plan</h2>
          <p className="text-white/60 mt-3">Free for basic comparison. Pro for smart shoppers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Free", "€0", "Basic search and deal view."],
            ["Pro", "€9.99", "Advanced AI, alerts, wishlist, and better recommendations."],
            ["Business", "€29", "Bulk checks, market insights, and priority alerts."],
          ].map(([plan, price, text]) => (
            <div key={plan} className={`rounded-3xl p-6 border ${plan === "Pro" ? "bg-gradient-to-br from-fuchsia-500/25 to-orange-400/20 border-orange-300/30 scale-105" : "bg-white/10 border-white/10"}`}>
              <h3 className="text-2xl font-black">{plan}</h3>
              <p className="text-4xl font-black mt-4">{price}</p>
              <p className="text-white/60 mt-2">{text}</p>
              <button className="mt-6 bg-white text-black px-5 py-3 rounded-2xl font-black">
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>

      <button className="fixed bottom-6 right-6 bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white px-5 py-4 rounded-full shadow-2xl font-black">
        AI Chat
      </button>

      <footer className="text-center text-white/40 py-12 mt-20">
        <p>© 2026 Smart Buy AI</p>
        <p className="mt-1">AI-powered shopping assistant | Affiliate links may earn commission</p>
      </footer>
    </main>
  );
}