import { ImageProps } from './ImageProps';

export interface ImageCardProps {
  image: ImageProps;
  onDelete: (id: string, imageUrl?: string) => Promise<void>;
}
