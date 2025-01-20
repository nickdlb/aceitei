export interface Pin {
    id: string | any;
    x: number;
    y: number;
    num: number;
    comment: string;
    created_at: string;
    status: 'ativo' | 'resolvido';
}