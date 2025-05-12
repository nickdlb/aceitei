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

    // Remove políticas de segurança que bloqueiam iframe
    html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '').replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');

    // Injeta <base> e script interceptador
    html = html.replace(/<head[^>]*>/i, (match) => `${match}
    <base href="${targetUrl}">
    <script>
      let mode = 'navegar';

      window.addEventListener('message', (e) => {
        if (e.data?.type === 'set-mode') {
          mode = e.data.mode;

          // Define cursor geral
          document.body.style.cursor = mode === 'comentar' ? 'crosshair' : '';

          // Força cursor em todos os elementos interativos
          document.querySelectorAll('a, button, [role="button"]').forEach(el => {
            el.style.cursor = mode === 'comentar' ? 'crosshair' : '';
          });
        }
      });

      document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href') || '';

        // Ignora links internos de âncora ou especiais
        if (
          href.startsWith('#') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          anchor.target === '_blank'
        ) return;

        // MODO COMENTAR → bloqueia absolutamente tudo
        if (mode === 'comentar') {
          e.preventDefault();
          return;
        }

        // MODO NAVEGAR → permite links internos ao domínio original
        const fullUrl = new URL(anchor.href, window.location.href);
        // Pega a URL original da query string (de /api/proxy?url=...)
        const currentUrl = new URLSearchParams(window.location.search).get('url');
        const fullUrl = new URL(anchor.getAttribute('href'), currentUrl);
        const baseDomain = currentUrl ? new URL(currentUrl).hostname : '';

        // A URL que o link aponta
        const targetDomain = fullUrl.hostname;

        // Se for domínio diferente → bloqueia
        if (baseDomain && baseDomain !== targetDomain) {
          e.preventDefault();
          window.parent.postMessage({
            type: 'external-link',
            href: fullUrl.href
          }, '*');
          return;
        }


        // Se já estiver proxificado → permite
        if (href.startsWith('/api/proxy?url=')) return;

        // Caso contrário, proxifica e redireciona
        e.preventDefault();
        const proxied = '/api/proxy?url=' + encodeURIComponent(fullUrl.href);
        window.location.href = proxied;
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

  // src, href, data-bg, etc.
  html = html.replace(/<(?!a\s)(\w+)[^>]+?(src|href|data-[^=]+)=["']([^"']+)["']/gi, (match, tag, attr, path) => {
    const isIframe = tag.toLowerCase() === 'iframe';
    if (/^(https?:|\/\/)/i.test(path)) {
      const fullUrl = path.startsWith('//') ? `https:${path}` : path;
      if (isIframe) {
        try {
          if (new URL(fullUrl).hostname !== base.hostname) return match;
        } catch {
          return match;
        }
      }

      return match.replace(`${attr}="${path}"`, `${attr}="/api/proxy-resource?url=${encodeURIComponent(fullUrl)}&originalUrl=${encodeURIComponent(baseUrl)}"`);
    }

    if (/^(#|mailto:|javascript:|tel:)/i.test(path)) return match;

    const absoluteUrl = new URL(path, base).toString();
    return match.replace(`${attr}="${path}"`, `${attr}="/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}"`);
  });

  // Corrige links internos
  html = html.replace(/<a\s+[^>]*href=["']([^"']+)["']/gi, (match: string, path: string) => {
    if (/^(#|mailto:|javascript:|tel:)/i.test(path)) return match;

    const absoluteUrl = path.startsWith('http') || path.startsWith('//')
      ? path.startsWith('//') ? `https:${path}` : path
      : new URL(path, base).toString();

    try {
      if (new URL(absoluteUrl).hostname === base.hostname) {
        return match.replace(`href="${path}"`, `href="/api/proxy?url=${encodeURIComponent(absoluteUrl)}"`);
      }
    } catch {
      return match;
    }

    return match;
  });

  // Corrige <link href="">
  html = html.replace(/<link\s+[^>]*href=["'](https?:\/\/[^"']+)["']/gi, (match, url) => {
    return match.replace(
      url,
      `/api/proxy-resource?url=${encodeURIComponent(url)}&originalUrl=${encodeURIComponent(baseUrl)}`
    );
  });

  // Corrige srcset
  html = html.replace(/srcset=["']([^"']+)["']/gi, (match, value) => {
    const entries = value.split(',').map((entry:string) => {
      const [url, descriptor] = entry.trim().split(' ');
      const absoluteUrl = url.startsWith('http') || url.startsWith('//')
        ? url.startsWith('//') ? `https:${url}` : url
        : new URL(url, base).toString();
      return `/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)} ${descriptor || ''}`.trim();
    });
    return `srcset="${entries.join(', ')}"`;
  });

  // Corrige dados JSON em data-settings (ex: Elementor)
  html = html.replace(/data-settings="([^"]+)"/gi, (match, encoded) => {
    try {
      const decoded = decodeURIComponent(encoded).replace(/&quot;/g, '"');
      const json = JSON.parse(decoded);
      if (json?.background_slideshow_gallery?.length) {
        for (const item of json.background_slideshow_gallery) {
          if (typeof item.url === 'string') {
            item.url = `/api/proxy-resource?url=${encodeURIComponent(item.url)}&originalUrl=${encodeURIComponent(baseUrl)}`;
          }
        }
      }
      const updatedJson = JSON.stringify(json).replace(/"/g, '&quot;');
      return `data-settings="${updatedJson}"`;
    } catch {
      return match;
    }
  });

  // Corrige atributos como data-bg, data-image, etc.
  html = html.replace(/(data-(?:bg|background|image|src))=["']([^"']+)["']/gi, (match, attr, path) => {
    const absoluteUrl = path.startsWith('http') || path.startsWith('//')
      ? path.startsWith('//') ? `https:${path}` : path
      : new URL(path, base).toString();
    return `${attr}="/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}"`;
  });

  // ⚠️ CORREÇÃO DO style="...url(...)..."
  html = html.replace(/style=(["'])(.*?)\1/gi, (match: string, quote: string, content: string) => {
    const newContent = content.replace(/url\(["']?([^)"']+)["']?\)/gi, (_: string, path: string) => {
      const absoluteUrl = path.startsWith('http') || path.startsWith('//')
        ? path.startsWith('//') ? `https:${path}` : path
        : new URL(path, base).toString();
      return `url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}")`;
    });

    // ⚠️ escapa aspas internas para evitar quebra de atributo HTML
    const escapedContent = newContent.replace(/"/g, '&quot;');

    return `style="${escapedContent}"`;
  });

  // Corrige inline JS que contenha "url": "..."
  html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, scriptContent) => {
    const rewritten = scriptContent.replace(/"url"\s*:\s*"([^"]+)"/gi, (m:string, path:string) => {
      if (!path.startsWith('http') && !path.startsWith('//')) return m;
      const absoluteUrl = path.startsWith('//') ? `https:${path}` : path;
      return `"url": "/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}&originalUrl=${encodeURIComponent(baseUrl)}"`;
    });
    return match.replace(scriptContent, rewritten);
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
