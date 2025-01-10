import { CheckIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

interface CardFooterProps {
  updated_at: string;
  completedComments: number;
  totalComments: number;
}

export default function CardFooter({
  updated_at,
  completedComments,
  totalComments
}: CardFooterProps) {
  return (
    <>
      <span className="text-xs text-gray-500 mb-1 pb-1 block">
        Última modificação {updated_at}
      </span>
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
    </>
  );
}