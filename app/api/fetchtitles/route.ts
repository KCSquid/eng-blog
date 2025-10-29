import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const urls: string[] = Array.isArray(body?.urls) ? body.urls : [];

    const fetchTitle = async (url: string): Promise<[string, string]> => {
      try {
        const res = await fetch(url, { method: "GET" });
        const text = await res.text();
        const m = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = m ? m[1].trim() : url;
        return [url, title];
      } catch {
        return [url, url];
      }
    };

    const results = await Promise.all(urls.map((u) => fetchTitle(u)));
    const titles: Record<string, string> = {};
    results.forEach(([url, title]) => {
      titles[url] = title;
    });

    return NextResponse.json({ titles });
  } catch (err) {
    return NextResponse.json({ titles: {} }, { status: 500 });
  }
}
