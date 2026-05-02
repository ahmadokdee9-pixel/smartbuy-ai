export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  function generateAffiliateLink(originalUrl: string) {
    const AWIN_ID = "2878975";
    return `https://www.awin1.com/cread.php?awinaffid=${AWIN_ID}&p=${encodeURIComponent(originalUrl)}`;
  }

  const results = [
    {
      store: "Amazon",
      price: Math.floor(Math.random() * 300) + 100,
      link: generateAffiliateLink(
        `https://www.amazon.nl/s?k=${encodeURIComponent(query)}`
      ),
    },
    {
      store: "Bol.com",
      price: Math.floor(Math.random() * 300) + 90,
      link: generateAffiliateLink(
        `https://www.bol.com/nl/nl/s/?searchtext=${encodeURIComponent(query)}`
      ),
    },
    {
      store: "MediaMarkt",
      price: Math.floor(Math.random() * 300) + 110,
      link: generateAffiliateLink(
        `https://www.mediamarkt.nl/nl/search.html?query=${encodeURIComponent(query)}`
      ),
    },
  ];

  return Response.json(results);
}