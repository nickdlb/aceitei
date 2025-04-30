import { useState } from 'react';
import { Input } from "@/components/common/ui/input";
import { Button } from "@/components/common/ui/button";
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useAuth } from '@/components/common/auth/AuthProvider';

export default function SiteUpload({ onUploadSuccess }: { onUploadSuccess?: (page: any) => void }) {
  const { session } = useAuth();
  const [link, setLink] = useState('');

  const handleLinkUpload = async (url: string) => {
    if (!session?.user?.id) return;
    url = handleHttpsInput(url);
    try {
      const { data: document, error: documentError } = await createSupabaseClient
        .from('documents')
        .insert({
          url,
          user_id: session.user.id,
          title: 'Link enviado',
          type: 'site'
        })
        .select()
        .single();

      if (documentError) {
        console.error('Erro ao salvar o link no documento:', documentError.message);
        return;
      }

      const { data: page, error: pageError } = await createSupabaseClient
        .from('pages')
        .insert({
          document_id: document.id,
          user_id: session.user.id,
          page_number: 1,
          imageTitle: 'Página do link',
        })
        .select()
        .single();

      if (pageError) {
        console.error('Erro ao criar a página vinculada:', pageError.message);
        return;
      }

      if (onUploadSuccess) onUploadSuccess(page);
    } catch (err) {
      const error = err as Error;
      console.error('Erro ao fazer upload do link:', error.message);
    }
  };

  const handleHttpsInput = (url: string): string  => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return url = trimmed;
    }
    return url = `https://${trimmed}`;
  }

  const handleUploadSite = () => {
    if (!link.trim()) return;
    handleLinkUpload(link.trim());
  };

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Insira o link do site"
        className="text-sm text-acpreto rounded-xl font-medium !leading-8 !ring-0"
        autoFocus
      />
      <Button
        className="!text-xs h-8 px-4 bg-acazul opacity-100 disabled:bg-acazul text-acbrancohover"
        onClick={handleUploadSite}
        disabled={!link.trim()}
      >
        Enviar
      </Button>
    </div>
  );
}
