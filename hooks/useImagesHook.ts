'use client';

import { useState, useEffect } from 'react'
import { fetchImages } from '../utils/supaImages'

interface Image {
  id: string;
  image_url: string;
  updated_at: string;
  marks_num: number;
}

export const useImages = () => {
  const [images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getImages = async () => {
      console.log('🔍 Iniciando busca de imagens...')
      
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchImages()
        
        console.log('📦 Dados recebidos do Supabase:', data)
        
        if (data) {
          setImages(data)
          console.log('✅ Estado atualizado com imagens:', {
            quantidade: data.length,
            imagens: data
          })
        } else {
          setImages([])
          console.log('⚠️ Nenhuma imagem encontrada')
        }
      } catch (err) {
        console.error('❌ Erro ao buscar imagens:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch images')
        setImages([])
      } finally {
        setIsLoading(false)
        console.log('🏁 Busca finalizada')
      }
    }
    
    getImages()
  }, [])

  // Log quando o estado de images muda
  useEffect(() => {
    console.log('🔄 Estado atual de images:', images)
  }, [images])

  return { images, isLoading, error }
}
