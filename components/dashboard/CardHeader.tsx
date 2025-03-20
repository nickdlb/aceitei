import { EyeIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';
import CardHeaderProps from '@/types/CardHeaderProps';

export const CardHeader = ({
    imageUrl,
    imageTitle,
    pageId,
    handleShare,
    handleDelete,
    isDeleting
}: CardHeaderProps) => {
    const [isNavigating, setIsNavigating] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isNavigating || !pageId) return;

        setIsNavigating(true);
        window.location.href = `/${pageId}`;
    };

    return (
        <div
            className="relative aspect-video cursor-pointer group"
            onClick={handleClick}
        >
            <Image
                src={imageUrl}
                alt={imageTitle || 'Imagem'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
            />
            <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleClick}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                >
                    <EyeIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                >
                    <ShareIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    <TrashIcon className="w-4 h-4 text-gray-600" />
                </button>
            </div>
        </div>
    );
};
