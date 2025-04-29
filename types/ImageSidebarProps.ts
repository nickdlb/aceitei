export interface ImageSidebarProps {
    pages: Array<{
        id: string;
        image_url: string;
        page_number: number;
    }>;
    currentPage: string;
    onPageChange: (pageId: string) => void;
}