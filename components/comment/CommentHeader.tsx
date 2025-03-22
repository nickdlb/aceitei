import Link from 'next/link';
import CommentHeaderProps from '@/types/CommentHeaderProps';

const CommentHeader: React.FC<CommentHeaderProps> = ({ totalComments }) => {
  return (
    <>
      <div className="p-4 border-b bg-white border-b-gray-300">
        <div className=" items-center justify-between">
          <Link href="/" className="font-medium hover:text-blue-600">
            Aceitei
          </Link>
        </div>
      </div>
      
    </>
  );
};

export default CommentHeader;
