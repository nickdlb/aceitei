import { EyeIcon, ShareIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import DeleteCardButton from './DeleteCardButton';

interface CardImageProps {
  imageUrl: string;
  imageTitle: string;
  id: string;
  isHovered: boolean;
  isModalOpen: boolean;
  imageLoaded: boolean;
  handleImageLoad: () => void;
  handleShareClick: (e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

export default function CardImage({
  imageUrl,
  imageTitle,
  id,
  isHovered,
  isModalOpen,
  imageLoaded,
  handleImageLoad,
  handleShareClick,
  onDelete,
  handleModalOpen,
  handleModalClose
}: CardImageProps) {
  return (
    <div className="h-48 relative overflow-hidden bg-gray-100">
      <Link href={`/${id}`} target="_blank">
        <img
          src={imageUrl}
          alt={imageTitle}
          className={`w-full h-full object-cover transition-transform duration-200 ${isHovered ? 'transform scale-110' : ''} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={handleImageLoad}
        />
      </Link>
      <div className={`absolute top-4 right-4 flex flex-col gap-2 ${isHovered || isModalOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
        <Link href={`/${id}`} target="_blank" className="bg-white hover:bg-gray-100 p-1 rounded-full" title="Ver">
          <EyeIcon className="h-4 w-4 text-gray-700 hover:text-gray-900" />
        </Link>
        <button onClick={handleShareClick} className="bg-white hover:bg-gray-100 p-1 rounded-full" title="Compartilhar">
          <ShareIcon className="h-4 w-4 text-gray-700 hover:text-gray-900" />
        </button>
        <div className="bg-white rounded-full" title="Excluir">
          <DeleteCardButton id={id} onDelete={onDelete} onModalOpen={handleModalOpen} onModalClose={handleModalClose} />
        </div>
      </div>
    </div>
  );
}