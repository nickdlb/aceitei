export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
  
    try {
      // URL completa
      if (imagePath.startsWith('http')) return imagePath;
  
      const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definido');
      }
  
      const cleanedPath = imagePath.replace(/^\/+/, '').replace(/\/+/g, '/');
  
      return `${baseUrl}/storage/v1/object/public/files/${cleanedPath}`;
    } catch (err) {
      console.error('Erro ao gerar URL da imagem:', err);
      return '';
    }
  };
  