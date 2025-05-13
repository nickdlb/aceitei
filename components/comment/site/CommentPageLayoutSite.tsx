import React from 'react';
import SiteArea from '@/components/comment/site/SiteArea';
import AuthPopup from '@/components/common/auth/AuthPopup';
import { usePageContext } from '@/contexts/PageContext';
import CommentBarSite from './CommentBarSite';

interface PageLayoutSiteProps {
  commentBarProps: any;
  SiteAreaProps: any;
  isPagesOpen: boolean;
  showAuthPopup: boolean;
  setShowAuthPopup: (show: boolean) => void;
  handleAuthSubmitAnonForm: (name: string, email: string) => Promise<void>;
  handlePageChange: (newPageId: string) => Promise<void>;
}

const PageLayoutSite: React.FC<PageLayoutSiteProps> = ({
  commentBarProps,
  SiteAreaProps,
  isPagesOpen,
  showAuthPopup,
  setShowAuthPopup,
  handleAuthSubmitAnonForm,
  handlePageChange,
}) => {
  const { pages, pageId } = usePageContext();

  const enhancedSiteAreaProps = {
    ...SiteAreaProps,
    pagesCount: pages.length,
  };

  return (
    <div className="w-full h-screen flex">
      <div className="w-[380px] flex-shrink-0 !border-0">
        <CommentBarSite {...commentBarProps} />
      </div>
      <div className="flex-1 flex">
        <SiteArea {...enhancedSiteAreaProps} />
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
