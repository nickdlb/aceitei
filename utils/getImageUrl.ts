export const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    try {

        if (imagePath.startsWith('http')) {
            return imagePath;
        }

        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!baseUrl) {
            console.error('NEXT_PUBLIC_SUPABASE_URL não está definido');
            return '';
        }

        const cleanPath = imagePath.replace(/^\/*/, '').replace(/\/+/g, '/');
        return `${baseUrl}/storage/v1/object/public/images/${cleanPath}`;
    } catch (error) {
        console.error('Erro ao gerar URL da imagem:', error);
        return '';
    }
};
