export default interface PageLayoutProps {
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