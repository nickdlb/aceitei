import { Eye, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CardHeaderProps {
  imageUrl: string;
  imageTitle?: string | null;
  pageId: string;
  handleShare: () => void;
  handleDelete: (imageId: string) => void;
  isDeleting: boolean;
  imageId: string;
}

export const CardHeader = ({
  imageUrl,
  imageTitle,
  pageId,
  handleShare,
  handleDelete,
  isDeleting,
  imageId,
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
      <div className="absolute top-2 right-2 flex items-center justify-center">
        <div className="z-50 w-7 h-7 rounded-full text-white text-xs flex items-center justify-center bg-blue-700">1</div>
      </div>
      <Image
        src={imageUrl}
        alt={imageTitle || 'Imagem'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
      />
      <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          onClick={handleClick}
          variant="ghost"
          size="icon"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          variant="ghost"
          size="icon"
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(imageId);
          }}
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Trash2 className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
