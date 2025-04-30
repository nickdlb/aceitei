import { ImageProps } from './ImageProps';

export interface CardGalleryProps {
  images: ImageProps[];
  isLoading: boolean;
  sortOrder: string;
  handleSort: (sortBy: string) => void;
}