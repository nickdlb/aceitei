export interface CardProps {
  imageUrl?: string;
  imageTitle?: string;
  status?: string;
  updated_at?: string;
  id: string;
  StatusApp?: () => void;
  currentlyEditing: string | null;
  setCurrentlyEditing: (id: string | null) => void;
  onDelete: (id: string) => void;
}