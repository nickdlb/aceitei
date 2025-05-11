import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { URL } from 'url';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const targetUrlParam = req.nextUrl.searchParams.get('url');
  const originalUrlParam = req.nextUrl.searchParams.get('originalUrl');

  if (!targetUrlParam || !targetUrlParam.startsWith('http')) {
    return new NextResponse('URL inválida.', { status: 400 });
  }

  const targetUrl: string = targetUrlParam;
  const originalUrl: string = originalUrlParam || targetUrl;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': req.headers.get('user-agent') ?? '',
        'Referer': originalUrl,
      },
    });

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const isText = contentType.includes('text/') || contentType.includes('application/javascript') || contentType.includes('application/json');

    const rawContent = await response.text();

    // Heurística mais inteligente para detectar CSS
    const isProbablyCss =
      contentType.includes('text/css') ||
      targetUrl.includes('.css') ||
      /url\(['"]?[^)"']+\.(woff2?|ttf|eot|svg)/i.test(rawContent);

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('Access-Control-Allow-Origin', '*');

    if (isProbablyCss) {
      const base = new URL(targetUrl);

      const rewrittenCss = rawContent
        .replace(/url\(["']?([^)"']+)["']?\)/gi, (match: string, urlPath: string) => {
          if (/^data:/i.test(urlPath)) return match;

          let absoluteUrl: string;
          try {
            absoluteUrl = new URL(urlPath, base).toString();
          } catch {
            return match;
          }

          return `url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(originalUrl)}")`;
        })
        .replace(/@import\s+url\(["']?([^)"']+)["']?\)/gi, (match: string, importUrl: string) => {
          const absoluteUrl = importUrl.startsWith('http') || importUrl.startsWith('//')
            ? importUrl.startsWith('//') ? `https:${importUrl}` : importUrl
            : new URL(importUrl, base).toString();
          return `@import url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(originalUrl)}")`;
        });

      return new NextResponse(rewrittenCss, { status: 200, headers });
    }

    if (isText) {
      return new NextResponse(rawContent, { status: 200, headers });
    }

    const buffer = await fetch(targetUrl).then(res => res.arrayBuffer());
    return new NextResponse(Buffer.from(buffer), { status: 200, headers });

  } catch (err) {
    console.error('❌ Erro no proxy de recurso:', err);
    return new NextResponse('Erro ao buscar o recurso.', { status: 500 });
  }
}
