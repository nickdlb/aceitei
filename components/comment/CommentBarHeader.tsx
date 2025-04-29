import Link from 'next/link';
import {CommentHeaderProps} from '@/types/CommentHeaderProps';

const CommentHeader: React.FC<CommentHeaderProps> = ({ totalComments }) => {
  return (
      <div className="p-4 h-16">
        <div className=" items-center justify-between">
          <Link href="/" className="font-medium hover:text-acazul">
            Aceitei
          </Link>
        </div>
      </div>
  );
};

export default CommentHeader;
