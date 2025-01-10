export interface Pin {
    id: string;
    x: number;
    y: number;
    num: number;
    comment: string;
    created_at: string;
    status: 'ativo' | 'resolvido';
}