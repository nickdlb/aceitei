import { PencilIcon } from '@heroicons/react/24/outline';

interface CardTitleProps {
  editingTitle: boolean;
  cardTitulo: string;
  truncatedTitle: string;
  isTitleHovered: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  handleEditTitleButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocusOut: () => void;
  handleEditTitle: () => void;
}

export default function CardTitle({
  editingTitle,
  cardTitulo,
  truncatedTitle,
  isTitleHovered,
  inputRef,
  handleKeyPress,
  handleEditTitleButton,
  handleFocusOut,
  handleEditTitle
}: CardTitleProps) {
  return (
    <div className="mb-1 relative">
      <input
        style={{ display: editingTitle ? 'block' : 'none' }}
        value={cardTitulo}
        className="w-full font-medium text-base focus:outline-none px-1 py-0.5 rounded bg-gray-100"
        onKeyPress={handleKeyPress}
        onChange={handleEditTitleButton}
        onBlur={handleFocusOut}
        autoFocus
        ref={inputRef}
      />
      <span style={{ display: editingTitle ? 'none' : 'block' }} className="font-medium text-base truncate">
        {truncatedTitle}
      </span>
      <PencilIcon
        onClick={handleEditTitle}
        className={`absolute top-1/2 right-2 -translate-y-1/2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 ${editingTitle ? 'hidden' : (isTitleHovered ? 'block' : 'hidden')}`}
      />
    </div>
  );
}