export interface Image {
    id: string;
    image_url: string;
    imageTitle: string;
    status: string;
    created_at: string;
    marks_num?: number; // Add other properties as needed
    user_id: string;
}