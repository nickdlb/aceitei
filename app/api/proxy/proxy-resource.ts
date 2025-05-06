import { NextRequest, NextResponse } from 'next/server'
import fetch from 'node-fetch'
import { URL } from 'url'

export async function handler(req: NextRequest, res: any) {
  const targetUrl = req.nextUrl.searchParams.get('url');

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return new NextResponse('URL inválida.', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': req.headers.get('user-agent') || '',
        'Referer': targetUrl,
      }
    })

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const isText = contentType.includes('text/') || contentType.includes('application/javascript') || contentType.includes('application/json');
    const isCss =
      contentType.includes('text/css') ||
      targetUrl.endsWith('.css') ||
      targetUrl.includes('.css?');

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=86400');

    // Reescreve CSS para manter url(...) apontando para o proxy
    if (isCss) {
      const base = new URL(targetUrl);
      const rawCss = await response.text();

      const rewrittenCss = rawCss
        .replace(/url\(["']?([^)"']+)["']?\)/gi, (match, urlPath) => {
          if (/^(https?:|\/\/|data:)/i.test(urlPath)) {
            const fullUrl = urlPath.startsWith('//') ? `https:${urlPath}` : urlPath;
            return `url("/api/proxy-resource?url=${encodeURIComponent(fullUrl)}")`;
          }

          try {
            const absoluteUrl = new URL(urlPath, base).toString();
            return `url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}")`;
          } catch {
            return match;
          }
        })
        .replace(/@import\s+url\(["']?([^)"']+)["']?\)/gi, (match, importUrl) => {
          const absoluteUrl = importUrl.startsWith('http') || importUrl.startsWith('//')
            ? importUrl.startsWith('//') ? `https:${importUrl}` : importUrl
            : new URL(importUrl, base).toString();
          return `@import url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}")`;
        });

      console.log('[✔️ CSS REWRITTEN]', {
        url: targetUrl,
        sample: rewrittenCss.slice(0, 200)
      });

      return new NextResponse(rewrittenCss, { status: 200, headers });
    }

    // Para outros conteúdos textuais
    if (isText) {
      const rawText = await response.text();
      return new NextResponse(rawText, { status: 200, headers });
    }

    // Para arquivos binários: imagens, fontes, vídeos, etc
    const buffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), { status: 200, headers });

  } catch (err) {
    console.error('❌ Erro no proxy de recurso:', err);
    return new NextResponse('Erro ao buscar o recurso.', { status: 500 });
  }
}
