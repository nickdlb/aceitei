interface CardHeaderProps {
    imageUrl: string;
    imageTitle: string;
    pageId: string | null;
    handleShare: () => void;
    handleDelete: (e: React.MouseEvent) => void;
    isDeleting: boolean;
}

export default CardHeaderProps;
