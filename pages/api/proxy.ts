import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const targetUrl = req.query.url as string

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).send('Parâmetro "url" inválido.')
  }

  try {
    const response = await fetch(targetUrl)

    // Verifica se é HTML
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return res.status(400).send('A URL fornecida não é uma página HTML.')
    }

    let html = await response.text()

    // Remove tags que podem quebrar o iframe
    html = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // remove scripts
      .replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '')
      .replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '')

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro ao clonar o site.')
  }
}
