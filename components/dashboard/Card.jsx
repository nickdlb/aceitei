import DeleteCardButton from "./DeleteCardButton";
    import { useState, useEffect, useRef } from "react";
    import { editTitle } from '@/utils/editTitle';
    import Link from 'next/link';
    import { PencilIcon } from '@heroicons/react/24/outline';
    import { TrashIcon } from '@heroicons/react/24/outline';
    import loadPins from '@/utils/loadPins';
    import { CheckIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/solid';
    import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
    import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
    import React from 'react';

    const Card = React.memo(({
      imageUrl = '/api/placeholder/400/320',
      imageTitle = 'Título Card',
      status = 'Completo',
      updated_at = '1 July 2019',
      id = '0',
      StatusApp = () => {},
      StatusValue = () => {},
      marks_num = 0,
      currentlyEditing,
      setCurrentlyEditing,
      onDelete
    }) => {
      const [CardTitulo, setCardTitulo] = useState(imageTitle);
      const [editingTitle, setEditingTitle] = useState(false);
      const [activeComments, setActiveComments] = useState(0);
      const [completedComments, setCompletedComments] = useState(0);
      const [isHovered, setIsHovered] = useState(false);
      const [totalComments, setTotalComments] = useState(0);
      const titleRef = useRef(null);
      const [isTitleHovered, setIsTitleHovered] = useState(false);
      const [localImageTitle, setLocalImageTitle] = useState(imageTitle);
      const [isUpdating, setIsUpdating] = useState(false);
      const cardRef = useRef(null);
      const inputRef = useRef(null);
      const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
      const [copySuccess, setCopySuccess] = useState(false);
      const [imageLoaded, setImageLoaded] = useState(false);
      const [cardVisible, setCardVisible] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);

      useEffect(() => {
        const fetchCommentCounts = async () => {
          const pins = await loadPins(id);
          if (pins) {
            const activeCount = pins.filter(pin => pin.status === 'ativo').length;
            const completedCount = pins.filter(pin => pin.status === 'resolvido').length;
            setActiveComments(activeCount);
            setCompletedComments(completedCount);
            setTotalComments(pins.length);
          }
        };
        fetchCommentCounts();
      }, [id]);

      const HandleEditTitleButton = (event) =>
        setCardTitulo(event.target.value);

      const HandleKeyPress = async (event) => {
        if (event.key === "Enter") {
          await HandleEditTitle();
        }
      };

      const HandleEditTitle = async () => {
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
          await editTitle(id, CardTitulo);
          setLocalImageTitle(CardTitulo);
          setIsUpdating(false);
          setCurrentlyEditing(null);
        }
      };

      const HandleFocusOut = async () => {
        if (editingTitle) {
          setEditingTitle(false);
          await editTitle(id, CardTitulo);
          setLocalImageTitle(CardTitulo);
          setCurrentlyEditing(null);
        }
      };

      const HandleStatusClick = async () => {
        StatusApp(true);
        await new Promise(r => setTimeout(r, 3000));
        StatusApp(false);
      };

      const truncatedTitle = localImageTitle.length > 28 ? `${localImageTitle.substring(0, 28)}...` : localImageTitle;

      const handleMouseEnter = () => {
        setIsHovered(true);
      };

      const handleMouseLeave = () => {
        setIsHovered(false);
      };

      const handleTitleMouseEnter = () => {
        setIsTitleHovered(true);
      };

      const handleTitleMouseLeave = () => {
        setIsTitleHovered(false);
      };

      useEffect(() => {
        if (currentlyEditing !== id && editingTitle) {
          setEditingTitle(false);
          setCardTitulo(localImageTitle);
        }
      }, [currentlyEditing, id, localImageTitle, setEditingTitle, setCardTitulo]);

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (cardRef.current && !cardRef.current.contains(event.target)) {
            HandleFocusOut();
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [editingTitle, HandleFocusOut]);

      const handleShareClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSharePopupOpen(true);
      };

      const handleClosePopup = () => {
        setIsSharePopupOpen(false);
        handleMouseLeave();
      };

      const handleCopyClick = async () => {
        try {
          await navigator.clipboard.writeText(`http://localhost:3000/${id}`);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy text: ", err);
          setCopySuccess(false);
        }
      };

      const handleImageLoad = () => {
        setImageLoaded(true);
        setCardVisible(true);
      };

      useEffect(() => {
        if (imageUrl) {
          setCardVisible(true);
        }
      }, [imageUrl]);

      const handleModalOpen = () => {
        setIsModalOpen(true);
      };

      const handleModalClose = () => {
        setIsModalOpen(false);
        setIsHovered(false);
      };

      return (
        <div className={`w-72 bg-white rounded-lg shadow overflow-hidden relative group ${cardVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
        >
          <div className="h-48 relative overflow-hidden bg-gray-100">
            <Link href={`/${id}`} target="_blank">
              <img
                src={imageUrl}
                alt={imageTitle}
                className={`w-full h-full object-cover transition-transform duration-200 ${isHovered ? 'transform scale-110' : ''} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={handleImageLoad}
              />
            </Link>
            <div className={`absolute top-4 right-4 flex flex-col gap-2 ${isHovered || isModalOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
              <Link href={`/${id}`} target="_blank" className="bg-white hover:bg-gray-100 p-1 rounded-full" title="Ver">
                <EyeIcon className="h-4 w-4 text-gray-700 hover:text-gray-900" />
              </Link>
              <button onClick={handleShareClick} className="bg-white hover:bg-gray-100 p-1 rounded-full" title="Compartilhar">
                <ShareIcon className="h-4 w-4 text-gray-700 hover:text-gray-900" />
              </button>
              <div className="bg-white rounded-full" title="Excluir">
                <DeleteCardButton id={id} onDelete={onDelete} onModalOpen={handleModalOpen} onModalClose={handleModalClose} />
              </div>
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span onClick={HandleStatusClick} className="text-gray-600 text-sm cursor-pointer">
                {status}
              </span>
            </div>

            <div className="mb-1 relative" onMouseEnter={handleTitleMouseEnter} onMouseLeave={handleTitleMouseLeave} ref={titleRef}>
              <input
                style={{ display: editingTitle ? 'block' : 'none' }}
                value={CardTitulo}
                className="w-full font-medium text-base focus:outline-none px-1 py-0.5 rounded bg-gray-100"
                onKeyPress={HandleKeyPress}
                onChange={HandleEditTitleButton}
                onBlur={HandleFocusOut}
                autoFocus
                ref={inputRef}
              />
              <span style={{ display: editingTitle ? 'none' : 'block' }} className="font-medium text-base truncate">
                {truncatedTitle}
              </span>
              <PencilIcon
                onClick={HandleEditTitle}
                className={`absolute top-1/2 right-2 -translate-y-1/2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 ${editingTitle ? 'hidden' : (isTitleHovered ? 'block' : 'hidden')}`}
              />
            </div>
            <span className="text-xs text-gray-500 mb-1 pb-1 block">Última modificação {updated_at}</span>

            <div className="flex items-center text-xs mb-3">
              <div className="flex items-center mr-2">
                <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
                {completedComments}
              </div>
              <div className="flex items-center mr-2">
                <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500 mr-1" />
                {totalComments}
              </div>
            </div>
          </div>
          {/* Share Popup */}
          {isSharePopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow p-6 w-64">
                <h3 className="text-lg font-semibold mb-2">Compartilhar</h3>
                <p>Compartilhe o link da imagem:</p>
                <div className="flex items-center">
                  <input type="text" value={`${window.location.origin}/${id}`} className="w-full mt-2 p-2 border rounded mr-2" readOnly />
                  <button onClick={handleCopyClick} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                </div>
                {copySuccess && <p className="text-green-500 text-sm mt-1">Link copiado!</p>}
                <button onClick={handleClosePopup} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Fechar</button>
              </div>
            </div>
          )}
        </div>
      );
    });

    Card.displayName = 'Card';

    export default Card;
