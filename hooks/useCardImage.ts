import { useState, useEffect } from 'react';

export const useCardImage = (imageUrl: string) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setCardVisible(true);
  };

  useEffect(() => {
    if (imageUrl) {
      setCardVisible(true);
    }
  }, [imageUrl]);

  return {
    imageLoaded,
    cardVisible,
    handleImageLoad
  };
};