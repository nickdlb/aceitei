import React from 'react';
import CommentBar from '@/components/comment/CommentBar';
import ImageArea from '@/components/comment/ImageArea';
import ImageSidebar from '@/components/comment/ImageSidebar';
import AuthPopup from '@/components/auth/AuthPopup';
import PageLayoutProps from '@/types/PageLayoutProps';

const PageLayout: React.FC<PageLayoutProps> = ({
  commentBarProps,
  imageAreaProps,
  pages,
  pageId,
  isPagesOpen,
  showAuthPopup,
  setShowAuthPopup,
  handleAuthSubmitAnonForm,
  handlePageChange,
}) => {
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
