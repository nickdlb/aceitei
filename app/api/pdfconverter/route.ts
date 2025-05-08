import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';
import { Canvas } from 'canvas';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    // Get the user_id from the request
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Nenhum user_id fornecido' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing GET request:', error);
    return NextResponse.json(
      { error: 'Falha ao processar o GET request', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pdfUrl, documentId } = await request.json();

    // Get the user_id from the request
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!pdfUrl || !documentId) {
      return NextResponse.json(
        { error: 'PDF URL e Document ID são obrigatórios' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Nenhum user_id fornecido' },
        { status: 400 }
      );
    }

    // Fetch the PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    // Convert the response to an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);

    // Carregar o documento PDF
    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    const pdfDocument = await loadingTask.promise;

    const numPages = pdfDocument.numPages;
    const images = [];
    const imageUrls = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      // Criar um canvas para renderizar a página
      const canvas = new Canvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Não foi possível criar o contexto do canvas');
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Renderizar a página no canvas
      await page.render(renderContext).promise;

      // Get image data from the offscreen canvas
      const imageData = context.getImageData(0, 0, viewport.width, viewport.height);

      // Get the PNG data from the canvas
      const imageBuffer = canvas.toBuffer('image/png');

      // Upload the image to Supabase
      const imageName = `${uuidv4()}.png`;
      const { data, error } = await supabase.storage
        .from('files')
        .upload(imageName, imageBuffer, {
          contentType: 'image/png',
        });

      if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
      }
      const imageUrl = `${imageName}`;
      imageUrls.push(imageUrl);

      // Insert image data into the Images table
      const { error: insertError } = await supabase
        .from('pages')
        .insert([{ image_url: imageUrl, document_id: documentId, page_number: pageNum }]);

      if (insertError) {
        throw new Error(`Failed to insert image data: ${insertError.message}`);
      }
    }

    return NextResponse.json({ images: imageUrls });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Falha ao processar o PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
