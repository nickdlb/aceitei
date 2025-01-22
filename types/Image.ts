export interface Image {
    id: string;
    image_url: string;
    imageTitle?: string;
    created_at: string;
    document_id?: string;
    page_number?: number;
    user_id: string;
    documents?: {
        id: string;
        title: string;
        created_at: string;
        user_id: string;
    };
}