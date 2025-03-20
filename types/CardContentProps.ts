interface CardContentProps {
    title: string;
    created_at: string;
    active_comments: number;
    resolved_comments: number;
    isEditing: boolean;
    setTitle: (title: string) => void;
    handleTitleEdit: () => void;
    setIsEditing: (isEditing: boolean) => void;
}

export default CardContentProps;
