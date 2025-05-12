import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { supabase } from '@/utils/supabaseClient'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: 'URL inválida.' }, { status: 400 })
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    // Define o tamanho da viewport (tela visível do navegador)
    await page.setViewport({ width: 1280, height: 648 })

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    await new Promise(resolve => setTimeout(resolve, 1000))

    // Tira print da tela visível
    const screenshotBuffer = await page.screenshot();

    await browser.close()

    const fileName = `screenshot-${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('files/screenshots')
      .upload(fileName, screenshotBuffer, {
        contentType: 'image/jpeg'
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('files/screenshots').getPublicUrl(fileName)

    return NextResponse.json({ url: data.publicUrl })
  } catch (err) {
    console.error('Erro ao gerar screenshot:', err)
    return NextResponse.json({ error: 'Erro ao gerar screenshot.' }, { status: 500 })
  }
}
