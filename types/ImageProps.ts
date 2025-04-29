export interface ImageProps {
    id: string;
    document_id: string;
    image_url: string;
    imageTitle: string;
    created_at: string;
    page_id: string;
    title: string;
    user_id: string;
    active_comments: number;
    resolved_comments: number;
    notifications: number;
    type: 'imagem' | 'site';
  }
  