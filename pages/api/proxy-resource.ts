import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
import { URL } from 'url'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const targetUrl = req.query.url as string

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).send('URL inválida.')
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': req.headers['user-agent'] || '',
        'Referer': targetUrl,
      }
    })

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const isCss =
      contentType.includes('text/css') ||
      targetUrl.endsWith('.css') ||
      targetUrl.includes('.css?')

    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Content-Type', contentType)

    if (isCss) {
      const base = new URL(targetUrl)
      const rawCss = await response.text()

      const rewrittenCss = rawCss.replace(/url\(["']?([^)"']+)["']?\)/gi, (match, urlPath) => {
        if (/^(https?:|\/\/|data:)/i.test(urlPath)) {
          const fullUrl = urlPath.startsWith('//') ? `https:${urlPath}` : urlPath
          return `url("/api/proxy-resource?url=${encodeURIComponent(fullUrl)}")`
        }

        try {
          const absoluteUrl = new URL(urlPath, base).toString()
          return `url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}")`
        } catch {
          return match
        }
      })

      console.log('[✔️ CSS REWRITTEN]', {
        url: targetUrl,
        sample: rewrittenCss.slice(0, 200)
      })

      return res.send(rewrittenCss)
    }

    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (err) {
    console.error('❌ Erro no proxy de recurso:', err)
    res.status(500).send('Erro ao buscar o recurso.')
  }
}
