import DeleteCardButton from "./DeleteCardButton";
import { useState } from "react";
import { editTitle } from '@/utils/editTitle';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Card({
  imageUrl = '/api/placeholder/400/320',
  imageTitle = 'Título Card',
  status = 'Completo',
  updated_at = '1 July 2019',
  id = '0',
  StatusApp = () => {},
  StatusValue = () => {},
  marks_num = 0
}) {
  const [CardTitulo, setCardTitulo] = useState(imageTitle);
  const [DisabledTitulo, setDisabledTitulo] = useState(true);

  const HandleEditTitleButton = (event) => {
    setCardTitulo(event.target.value);
  };

  const HandleKeyPress = (event) => {
    if (event.key === "Enter") {
      HandleEditTitle();
    }
  };

  const HandleEditTitle = async () => {
    if (DisabledTitulo) {
      setDisabledTitulo(false);
    } else {
      StatusValue(true);
      setDisabledTitulo(true);
      await editTitle(id, CardTitulo);
      StatusValue(false);
    }
  };

  const HandleFocusOut = async () => {
    setDisabledTitulo(true);
    await editTitle(id, CardTitulo);
  };

  const HandleStatusClick = async () => {
    StatusApp(true);
    await new Promise(r => setTimeout(r, 3000));
    StatusApp(false);
  };

  return (
    <div className="w-72 bg-white rounded-lg shadow overflow-hidden">
      <Link href={`/${id}`}>
        <div className="h-48 relative cursor-pointer">
          <img 
            src={imageUrl}
            alt={imageTitle}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      
      <div className="p-3">
        {/* Status Section */}
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
          <span onClick={HandleStatusClick} className="text-gray-600 text-sm cursor-pointer">
            {status}
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-2">
          <input
            disabled={DisabledTitulo}
            value={CardTitulo}
            className="w-full bg-transparent font-medium text-base focus:outline-none focus:bg-gray-100 disabled:text-gray-800 px-1 py-0.5 rounded"
            onKeyPress={HandleKeyPress}
            onChange={HandleEditTitleButton}
            onBlur={HandleFocusOut}
          />
        </div>

        {/* Update Info */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <span>Update {updated_at}</span>
          <div className="flex items-center ml-2">
            <span className="flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              {marks_num}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={HandleEditTitle}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Alterar Título
          </button>
          <DeleteCardButton id={id} />
        </div>
      </div>
    </div>
  );
}
