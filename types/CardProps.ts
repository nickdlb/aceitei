export default interface ImageCardProps {
    image: {
        id: string;
        document_id: string;
        image_url: string;
        imageTitle: string;
        created_at: string;
        page_id: string;
        title: string;
        active_comments: number;
        resolved_comments: number;
        notifications: number;
    };
    onDelete: (id: string) => void;
}