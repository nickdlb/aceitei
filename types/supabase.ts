export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            pages: {
                Row: {
                    id: string;
                    document_id: string;
                    image_url: string;
                    page_number: number;
                    imageTitle: string;
                    created_at: string;
                    documents: Document;
                };
            };
            documents: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    created_at: string;
                };
            };
            comments: {
                Row: {
                    id: string;
                    page_id: string;
                    user_id: string;
                    content: string;
                    pos_x: number;
                    pos_y: number;
                    pin_number: number;
                    status: 'ativo' | 'resolvido';
                    created_at: string;
                };
            };
            anonymous_users: {
                Row: {
                    id: string;
                    auth_id: string;
                    name: string;
                    email: string;
                    created_at: string;
                };
            };
        };
    };
}

interface Document {
    user_id: string;
    id: string;
    title: string;
    created_at: string;
} 