import Link from 'next/link';

interface CommentHeaderProps {
  totalComments: number;
}

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
