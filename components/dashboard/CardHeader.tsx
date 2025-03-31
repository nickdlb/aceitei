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
  notifications: number;
}

export const CardHeader = ({
  imageUrl,
  imageTitle,
  pageId,
  handleShare,
  handleDelete,
  isDeleting,
  imageId,
  notifications
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
        <div className="z-50 size-8 rounded-full text-acbrancohover text-xs flex items-center justify-center bg-acazul">{notifications}</div>
      </div>
      <Image
        src={imageUrl}
        alt={imageTitle || "Imagem"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
      />
      <div className="absolute inset-y-0 right-0 flex pt-7 flex-col items-center justify-center mr-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          onClick={handleClick}
          variant="ghost"
          size="icon"
          className="p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center"
        >
          <Eye className="size-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}
          variant="ghost"
          size="icon"
          className="p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center"
        >
          <Share2 className="size-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(imageId);
          }}
          variant="ghost"
          size="icon"
          disabled={isDeleting}
          className={`p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
