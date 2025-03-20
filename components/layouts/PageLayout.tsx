import React from 'react';
import CommentBar from '@/components/comment/CommentBar';
import ImageArea from '@/components/comment/ImageArea';
import ImageSidebar from '@/components/comment/ImageSidebar';
import AuthPopup from '@/components/auth/AuthPopup';

interface PageLayoutProps {
  commentBarProps: any;
  imageAreaProps: any;
  pages: any[];
  pageId: string;
  isPagesOpen: boolean;
  showAuthPopup: boolean;
  setShowAuthPopup: (show: boolean) => void;
  handleAuthSubmitAnonForm: (name: string, email: string) => Promise<void>;
  handlePageChange: (newPageId: string) => Promise<void>;
}

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
  return (
    <div className="w-full h-screen flex">
      {/* Sidebar de Comentários */}
      <div className="w-96 flex-shrink-0 bg-gray-100 border-r border-gray-300">
        <CommentBar {...commentBarProps} />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex">
        <ImageArea {...imageAreaProps} />
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
