'use client';

import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import { useImages } from '@/hooks/useImages';
import { Document } from '@/types/Document';

interface ImageGalleryProps {
    StatusValue: () => void;
    IsLoading: boolean;
    sortOrder: string;
    searchTerm: string;
    images: any[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    IsLoading,
    sortOrder,
    searchTerm,
    images
}) => {
    const { refreshImages } = useImages();
    const [localImages, setLocalImages] = useState(images);

    // Atualizar imagens locais quando as props mudarem
    useEffect(() => {
        setLocalImages(images);
    }, [images]);

    const handleCardDelete = async (deletedId: string) => {
        // Atualizar estado local imediatamente
        setLocalImages(prev => prev.filter(img => img.id !== deletedId));
        // Atualizar estado global
        await refreshImages();
    };

    if (IsLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!images || images.length === 0) {
        return (
            <div className="container mx-auto px-4">
                <div className="text-center text-gray-500">
                    Crie seu primeiro card!
                </div>
            </div>
        );
    }

    // Filtrar imagens nulas ou inválidas
    const validImages = localImages.filter((image): image is {
        id: string;
        document_id: string;
        image_url: string;
        imageTitle: string;
        created_at: string;
        page_id: string;
        active_comments: number;
        resolved_comments: number;
        title: string;
    } => {
        return Boolean(image && image.id && (image.image_url || image.url));
    });

    // No início da função de ordenação
    console.log('Valor atual do sortOrder:', sortOrder);
    console.log('Cards antes da ordenação:', validImages);

    // Ordenar imagens
    const sortedImages = [...validImages].sort((a, b) => {
        if (sortOrder === 'date') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortOrder === 'title') {
            const titleA = (a.imageTitle || a.title || '').toLowerCase();
            const titleB = (b.imageTitle || b.title || '').toLowerCase();
            return titleA.localeCompare(titleB);
        }
        return 0;
    });

    console.log('Cards após ordenação:', sortedImages);

    // Filtrar por termo de busca
    const filteredImages = sortedImages.filter(image => {
        if (!searchTerm) return true;
        const searchableTitle = image.imageTitle || image.title || '';
        return searchableTitle.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="container mx-auto px-1">
            <div className="flex flex-wrap gap-4 justify-start">
                {filteredImages.map((page) => (
                    <div key={page.id} className="flex justify-center">
                        <ImageCard
                            image={page}
                            onDelete={handleCardDelete}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
