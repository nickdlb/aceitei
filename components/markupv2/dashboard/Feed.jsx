'use client';
import ImageCard from '@/components/markup/dashboard/Card';
import { useImages } from '@/hooks/useImages';

const ImageFeed = () => {
  const { images } = useImages();

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageCard key={image.id} marksNum={image.marks_num} />
      ))}
    </div>
  );
};

// Este é o componente que você importa nas páginas
export default ImageFeed;
