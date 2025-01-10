'use client';

import React, { useState, useRef } from 'react';
import { CardProps } from '@/types/Card';
import { useCardTitle } from '@/hooks/useCardTitle';
import { useCardImage } from '@/hooks/useCardImage';
import { useSharePopup } from '@/hooks/useSharePopup';
import { useComments } from '@/hooks/useComments';
import CardImage from './CardImage';
import CardTitle from './CardTitle';
import CardFooter from './CardFooter';
import StatusIndicator from './StatusIndicator';
import SharePopup from './SharePopup';

const Card = React.memo(({
  imageUrl = '/api/placeholder/400/320',
  imageTitle = 'Título Card',
  status = 'Completo',
  updated_at = '1 July 2019',
  id,
  StatusApp = () => {},
  currentlyEditing,
  setCurrentlyEditing,
  onDelete
}: CardProps) => {
  // Estado local
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const { activeComments, completedComments, totalComments } = useComments(id);
  
  const {
    cardTitulo,
    editingTitle,
    localImageTitle,
    isTitleHovered,
    inputRef,
    setIsTitleHovered,
    handleEditTitleButton,
    handleEditTitle,
    handleFocusOut,
  } = useCardTitle(imageTitle || '', id, currentlyEditing, setCurrentlyEditing);

  const {
    imageLoaded,
    cardVisible,
    handleImageLoad
  } = useCardImage(imageUrl);

  const {
    isSharePopupOpen,
    copySuccess,
    handleShareClick,
    handleClosePopup,
    handleCopyClick
  } = useSharePopup();

  // Handlers
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsHovered(false);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleStatusClick = async () => {
    StatusApp();
    await new Promise(r => setTimeout(r, 3000));
    StatusApp();
  };

  // Helpers
  const truncatedTitle = localImageTitle.length > 28 
    ? `${localImageTitle.substring(0, 28)}...` 
    : localImageTitle;

  return (
    <div 
      className={`w-72 bg-white rounded-lg shadow overflow-hidden relative group 
        ${cardVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <CardImage
        imageUrl={imageUrl}
        imageTitle={imageTitle || ''}
        id={id}
        isHovered={isHovered}
        isModalOpen={isModalOpen}
        imageLoaded={imageLoaded}
        handleImageLoad={handleImageLoad}
        handleShareClick={handleShareClick}
        onDelete={onDelete}
        handleModalOpen={handleModalOpen}
        handleModalClose={handleModalClose}
      />

      <div className="p-3">
        <StatusIndicator
          status={status}
          onStatusClick={handleStatusClick}
        />

        <CardTitle
          editingTitle={editingTitle}
          cardTitulo={cardTitulo}
          truncatedTitle={truncatedTitle}
          isTitleHovered={isTitleHovered}
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          handleKeyPress={(e) => e.key === "Enter" && handleEditTitle()}
          handleEditTitleButton={handleEditTitleButton}
          handleFocusOut={handleFocusOut}
          handleEditTitle={handleEditTitle}
        />

        <CardFooter
          updated_at={updated_at}
          completedComments={completedComments}
          totalComments={totalComments}
        />
      </div>

      {isSharePopupOpen && (
        <SharePopup
          id={id}
          copySuccess={copySuccess}
          handleCopyClick={handleCopyClick}
          handleClosePopup={handleClosePopup}
        />
      )}
    </div>
  );
});

// Adiciona displayName para melhor debugging com React DevTools
Card.displayName = 'Card';

export default Card;