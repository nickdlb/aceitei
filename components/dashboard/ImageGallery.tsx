'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

const ImageGallery: React.FC<ImageGalleryProps> = React.memo(({IsLoading, sortOrder, searchTerm, images}) => {
    const { refreshImages } = useImages();

    const processedImages = useMemo(() => {
        const validImages = images.filter((image): image is {
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

        if (!searchTerm) return sortedImages;

        return sortedImages.filter(image => {
            const searchableTitle = image.imageTitle || image.title || '';
            return searchableTitle.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [images, sortOrder, searchTerm]);

    const handleCardDelete = async (deletedId: string) => {
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

    return (
        <div className="container mx-auto px-1">
            <div className="flex flex-wrap gap-4 justify-start">
                {processedImages.map((page) => (
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
});

export default ImageGallery;
