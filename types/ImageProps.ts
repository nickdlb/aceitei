export default interface ImageProps {
    id: string;
    image_url: string;
    imageTitle: string;
    created_at: string;
    document_id: string;
    page_number?: number;
    user_id: string;
    page_id: string;
    title: string;
    active_comments: number;
    resolved_comments: number;
    documents?: {
        id: string;
        title: string;
        created_at: string;
        user_id: string;
    };
    notifications: number;
}
