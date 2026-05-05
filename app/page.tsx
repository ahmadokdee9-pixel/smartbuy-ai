"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    setProducts([]);

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    console.log("DATA:", data);

    if (data.products) {
      setProducts(data.products);
    } else {
      alert(data.error || "No data");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Smart Buy AI</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product..."
        style={{ padding: 12, width: 300, marginRight: 10 }}
      />

      <button onClick={search} style={{ padding: 12 }}>
        Search
      </button>

      {loading && <p>Loading...</p>}

      <div style={{ marginTop: 30 }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15 }}>
            {p.image && <img src={p.image} alt={p.title} width={100} />}
            <h3>{p.title}</h3>
            <p>Store: {p.store}</p>
            <p>Price: €{p.price}</p>
            <p>Rating: {p.rating}</p>
            <a href={p.link} target="_blank">View product</a>
          </div>
        ))}
      </div>
    </main>
  );
}