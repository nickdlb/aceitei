import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { type Page as DocumentPage } from '@/types/Document';
import { useRouter } from 'next/navigation';

export function usePageData(pageId: string) {
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState<DocumentPage | null>(null);
    const [pages, setPages] = useState<Array<{
        id: string;
        image_url: string;
        page_number: number;
    }>>([]);
    const router = useRouter();

    useEffect(() => {
        const loadPage = async () => {
            if (!pageId) return;

            try {
                const { data: document } = await supabase
                    .from('documents')
                    .select('id')
                    .eq('id', pageId)
                    .single();

                let targetPageId = pageId;

                if (document) {
                    const { data: firstPage } = await supabase
                        .from('pages')
                        .select('id')
                        .eq('document_id', document.id)
                        .eq('page_number', 1)
                        .single();

                    if (firstPage) {
                        targetPageId = firstPage.id;
                    }
                }

                const { data: page } = await supabase
                    .from('pages')
                    .select(`
                        *,
                        documents!pages_document_id_fkey (
                            id,
                            title,
                            created_at,
                            user_id
                        )
                    `)
                    .eq('id', targetPageId)
                    .single();

                if (!page) {
                    console.error('Page not found');
                    return;
                }

                const { data: allPages } = await supabase
                    .from('pages')
                    .select('id, image_url, page_number')
                    .eq('document_id', page.document_id)
                    .order('page_number');

                if(document && targetPageId !== pageId){
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
