import DeleteCardButton from "./DeleteCardButton";
    import { useState, useEffect, useRef } from "react";
    import { editTitle } from '@/utils/editTitle';
    import Link from 'next/link';
    import { PencilIcon } from '@heroicons/react/24/outline';
    import { TrashIcon } from '@heroicons/react/24/outline';
    import loadPins from '@/utils/loadPins';
    import { CheckIcon,  } from '@heroicons/react/24/solid';
    import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';


    export default function Card({
      imageUrl = '/api/placeholder/400/320',
      imageTitle = 'Título Card',
      status = 'Completo',
      updated_at = '1 July 2019',
      id = '0',
      StatusApp = () => {},
      StatusValue = () => {},
      marks_num = 0,
      currentlyEditing,
      setCurrentlyEditing
    }) {
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

      const HandleEditTitleButton = (event) => {
        setCardTitulo(event.target.value);
      };

      const HandleKeyPress = async (event) => {
        if (event.key === "Enter") {
          await HandleEditTitle();
        }
      };

      const HandleEditTitle = async () => {
        if (!editingTitle) {
          if (currentlyEditing) {
            // If another card is being edited, cancel that edit
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

      const truncatedTitle = localImageTitle.length > 28 ? `${localImageTitle.substring(0, 28)}...` : localImageTitle; // Changed max length to 28

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


      return (
        <div className="w-72 bg-white rounded-lg shadow overflow-hidden relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={cardRef}
        >
          <Link href={`/${id}`}>
            <div className="h-48 relative cursor-pointer overflow-hidden">
              <img
                src={imageUrl}
                alt={imageTitle}
                className={`w-full h-full object-cover transition-transform duration-200 ${isHovered ? 'transform scale-110' : ''}`}
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition duration-200 pointer-events-none`}></div>
            </div>
          </Link>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300 bg-white rounded-full">
            <DeleteCardButton id={id} />
          </div>

          <div className="p-3">
            {/* Status Section */}
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              <span onClick={HandleStatusClick} className="text-gray-600 text-sm cursor-pointer">
                {status}
              </span>
            </div>

            {/* Title Section */}
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

            {/* Comment Counts and Update Info */}
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
        </div>
      );
    }
<<<<<<< Updated upstream
=======
  };

  const HandleEditTitle = async () => {
    if (!editingTitle) {
      setEditingTitle(true);
    } else {
      StatusValue(true);
      setEditingTitle(false);
      await editTitle(id, CardTitulo);
      StatusValue(false);
    }
  };

  const HandleFocusOut = async () => {
    setEditingTitle(false);
    await editTitle(id, CardTitulo);
  };

  const HandleStatusClick = async () => {
    StatusApp(true);
    await new Promise(r => setTimeout(r, 3000));
    StatusApp(false);
  };

  const truncatedTitle = imageTitle.length > 30 ? `${imageTitle.substring(0, 30)}...` : imageTitle;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  return (
    <div className="w-72 bg-white rounded-lg shadow overflow-hidden relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/${id}`}>
        <div className="h-48 relative cursor-pointer overflow-hidden">
          <div className={`absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition duration-200`}></div> {/* Overlay */}
          <img
            src={imageUrl}
            alt={imageTitle}
            className={`w-full h-full object-cover transition-transform duration-200 ${isHovered ? 'transform scale-110' : ''}`}
            loading="lazy"
          />
        </div>
      </Link>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition duration-300 bg-white rounded-full">
        <DeleteCardButton id={id} />
      </div>

      <div className="p-3">
        {/* Status Section */}
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <span onClick={HandleStatusClick} className="text-gray-600 text-sm cursor-pointer">
            {status}
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-1 relative">
          <input
            style={{ display: editingTitle ? 'block' : 'none' }}
            value={CardTitulo}
            className="w-full bg-transparent font-medium text-base focus:outline-none focus:bg-gray-100 px-1 py-0.5 rounded"
            onKeyPress={HandleKeyPress}
            onChange={HandleEditTitleButton}
            onBlur={HandleFocusOut}
            autoFocus
          />
          <span style={{ display: editingTitle ? 'none' : 'block' }} className="font-medium text-base truncate">
            {truncatedTitle}
          </span>
          <PencilIcon
            onClick={HandleEditTitle}
            className={`absolute top-1/2 right-2 -translate-y-1/2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 ${editingTitle ? 'hidden' : 'block'}`}
          />
        </div>
        <span className="text-xs text-gray-500 mb-1 pb-1 block">Última modificação {updated_at}</span>

        {/* Comment Counts and Update Info */}
        <div className="flex items-center text-xs mb-3">
          <div className="flex items-center mr-2">
            <CheckIcon className="h-4 w-4 text-green-500 mr-1" />
            {completedComments}
          </div>
          <div className="flex items-center mr-2">
            <XMarkIcon className="h-4 w-4 text-yellow-500 mr-1" />
            {activeComments}
          </div>
          <div className="flex items-center mr-2">
            <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500 mr-1" />
            {totalComments}
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
