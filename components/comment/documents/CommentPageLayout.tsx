import React from 'react';
import CommentBar from './CommentBar';
import ImageArea from './ImageArea';
import ImageSidebar from './ImageSidebar';
import AuthPopup from '@/components/common/auth/AuthPopup';
import { usePageContext } from '@/contexts/PageContext';

interface PageLayoutProps {
  commentBarProps: any;
  imageAreaProps: any;
  isPagesOpen: boolean;
  showAuthPopup: boolean;
  setShowAuthPopup: (show: boolean) => void;
  handleAuthSubmitAnonForm: (name: string, email: string) => Promise<void>;
  handlePageChange: (newPageId: string) => Promise<void>;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  commentBarProps,
  imageAreaProps,
  isPagesOpen,
  showAuthPopup,
  setShowAuthPopup,
  handleAuthSubmitAnonForm,
  handlePageChange,
}) => {
  const { pages, pageId } = usePageContext();

  const enhancedImageAreaProps = {
    ...imageAreaProps,
    pagesCount: pages.length,
  };

  return (
    <div className="w-full h-screen flex">
      <div className="max-w-[350px] w-[350px] flex-shrink-0 !border-0">
        <CommentBar {...commentBarProps} />
      </div>
      <div className="flex-1 flex">
        <ImageArea {...enhancedImageAreaProps} />
        {pages.length > 1 && isPagesOpen && (
          <ImageSidebar
            pages={pages}
            currentPage={pageId}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        onSubmit={handleAuthSubmitAnonForm}
      />
    </div>
  );
};

export default PageLayout;
