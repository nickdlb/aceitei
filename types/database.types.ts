export interface Database {
    public: {
        Tables: {
            pages: {
                Row: {
                    id: string;
                    document_id: string;
                    // ... outros campos
                };
                Insert: {
                    id?: string;
                    document_id: string;
                    // ... outros campos
                };
                Update: {
                    id?: string;
                    document_id?: string;
                    // ... outros campos
                };
            };
            documents: {
                Row: {
                    id: string;
                    user_id: string;
                    // ... outros campos
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    // ... outros campos
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    // ... outros campos
                };
            };
        };
    };
} 