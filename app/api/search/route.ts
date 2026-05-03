export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  const encoded = encodeURIComponent(query);

  const results = [
    {
      store: "Amazon",
      price: "Check price",
      link: `https://www.amazon.nl/s?k=${encoded}`,
    },
    {
      store: "Bol.com",
      price: "Check price",
      link: `https://www.bol.com/nl/nl/s/?searchtext=${encoded}`,
    },
    {
      store: "MediaMarkt",
      price: "Check price",
      link: `https://www.mediamarkt.nl/nl/search.html?query=${encoded}`,
    },
  ];

  return Response.json(results);
}