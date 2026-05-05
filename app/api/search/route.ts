import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  if (!process.env.SERPAPI_KEY) {
    return NextResponse.json({ error: "Missing SERPAPI_KEY" }, { status: 500 });
  }

  const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(
    q
  )}&gl=nl&hl=en&api_key=${process.env.SERPAPI_KEY}`;

  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();

  const products = (data.shopping_results || []).slice(0, 12).map((item: any, index: number) => ({
    id: index + 1,
    title: item.title || "Unknown product",
    store: item.source || "Unknown store",
    price: item.extracted_price || 0,
    displayPrice: item.price || "",
    rating: item.rating || "N/A",
    link: item.link || item.product_link || "#",
    image: item.thumbnail || "",
  }));

  return NextResponse.json({ products });
}