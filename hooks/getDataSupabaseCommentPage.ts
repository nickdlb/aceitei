import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { DocumentPage } from '@/types';
import { useRouter } from 'next/navigation';

export function getPageDataSupabase(documentId: string) {
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState<DocumentPage | null>(null);
    const [pages, setPages] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadPage = async () => {
            if (!documentId) return;
            try {
                const { data: allPages } = await createSupabaseClient
                    .from('pages')
                    .select(`
                        *,
                        documents:documents!pages_document_id_fkey (*)
                    `)
                    .eq('document_id', documentId)
                    .order('page_number');

                if (!allPages || allPages.length === 0) {
                    console.error('Nenhuma página encontrada para este documento.');
                    return;
                }
                setPages(allPages);
                const firstPage = allPages.find(page => page.page_number === 1) || allPages[0];
                setPageData(firstPage);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar as páginas do documento:', error);
                setLoading(false);
            }
        };
        loadPage();
    }, [documentId, router]);
    return { loading, pageData, pages, setPageData };
}
