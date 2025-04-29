export interface CardContentProps {
    title: string;
    isEditing: boolean;
    setTitle: (title: string) => void;
    handleTitleEdit: () => void;
    setIsEditing: (editing: boolean) => void;
  }
  