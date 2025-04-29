import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { type Page as DocumentPage } from '@/types/DocumentProps';
import { useRouter } from 'next/navigation';

export function getPageDataSupabase(pageId: string) {
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState<DocumentPage | null>(null);
    const [pages, setPages] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadPage = async () => {
            if (!pageId) return;

            try {
                // Busca o documento pelo pageId (caso ele seja o próprio ID do documento)
                const { data: document } = await createSupabaseClient
                    .from('documents')
                    .select('id')
                    .eq('id', pageId)
                    .single();

                let targetPageId = pageId;

                // Se o ID da URL for de um documento, redireciona para a primeira página
                if (document) {
                    const { data: firstPage } = await createSupabaseClient
                        .from('pages')
                        .select('id')
                        .eq('document_id', document.id)
                        .eq('page_number', 1)
                        .single();

                    if (firstPage) {
                        targetPageId = firstPage.id;
                    }
                }

                // Busca os dados completos da página, incluindo todos os campos do documento relacionado
                const { data: page } = await createSupabaseClient
                    .from('pages')
                    .select(`
                        *,
                        documents:documents!pages_document_id_fkey (*)
                    `)
                    .eq('id', targetPageId)
                    .single();

                if (!page) {
                    console.error('Page not found');
                    return;
                }

                // Busca todas as páginas do mesmo documento com todos os dados
                const { data: allPages } = await createSupabaseClient
                    .from('pages')
                    .select(`
                        *,
                        documents:documents!pages_document_id_fkey (*)
                    `)
                    .eq('document_id', page.document_id)
                    .order('page_number');

                // Redireciona se o pageId inicial era do documento
                if (document && targetPageId !== pageId) {
                    router.replace(`/${targetPageId}`, { scroll: false });
                }

                setPages(allPages || []);
                setPageData(page);
                setLoading(false);
            } catch (error) {
                console.error('Error in loadPage:', error);
                setLoading(false);
            }
        };

        loadPage();
    }, [pageId, router]);

    return { loading, pageData, pages };
}
