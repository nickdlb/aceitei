import { Image } from '@/types/Image';

interface ImageGalleryProps {
    setIsLoading: (isLoading: boolean) => void;
    isLoading: boolean;
    sortOrder: string;
    searchTerm: string;
    images: Image[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    setIsLoading,
    isLoading,
    sortOrder,
    searchTerm,
    images
}) => {
    // Implement the image gallery logic here
    // This is a placeholder and should be replaced with the actual implementation
    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {/* Render your images here */}
                    {images.map((image) => (
                        <div key={image.id}>{/* Render each image */}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;

