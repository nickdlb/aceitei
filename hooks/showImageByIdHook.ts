import { useEffect } from 'react';
import loadImageId from '@/utils/loadImageId';

export const ShowImageById = (id: string | string[] | undefined, ExibirImagem: string, setExibirImagem: (url: string) => void) => {
    useEffect(() => {
        const loadImage = async () => {
            try {
                const imageUrl = await loadImageId(id);
                setExibirImagem(imageUrl);
            } catch (error) {
                console.error('Erro ao carregar imagem:', error);
            }
        };

        if (id) {
            loadImage();
        }
    }, [id, setExibirImagem]);
};
