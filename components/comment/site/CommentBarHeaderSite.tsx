import Link from 'next/link';

interface CommentHeaderSiteProps {
  totalComments: number;
}

const CommentHeaderSite: React.FC<CommentHeaderSiteProps> = ({ totalComments }) => {
  return (
      <div className="p-4 h-16">
        <div className=" items-center justify-between">
          <Link href="/dashboard" className="font-medium hover:text-acazul">
            <img src='/logo-feedybacky-dark.png' className='w-60'/>
          </Link>
        </div>
      </div>
  );
};

export default CommentHeaderSite;
