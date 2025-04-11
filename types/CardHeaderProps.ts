export default interface CardHeaderProps {
    imageUrl: string;
    imageTitle: string;
    pageId: string | null;
    handleShare: () => void;
    handleDelete: (e: React.MouseEvent) => void;
    isDeleting: boolean;
}