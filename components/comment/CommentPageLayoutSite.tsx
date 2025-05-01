import React from 'react';
import CommentBar from '@/components/comment/CommentBar';
import SiteArea from '@/components/comment/SiteArea';
import ImageSidebar from '@/components/comment/ImageSidebar';
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

const PageLayoutSite: React.FC<PageLayoutProps> = ({
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
      <div className="w-96 flex-shrink-0 !border-0">
        <CommentBar {...commentBarProps} />
      </div>
      <div className="flex-1 flex">
        <SiteArea {...enhancedImageAreaProps} />
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

export default PageLayoutSite;
