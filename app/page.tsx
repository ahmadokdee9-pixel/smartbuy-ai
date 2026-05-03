"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  store: string;
  price: number;
  oldPrice: number;
  rating: number;
  link: string;
  category: string;
  delivery: string;
  trust: "High" | "Medium" | "New";
};

type SavedItem = Product;

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [best, setBest] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [alerts, setAlerts] = useState<SavedItem[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatReply, setChatReply] = useState("Ask Smart Buy AI if you should buy now or wait.");
  const [message, setMessage] = useState("");

  const products: Product[] = [
    // Phones
    { id: 1, name: "iphone 15", store: "Amazon", price: 779, oldPrice: 849, rating: 4.7, link: "https://www.amazon.nl/s?k=iphone+15", category: "Phones", delivery: "Fast delivery", trust: "High" },
    { id: 2, name: "iphone 15", store: "Bol.com", price: 799, oldPrice: 879, rating: 4.6, link: "https://www.bol.com/nl/nl/s/?searchtext=iphone+15", category: "Phones", delivery: "1-2 days", trust: "High" },
    { id: 3, name: "iphone 15", store: "MediaMarkt", price: 819, oldPrice: 899, rating: 4.5, link: "https://www.mediamarkt.nl/nl/search.html?query=iphone%2015", category: "Phones", delivery: "Store pickup", trust: "High" },
    { id: 4, name: "samsung galaxy s24", store: "Samsung", price: 699, oldPrice: 849, rating: 4.7, link: "https://www.samsung.com/nl/search/?searchvalue=galaxy%20s24", category: "Phones", delivery: "Official store", trust: "High" },
    { id: 5, name: "samsung galaxy s24", store: "Coolblue", price: 729, oldPrice: 849, rating: 4.6, link: "https://www.coolblue.nl/zoeken?query=samsung%20galaxy%20s24", category: "Phones", delivery: "Next day", trust: "High" },

    // Laptops
    { id: 6, name: "macbook air", store: "Amazon", price: 999, oldPrice: 1199, rating: 4.8, link: "https://www.amazon.nl/s?k=macbook+air", category: "Laptops", delivery: "Fast delivery", trust: "High" },
    { id: 7, name: "macbook air", store: "Coolblue", price: 1049, oldPrice: 1199, rating: 4.8, link: "https://www.coolblue.nl/zoeken?query=macbook%20air", category: "Laptops", delivery: "Next day", trust: "High" },
    { id: 8, name: "gaming laptop", store: "MediaMarkt", price: 899, oldPrice: 1099, rating: 4.6, link: "https://www.mediamarkt.nl/nl/search.html?query=gaming%20laptop", category: "Laptops", delivery: "Store pickup", trust: "High" },
    { id: 9, name: "gaming laptop", store: "Bol.com", price: 949, oldPrice: 1149, rating: 4.4, link: "https://www.bol.com/nl/nl/s/?searchtext=gaming+laptop", category: "Laptops", delivery: "1-2 days", trust: "High" },
    { id: 10, name: "lenovo laptop", store: "Amazon", price: 599, oldPrice: 749, rating: 4.3, link: "https://www.amazon.nl/s?k=lenovo+laptop", category: "Laptops", delivery: "Fast delivery", trust: "High" },

    // Gaming
    { id: 11, name: "playstation 5", store: "MediaMarkt", price: 449, oldPrice: 549, rating: 4.8, link: "https://www.mediamarkt.nl/nl/search.html?query=playstation%205", category: "Gaming", delivery: "Store pickup", trust: "High" },
    { id: 12, name: "playstation 5", store: "Bol.com", price: 469, oldPrice: 549, rating: 4.7, link: "https://www.bol.com/nl/nl/s/?searchtext=playstation+5", category: "Gaming", delivery: "1-2 days", trust: "High" },
    { id: 13, name: "gaming headset", store: "Amazon", price: 69, oldPrice: 99, rating: 4.4, link: "https://www.amazon.nl/s?k=gaming+headset", category: "Gaming", delivery: "Fast delivery", trust: "High" },
    { id: 14, name: "xbox controller", store: "Coolblue", price: 49, oldPrice: 69, rating: 4.5, link: "https://www.coolblue.nl/zoeken?query=xbox%20controller", category: "Gaming", delivery: "Next day", trust: "High" },

    // Fashion
    { id: 15, name: "jacket", store: "Zara", price: 70, oldPrice: 99, rating: 4.2, link: "https://www.zara.com/nl/en/search?searchTerm=jacket", category: "Fashion", delivery: "2-3 days", trust: "High" },
    { id: 16, name: "jacket", store: "H&M", price: 65, oldPrice: 89, rating: 4.1, link: "https://www2.hm.com/nl_nl/search-results.html?q=jacket", category: "Fashion", delivery: "2-4 days", trust: "High" },
    { id: 17, name: "hoodie", store: "Zalando", price: 49, oldPrice: 79, rating: 4.3, link: "https://www.zalando.nl/catalogus/?q=hoodie", category: "Fashion", delivery: "2-4 days", trust: "High" },
    { id: 18, name: "dress", store: "About You", price: 55, oldPrice: 85, rating: 4.2, link: "https://www.aboutyou.nl/s/dress", category: "Fashion", delivery: "2-4 days", trust: "High" },

    // Shoes
    { id: 19, name: "running shoes", store: "Nike", price: 95, oldPrice: 129, rating: 4.5, link: "https://www.nike.com/nl/search?q=running%20shoes", category: "Shoes", delivery: "2-3 days", trust: "High" },
    { id: 20, name: "running shoes", store: "Adidas", price: 89, oldPrice: 130, rating: 4.4, link: "https://www.adidas.nl/search?q=running%20shoes", category: "Shoes", delivery: "2-3 days", trust: "High" },
    { id: 21, name: "sneakers", store: "Zalando", price: 75, oldPrice: 110, rating: 4.3, link: "https://www.zalando.nl/catalogus/?q=sneakers", category: "Shoes", delivery: "2-4 days", trust: "High" },

    // Home
    { id: 22, name: "sofa", store: "IKEA", price: 299, oldPrice: 349, rating: 4.3, link: "https://www.ikea.com/nl/en/search/?q=sofa", category: "Home", delivery: "Home delivery", trust: "High" },
    { id: 23, name: "sofa", store: "Bol.com", price: 329, oldPrice: 399, rating: 4.1, link: "https://www.bol.com/nl/nl/s/?searchtext=sofa", category: "Home", delivery: "1-3 days", trust: "High" },
    { id: 24, name: "desk", store: "IKEA", price: 89, oldPrice: 119, rating: 4.2, link: "https://www.ikea.com/nl/en/search/?q=desk", category: "Home", delivery: "Home delivery", trust: "High" },
    { id: 25, name: "chair", store: "Amazon", price: 79, oldPrice: 119, rating: 4.1, link: "https://www.amazon.nl/s?k=chair", category: "Home", delivery: "Fast delivery", trust: "High" },

    // Beauty
    { id: 26, name: "perfume", store: "Douglas", price: 59, oldPrice: 89, rating: 4.5, link: "https://www.douglas.nl/nl/search?q=perfume", category: "Beauty", delivery: "2-3 days", trust: "High" },
    { id: 27, name: "skincare", store: "Bol.com", price: 29, oldPrice: 45, rating: 4.2, link: "https://www.bol.com/nl/nl/s/?searchtext=skincare", category: "Beauty", delivery: "1-2 days", trust: "High" },
    { id: 28, name: "hair dryer", store: "MediaMarkt", price: 49, oldPrice: 79, rating: 4.2, link: "https://www.mediamarkt.nl/nl/search.html?query=hair%20dryer", category: "Beauty", delivery: "Store pickup", trust: "High" },

    // Sports
    { id: 29, name: "fitness watch", store: "Amazon", price: 129, oldPrice: 179, rating: 4.4, link: "https://www.amazon.nl/s?k=fitness+watch", category: "Sports", delivery: "Fast delivery", trust: "High" },
    { id: 30, name: "football shoes", store: "Nike", price: 89, oldPrice: 130, rating: 4.3, link: "https://www.nike.com/nl/search?q=football%20shoes", category: "Sports", delivery: "2-3 days", trust: "High" },
    { id: 31, name: "home gym set", store: "Decathlon", price: 199, oldPrice: 269, rating: 4.3, link: "https://www.decathlon.nl/search?Ntt=home%20gym", category: "Sports", delivery: "2-4 days", trust: "High" },

    // Kitchen
    { id: 32, name: "coffee machine", store: "Coolblue", price: 299, oldPrice: 399, rating: 4.6, link: "https://www.coolblue.nl/zoeken?query=coffee%20machine", category: "Kitchen", delivery: "Next day", trust: "High" },
    { id: 33, name: "air fryer", store: "Bol.com", price: 89, oldPrice: 129, rating: 4.4, link: "https://www.bol.com/nl/nl/s/?searchtext=air+fryer", category: "Kitchen", delivery: "1-2 days", trust: "High" },
    { id: 34, name: "blender", store: "Amazon", price: 59, oldPrice: 89, rating: 4.2, link: "https://www.amazon.nl/s?k=blender", category: "Kitchen", delivery: "Fast delivery", trust: "High" },

    // Budget stores
    { id: 35, name: "phone case", store: "AliExpress", price: 6, oldPrice: 14, rating: 4.0, link: "https://www.aliexpress.com/wholesale?SearchText=phone+case", category: "Accessories", delivery: "Long delivery", trust: "Medium" },
    { id: 36, name: "usb cable", store: "Temu", price: 4, oldPrice: 10, rating: 4.0, link: "https://www.temu.com/search_result.html?search_key=usb%20cable", category: "Accessories", delivery: "Long delivery", trust: "New" },
  ];

  const categories = ["All", "Phones", "Laptops", "Gaming", "Fashion", "Shoes", "Home", "Beauty", "Sports", "Kitchen", "Accessories"];

  const visibleProducts = useMemo(() => products, []);

  function getDealScore(item: Product) {
    const discount = ((item.oldPrice - item.price) / item.oldPrice) * 100;
    const trustBonus = item.trust === "High" ? 8 : item.trust === "Medium" ? 3 : 0;
    return Math.min(Math.round(discount * 2 + item.rating * 10 + trustBonus), 100);
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

  function findProducts(searchText: string) {
    const q = searchText.toLowerCase().trim();

    if (!q) return [];

    return visibleProducts
      .filter((item) => {
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.store.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => getDealScore(b) - getDealScore(a));
  }

  function search() {
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      const found = findProducts(query);
      setResults(found);
      setBest(found[0] || null);

      if (found.length === 0) {
        setMessage("No exact match found yet. Try: laptop, iphone, sofa, shoes, coffee machine, gaming.");
      }

      setLoading(false);
    }, 700);
  }

  function quickSearch(text: string) {
    setQuery(text);
    setLoading(true);
    setMessage("");

    setTimeout(() => {
      const found = findProducts(text);
      setResults(found);
      setBest(found[0] || null);
      setLoading(false);
    }, 500);
  }

  function saveItem(item: Product) {
    if (!saved.some((p) => p.id === item.id)) {
      setSaved([...saved, item]);
    }
  }

  function createAlert(item: Product) {
    if (!alerts.some((p) => p.id === item.id)) {
      setAlerts([...alerts, item]);
    }
  }

  function askAI() {
    if (!best) {
      setMessage("Ask AI after searching for a product first.");
      return;
    }

    setChatOpen(true);
  }

  function scrollToPricing() {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToCompare() {
    document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" });
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
          <button onClick={scrollToCompare}>Compare</button>
          <button onClick={scrollToPricing}>Pricing</button>
          <button onClick={() => quickSearch("laptop")}>Laptops</button>
          <button onClick={() => quickSearch("phone")}>Phones</button>
        </div>

        <button onClick={scrollToPricing} className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">
          Start Free
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-full mb-6 backdrop-blur-xl text-sm">
          ✦ AI shopping decision engine
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          Find the smartest way
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-orange-300 bg-clip-text text-transparent">
            to buy anything.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-white/70 text-lg mb-8">
          Search a product and Smart Buy AI compares stores, prices, rating, delivery, trust, and buying timing.
        </p>

        <div className="max-w-3xl mx-auto bg-black/30 border border-white/15 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
              }}
              placeholder="Try: laptop, iphone 15, sofa, shoes, coffee machine..."
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
              AI is comparing stores, prices, trust, delivery, and timing...
            </p>
          )}

          {message && <p className="text-orange-200 mt-4">{message}</p>}
        </div>

        <div className="flex justify-center gap-3 flex-wrap mt-6 text-sm">
          {["iphone 15", "laptop", "gaming", "sofa", "shoes", "coffee machine", "perfume", "air fryer"].map((item) => (
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

      <section className="max-w-6xl mx-auto px-6 mt-14 grid md:grid-cols-4 gap-4">
        {[
          ["36+", "Products prepared"],
          ["18+", "Stores included"],
          [saved.length.toString(), "Saved items"],
          [alerts.length.toString(), "Price alerts"],
        ].map(([num, label]) => (
          <div key={label} className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
            <h3 className="text-3xl font-black">{num}</h3>
            <p className="text-white/60 text-sm mt-1">{label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16">
        <h2 className="text-3xl font-black mb-5">Shop by category</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => quickSearch(cat === "All" ? "" : cat)}
              className="bg-white/10 border border-white/10 rounded-3xl p-5 hover:bg-white/20 transition text-left"
            >
              <p className="text-2xl mb-2">✦</p>
              <p className="font-black">{cat}</p>
            </button>
          ))}
        </div>
      </section>

      {best && !loading && (
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <div className="bg-white/10 border border-white/15 rounded-[32px] p-6 md:p-8 backdrop-blur-2xl">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <p className="text-cyan-300 font-bold mb-2">BEST PLACE TO BUY</p>
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

            <div className="grid md:grid-cols-5 gap-4 mt-8">
              <div className="bg-white/10 rounded-2xl p-4">Rating: {best.rating}/5</div>
              <div className="bg-white/10 rounded-2xl p-4">Delivery: {best.delivery}</div>
              <div className="bg-white/10 rounded-2xl p-4">Discount: {getDiscount(best)}%</div>
              <div className="bg-white/10 rounded-2xl p-4">Trust: {best.trust}</div>
              <div className="bg-white/10 rounded-2xl p-4">Category: {best.category}</div>
            </div>

            <div className="mt-6 bg-orange-400/15 border border-orange-300/20 rounded-2xl p-4">
              <p className="font-bold text-orange-200">Why Smart Buy AI picked this</p>
              <p className="text-white/75 mt-1">
                This option has the best combined value based on price, discount, rating, delivery, and store trust.
                You save €{best.oldPrice - best.price} compared with the usual price.
              </p>
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <a href={best.link} target="_blank" className="inline-block bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black">
                View Deal
              </a>

              <button onClick={() => saveItem(best)} className="bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold">
                Save
              </button>

              <button onClick={() => createAlert(best)} className="bg-cyan-400 text-black px-6 py-3 rounded-2xl font-black">
                Create Alert
              </button>

              <button onClick={askAI} className="bg-fuchsia-500 text-white px-6 py-3 rounded-2xl font-black">
                Ask AI
              </button>

              <button onClick={scrollToCompare} className="bg-white text-black px-6 py-3 rounded-2xl font-black">
                Compare All
              </button>
            </div>
          </div>
        </section>
      )}

      {results.length > 0 && !loading && (
        <section id="compare" className="max-w-6xl mx-auto px-6 mt-10">
          <h2 className="text-2xl font-black mb-5">All stores compared</h2>

          <div className="overflow-x-auto bg-white/10 border border-white/10 rounded-3xl">
            <table className="w-full text-left text-sm">
              <thead className="text-white/60 border-b border-white/10">
                <tr>
                  <th className="p-4">Store</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Trust</th>
                  <th className="p-4">AI Score</th>
                  <th className="p-4">Decision</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {results.map((item) => (
                  <tr key={item.id} className="border-b border-white/10">
                    <td className="p-4 font-bold">{item.store}</td>
                    <td className="p-4 text-white/70">{item.name}</td>
                    <td className="p-4 text-white/70">{item.category}</td>
                    <td className="p-4">€{item.price}</td>
                    <td className="p-4">{item.rating}/5</td>
                    <td className="p-4">{item.trust}</td>
                    <td className="p-4">{getDealScore(item)}/100</td>
                    <td className="p-4 text-orange-300">{getDecision(getDealScore(item))}</td>
                    <td className="p-4 flex gap-2">
                      <a href={item.link} target="_blank" className="bg-white text-black px-3 py-2 rounded-xl font-bold">
                        Buy
                      </a>
                      <button onClick={() => saveItem(item)} className="bg-white/10 px-3 py-2 rounded-xl">
                        Save
                      </button>
                      <button onClick={() => createAlert(item)} className="bg-cyan-400 text-black px-3 py-2 rounded-xl">
                        Alert
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 mt-24 grid md:grid-cols-2 gap-6">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-3xl font-black">Saved products</h2>
          {saved.length === 0 ? (
            <p className="text-white/60 mt-3">No saved products yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {saved.map((item) => (
                <div key={item.id} className="bg-black/20 rounded-2xl p-4 flex justify-between">
                  <span>{item.name} — {item.store}</span>
                  <span>€{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/10 border border-white/10 rounded-3xl p-6">
          <h2 className="text-3xl font-black">Price alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-white/60 mt-3">No price alerts yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {alerts.map((item) => (
                <div key={item.id} className="bg-black/20 rounded-2xl p-4 flex justify-between">
                  <span>{item.name} — {item.store}</span>
                  <span>Alert below €{item.price - 20}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-6 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black">Choose your plan</h2>
          <p className="text-white/60 mt-3">Free for basic comparison. Pro for smart shoppers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Free", "€0", "Basic search and deal view."],
            ["Pro", "€9.99", "Advanced AI, alerts, wishlist, and stronger recommendations."],
            ["Business", "€29", "Bulk checks, market insights, and priority alerts."],
          ].map(([plan, price, text]) => (
            <div key={plan} className={`rounded-3xl p-6 border ${plan === "Pro" ? "bg-gradient-to-br from-fuchsia-500/25 to-orange-400/20 border-orange-300/30 scale-105" : "bg-white/10 border-white/10"}`}>
              <h3 className="text-2xl font-black">{plan}</h3>
              <p className="text-4xl font-black mt-4">{price}</p>
              <p className="text-white/60 mt-2">{text}</p>
              <button
                onClick={() => {
                  setMessage(`${plan} selected. Payment integration will be added later.`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-6 bg-white text-black px-5 py-3 rounded-2xl font-black"
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-[330px] bg-[#111827] border border-white/20 rounded-3xl p-5 shadow-2xl z-50">
          <div className="flex justify-between mb-3">
            <h3 className="font-black">Smart Buy AI Chat</h3>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 text-sm text-white/80">
            {best
              ? `For ${best.name}, I recommend: ${getDecision(getDealScore(best))}. Best option: ${best.store} at €${best.price}.`
              : "Search a product first and I will analyze it."}
          </div>
        </div>
      )}

      <button
        onClick={askAI}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white px-5 py-4 rounded-full shadow-2xl font-black"
      >
        AI Chat
      </button>

      <footer className="text-center text-white/40 py-12 mt-20">
        <p>© 2026 Smart Buy AI</p>
        <p className="mt-1">AI-powered shopping assistant | Affiliate links may earn commission</p>
      </footer>
    </main>
  );
}