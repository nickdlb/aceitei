import Link from 'next/link';

interface CommentHeaderProps {
  totalComments: number;
}

const CommentHeader: React.FC<CommentHeaderProps> = ({ totalComments }) => {
  return (
    <>
      <div className="p-4 border-b bg-white border-b-gray-300">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-medium hover:text-blue-600">
            Aceitei
          </Link>
        </div>
      </div>
      <div className="px-4 py-2 bg-white border-b border-b-gray-300">
        <span className="font-medium">Total de Comentários: {totalComments}</span>
      </div>
    </>
  );
};

export default CommentHeader;