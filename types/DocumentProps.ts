export interface Page {
    id: string;
    document_id: string;
    image_url: string;
    page_number: number;
    imageTitle: string;
    created_at: string;
    user_id: string;
    documents?: DocumentProps;
}

export interface DocumentProps {
    id: any;
    title: any;
    created_at: any;
    user_id: any;
}
