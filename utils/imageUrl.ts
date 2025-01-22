export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    try {
        // Se já for uma URL completa, retorna ela mesma
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Caso contrário, constrói a URL do storage
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!baseUrl) {
            console.error('NEXT_PUBLIC_SUPABASE_URL não está definido');
            return '';
        }

        // Remover barras extras e garantir o formato correto
        const cleanPath = imagePath.replace(/^\/+/, '').replace(/\/+/g, '/');

        // Log para debug
        console.log('Construindo URL da imagem:', {
            baseUrl,
            imagePath: cleanPath,
            fullUrl: `${baseUrl}/storage/v1/object/public/images/${cleanPath}`
        });

        return `${baseUrl}/storage/v1/object/public/images/${cleanPath}`;
    } catch (error) {
        console.error('Erro ao gerar URL da imagem:', error);
        return '';
    }
}; 