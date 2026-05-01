"use client";

import { useState } from "react";

type ProductResult = {
  store: string;
  price: number;
  link?: string;
};

export default function Home() {
  const [product, setProduct] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchPrices() {
    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(product)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
    }

    setLoading(false);
  }

  const cheapest =
    results.length > 0
      ? results.reduce((min, item) => (item.price < min.price ? item : min))
      : null;

  const highest =
    results.length > 0
      ? results.reduce((max, item) => (item.price > max.price ? item : max))
      : null;

  const saving = cheapest && highest ? highest.price - cheapest.price : 0;

  return (
    <main style={{ maxWidth: 700, margin: "60px auto", fontFamily: "Arial", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Smart Buy AI</h1>
      <p style={{ textAlign: "center" }}>Find the best price and the best place to buy.</p>

      <input
        type="text"
        placeholder="Example: jacket"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        style={{
          width: "100%",
          padding: 14,
          marginTop: 20,
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={searchPrices}
        disabled={!product || loading}
        style={{
          width: "100%",
          padding: 14,
          marginTop: 15,
          fontSize: 18,
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Searching..." : "Find Best Price"}
      </button>

      {cheapest && (
        <div
          style={{
            marginTop: 25,
            padding: 20,
            border: "2px solid green",
            borderRadius: 12,
            background: "#f0fff4",
          }}
        >
          <h2>Best Price Now</h2>
          <p>
            <strong>{cheapest.store}</strong>: €{cheapest.price}
          </p>
          <p>🔥 This looks like a good deal.</p>
          <p>
            <strong>You can save €{saving}</strong>
          </p>

          {cheapest.link && (
            <a
              href={cheapest.link}
              target="_blank"
              style={{
                display: "inline-block",
                marginTop: 10,
                padding: "10px 14px",
                background: "green",
                color: "white",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Buy Best Deal
            </a>
          )}

          <hr />

          <h3>Smart Buy AI Recommendation</h3>
          <p>
            Smart Buy AI recommends buying from {cheapest.store}. It is the cheapest option at €
            {cheapest.price}, and you can save €{saving} compared to the highest price.
          </p>
        </div>
      )}

      <div style={{ marginTop: 25 }}>
        {results.map((item, index) => (
          <div
            key={index}
            style={{
              padding: 15,
              marginBottom: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          >
            <strong>{item.store}</strong>: €{item.price}

            {item.link && (
              <div style={{ marginTop: 10 }}>
                <a
                  href={item.link}
                  target="_blank"
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    background: "#0070f3",
                    color: "#fff",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  Buy Now
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}