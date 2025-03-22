import { useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export function useRealtimeComments(pageId: string, loadComments: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel('debug-realtime-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
        },
        (payload: any) => {
          loadComments();
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_reactions',
        },
        (payload: any) => {
          loadComments();
        }
      )

      .subscribe((status: any) => {
      });
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, [pageId, loadComments]);
}
