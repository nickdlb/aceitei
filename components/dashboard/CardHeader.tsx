import { Eye, Share2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/common/ui/button';

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
    <div className="relative aspect-video cursor-pointer group" onClick={handleClick}>
      <Image
        src={imageUrl}
        alt={imageTitle || "Imagem"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized
      />
      <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-2 space-y-2 transition-opacity duration-300">
        {notifications > 0 && (
          <div className="!opacity-100 flex items-center justify-center">
            <div className="z-50 size-8 rounded-full text-acbrancohover text-xs flex items-center justify-center bg-acazul">{notifications}</div>
          </div>
        )}
        <Button
          onClick={handleClick}
          variant="ghost"
          size="icon"
          className="p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100"
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
          className="p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100"
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
          className={`p-2 bg-acbgbranco rounded-full shadow-md hover:bg-acazul hover:text-acbrancohover w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};
