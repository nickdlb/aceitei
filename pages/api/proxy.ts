import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { URL } from 'url'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const targetUrl = req.query.url as string

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).send('Parâmetro "url" inválido.')
  }

  try {
    const response = await fetch(targetUrl)
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return res.status(400).send('A URL fornecida não é uma página HTML.')
    }

    let html = await response.text()

    // Remove políticas que bloqueiam iframes
    html = html
      .replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '')
      .replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '')

    // Adiciona <base> para suportar caminhos relativos
    html = html.replace(/<head[^>]*>/i, (match) => `${match}\n<base href="${targetUrl}">`)

    // Corrige src, href, srcset
    html = fixRelativeUrlsWithProxy(html, targetUrl)

    // Corrige url(...) em <style> inline
    html = fixInlineStyleUrls(html, targetUrl)

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    console.error('Erro ao clonar o site:', err)
    res.status(500).send('Erro ao clonar o site.')
  }
}

function fixRelativeUrlsWithProxy(html: string, baseUrl: string) {
  const base = new URL(baseUrl)

  // Corrige src, href
  html = html.replace(/(src|href)=["']([^"']+)["']/gi, (match, attr, path) => {
    if (/^(https?:|\/\/)/i.test(path)) {
      const fullUrl = path.startsWith('//') ? `https:${path}` : path
      return `${attr}="/api/proxy-resource?url=${encodeURIComponent(fullUrl)}"`
    } else if (/^(#|mailto:|javascript:)/i.test(path)) {
      return match // não mexe
    } else {
      const absoluteUrl = new URL(path, base).toString()
      return `${attr}="/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}"`
    }
  })

  // Corrige srcset
  html = html.replace(/srcset=["']([^"']+)["']/gi, (match: string, value: string) => {
    const entries = value.split(',').map((entry: string) => {
      const [url, descriptor] = entry.trim().split(' ')
      const absoluteUrl = url.startsWith('http') || url.startsWith('//')
        ? url.startsWith('//') ? `https:${url}` : url
        : new URL(url, base).toString()
      return `/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)} ${descriptor || ''}`.trim()
    })
    return `srcset="${entries.join(', ')}"`
  })

  // Adicional: Corrige @import url(...) inline (em <style>)
  html = html.replace(/@import\s+url\(["']?([^)"']+)["']?\)/gi, (match, urlPath) => {
    const absoluteUrl = urlPath.startsWith('http') || urlPath.startsWith('//')
      ? urlPath.startsWith('//') ? `https:${urlPath}` : urlPath
      : new URL(urlPath, base).toString()
    return `@import url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}")`
  })

  return html
}

function fixInlineStyleUrls(html: string, baseUrl: string) {
  const base = new URL(baseUrl)
  return html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, cssContent) => {
    const rewrittenCss = cssContent.replace(/url\(["']?([^)"']+)["']?\)/gi, (urlMatch: string, urlPath: string) => {
      if (/^(https?:|\/\/|data:)/i.test(urlPath)) {
        const fullUrl = urlPath.startsWith('//') ? `https:${urlPath}` : urlPath
        return `url("/api/proxy-resource?url=${encodeURIComponent(fullUrl)}")`
      }
      const absoluteUrl = new URL(urlPath, base).toString()
      return `url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}")`
    })
    return match.replace(cssContent, rewrittenCss)
  })
}
