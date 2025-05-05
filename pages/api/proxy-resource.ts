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
    const isText = contentType.includes('text/') || contentType.includes('application/javascript') || contentType.includes('application/json')
    const isCss =
      contentType.includes('text/css') ||
      targetUrl.endsWith('.css') ||
      targetUrl.includes('.css?')

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')

    // Reescreve CSS para manter url(...) apontando para o proxy
    if (isCss) {
      const base = new URL(targetUrl)
      const rawCss = await response.text()

      const rewrittenCss = rawCss
        .replace(/url\(["']?([^)"']+)["']?\)/gi, (match, urlPath) => {
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
        .replace(/@import\s+url\(["']?([^)"']+)["']?\)/gi, (match, importUrl) => {
          const absoluteUrl = importUrl.startsWith('http') || importUrl.startsWith('//')
            ? importUrl.startsWith('//') ? `https:${importUrl}` : importUrl
            : new URL(importUrl, base).toString()
          return `@import url("/api/proxy-resource?url=${encodeURIComponent(absoluteUrl)}")`
        })

      console.log('[✔️ CSS REWRITTEN]', {
        url: targetUrl,
        sample: rewrittenCss.slice(0, 200)
      })

      return res.send(rewrittenCss)
    }

    // Para outros conteúdos textuais
    if (isText) {
      const rawText = await response.text()
      return res.send(rawText)
    }

    // Para arquivos binários: imagens, fontes, vídeos, etc
    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))

  } catch (err) {
    console.error('❌ Erro no proxy de recurso:', err)
    res.status(500).send('Erro ao buscar o recurso.')
  }
}
