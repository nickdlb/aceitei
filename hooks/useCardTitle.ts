import { useState, useRef, useEffect } from 'react';
import { editTitle } from '@/utils/editTitle';

export const useCardTitle = (initialTitle: string, id: string, currentlyEditing: string | null, setCurrentlyEditing: (id: string | null) => void) => {
  const [cardTitulo, setCardTitulo] = useState(initialTitle);
  const [editingTitle, setEditingTitle] = useState(false);
  const [localImageTitle, setLocalImageTitle] = useState(initialTitle);
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const handleEditTitleButton = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCardTitulo(event.target.value);

  const handleEditTitle = async () => {
    if (!editingTitle) {
      if (currentlyEditing) {
        setCurrentlyEditing(null);
      }
      setEditingTitle(true);
      setCurrentlyEditing(id);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      setIsUpdating(true);
      setEditingTitle(false);
      await editTitle(id, cardTitulo);
      setLocalImageTitle(cardTitulo);
      setIsUpdating(false);
      setCurrentlyEditing(null);
    }
  };

  const handleFocusOut = async () => {
    if (editingTitle) {
      setEditingTitle(false);
      await editTitle(id, cardTitulo);
      setLocalImageTitle(cardTitulo);
      setCurrentlyEditing(null);
    }
  };

  useEffect(() => {
    if (currentlyEditing !== id && editingTitle) {
      setEditingTitle(false);
      setCardTitulo(localImageTitle);
    }
  }, [currentlyEditing, id, localImageTitle]);

  return {
    cardTitulo,
    editingTitle,
    localImageTitle,
    isTitleHovered,
    inputRef,
    setIsTitleHovered,
    handleEditTitleButton,
    handleEditTitle,
    handleFocusOut,
  };
};