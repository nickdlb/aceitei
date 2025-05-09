import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: NextRequest) {
    try {
        const { documentId, timestamp } = await req.json();

        const { error } = await supabase
            .from('documents')
            .update({ last_acessed_at: timestamp })
            .eq('id', documentId);

        if (error) {
            console.error('Erro ao atualizar last_accessed_at:', error);
            return NextResponse.json({ success: false }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Erro na rota /api/track-exit:', err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
