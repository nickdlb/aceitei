export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    try {
        // Return if already a complete URL
        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        // Build storage URL
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!baseUrl) {
            console.error('NEXT_PUBLIC_SUPABASE_URL não está definido');
            return '';
        }

        // Clean path and ensure correct format
        const cleanPath = imagePath.replace(/^\/*/, '').replace(/\/+/g, '/');
        return `${baseUrl}/storage/v1/object/public/images/${cleanPath}`;
    } catch (error) {
        console.error('Erro ao gerar URL da imagem:', error);
        return '';
    }
};