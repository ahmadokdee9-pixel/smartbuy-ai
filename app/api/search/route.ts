export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  const results = [
    {
      store: "Amazon",
      price: Math.floor(Math.random() * 300) + 200,
      link: `https://www.amazon.nl/s?k=${encodeURIComponent(query)}`,
    },
    {
      store: "Bol.com",
      price: Math.floor(Math.random() * 300) + 180,
      link: `https://www.bol.com/nl/nl/s/?searchtext=${encodeURIComponent(query)}`,
    },
    {
      store: "MediaMarkt",
      price: Math.floor(Math.random() * 300) + 190,
      link: `https://www.mediamarkt.nl/nl/search.html?query=${encodeURIComponent(query)}`,
    },
  ];

  return Response.json(results);
}