export const runtime = 'edge';

const UPSTREAMS: Record<string, string> = {
  futures: 'https://fapi.binance.com',
  spot: 'https://api.binance.com',
};

// Proxy stateless ke Binance Public API. Diperlukan karena beberapa ISP
// (mis. Telkomsel) melakukan DNS hijack/cert mismatch terhadap domain
// binance.com, sehingga fetch langsung dari browser gagal. Server Vercel
// menjangkau Binance secara normal.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const host = url.searchParams.get('host');
  const path = url.searchParams.get('path');

  const upstream = host ? UPSTREAMS[host] : undefined;
  if (!upstream || !path) {
    return new Response(JSON.stringify({ error: 'invalid host or path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const query = new URLSearchParams(url.searchParams);
  query.delete('host');
  query.delete('path');
  const qs = query.toString();

  const target = `${upstream}${path}${qs ? `?${qs}` : ''}`;

  const res = await fetch(target, { headers: { Accept: 'application/json' } });
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
