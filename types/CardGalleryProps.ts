import ImageProps from './ImageProps';

export default interface CardGalleryProps {
  images: ImageProps[];
  handleCardDelete: (id: string, imageUrl?: string) => Promise<void>;
  isLoading: boolean;
}