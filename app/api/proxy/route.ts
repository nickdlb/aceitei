import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { URL } from 'url';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const targetUrlParam = req.nextUrl.searchParams.get('url');

  if (!targetUrlParam || !targetUrlParam.startsWith('http')) {
    return new NextResponse('Parâmetro "url" inválido.', { status: 400 });
  }

  const targetUrl: string = targetUrlParam;

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return new NextResponse('A URL fornecida não é uma página HTML.', { status: 400 });
    }

    let html = await response.text();

    // Remove bloqueios de iframe
    html = html
      .replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '')
      .replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

    // Injeta <base> e <script> para interceptar cliques
    html = html.replace(/<head[^>]*>/i, (match) => `${match}
<base href="${targetUrl}">
<script>
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.target === '_blank') return;

    const fullUrl = new URL(anchor.href);
    if (fullUrl.origin === window.origin || fullUrl.origin === '${new URL(targetUrl).origin}') {
      e.preventDefault();
      const proxied = '/api/proxy?url=' + encodeURIComponent(fullUrl.href);
      window.location.href = proxied;
    }
  });
</script>`);

    html = fixRelativeUrlsWithProxy(html, targetUrl);
    html = fixInlineStyleUrls(html, targetUrl);

    const headers = new Headers();
    headers.set('Content-Type', 'text/html');

    return new NextResponse(html, { status: 200, headers });
  } catch (err) {
    console.error('Erro ao clonar o site:', err);
    return new NextResponse('Erro ao clonar o site.', { status: 500 });
  }
}

function fixRelativeUrlsWithProxy(html: string, baseUrl: string) {
  const base = new URL(baseUrl);

  // Corrige src e href em tags que não sejam <a>
  html = html.replace(/<(?!a\s)(\w+)[^>]+?(src|href)=["']([^"']+)["']/gi, (match: string, tag: string, attr: string, path: string) => {
    if (/^(https?:|\/\/)/i.test(path)) {
      const fullUrl = path.startsWith('//') ? `https:${path}` : path;
      return match.replace(`${attr}="${path}"`, `${attr}="/api/proxy-resource?url=${encodeURIComponent(fullUrl)}&originalUrl=${encodeURIComponent(baseUrl)}"`);
    } else if (/^(#|mailto:|javascript:|tel:)/i.test(path)) {
      return match;
    } else {
      const absoluteUrl = new URL(path, base).toString();
      return match.replace(`${attr}="${path}"`, `${attr}="/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}"`);
    }
  });

  // Corrige apenas <a href="..."> para proxy principal
  html = html.replace(/<a\s+[^>]*href=["']([^"']+)["']/gi, (match: string, path: string) => {
    if (/^(https?:|\/\/)/i.test(path)) {
      const fullUrl = path.startsWith('//') ? `https:${path}` : path;
      return match.replace(`href="${path}"`, `href="/api/proxy?url=${encodeURIComponent(fullUrl)}"`);
    } else if (/^(#|mailto:|javascript:|tel:)/i.test(path)) {
      return match;
    } else {
      const absoluteUrl = new URL(path, base).toString();
      return match.replace(`href="${path}"`, `href="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`);
    }
  });

  // Corrige srcset
  html = html.replace(/srcset=["']([^"']+)["']/gi, (match: string, value: string) => {
    const entries = value.split(',').map((entry: string): string => {
      const [url, descriptor] = entry.trim().split(' ');
      const absoluteUrl = url.startsWith('http') || url.startsWith('//')
        ? url.startsWith('//') ? `https:${url}` : url
        : new URL(url, base).toString();
      return `/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)} ${descriptor || ''}`.trim();
    });
    return `srcset="${entries.join(', ')}"`;
  });

  // Corrige @import
  html = html.replace(/@import\s+url\(["']?([^)"']+)["']?\)/gi, (match: string, urlPath: string) => {
    const absoluteUrl = urlPath.startsWith('http') || urlPath.startsWith('//')
      ? urlPath.startsWith('//') ? `https:${urlPath}` : urlPath
      : new URL(urlPath, base).toString();
    return `@import url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}")`;
  });

  return html;
}

function fixInlineStyleUrls(html: string, baseUrl: string) {
  const base = new URL(baseUrl);
  return html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match: string, cssContent: string) => {
    const rewrittenCss = cssContent
      .replace(/url\(["']?([^)"']+)["']?\)/gi, (urlMatch: string, urlPath: string) => {
        if (/^(https?:|\/\/|data:)/i.test(urlPath)) {
          const fullUrl = urlPath.startsWith('//') ? `https:${urlPath}` : urlPath;
          return `url("/api/proxy-resource?url=${encodeURIComponent(fullUrl)}&originalUrl=${encodeURIComponent(baseUrl)}")`;
        }
        const absoluteUrl = new URL(urlPath, base).toString();
        return `url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}")`;
      })
      .replace(/@import\s+url\(["']?([^)"']+)["']?\)/gi, (match: string, importUrl: string) => {
        const absoluteUrl = importUrl.startsWith('http') || importUrl.startsWith('//')
          ? importUrl.startsWith('//') ? `https:${importUrl}` : importUrl
          : new URL(importUrl, base).toString();
        return `@import url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}")`;
      });

    return match.replace(cssContent, rewrittenCss);
  });
}
