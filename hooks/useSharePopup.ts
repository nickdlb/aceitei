import { useState } from 'react';

export const useSharePopup = () => {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSharePopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsSharePopupOpen(false);
  };

  const handleCopyClick = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${id}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopySuccess(false);
    }
  };

  return {
    isSharePopupOpen,
    copySuccess,
    handleShareClick,
    handleClosePopup,
    handleCopyClick
  };
};