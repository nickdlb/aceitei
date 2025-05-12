import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { Loader2 } from 'lucide-react';
import { useDashboardContext } from '@/contexts/DashboardContext';

export default function SiteUpload({ onUploadSuccess }: { onUploadSuccess?: (page: any) => void }) {
  const { session } = useAuth();
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshImages } = useDashboardContext();

  const handleLinkUpload = async (url: string) => {
  if (!session?.user?.id) return;
  setIsLoading(true);
  const novaurl = url.replace(/^https?:\/\//, '');
  url = handleHttpsInput(url);

  try {
    // Cria o documento
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        url,
        user_id: session.user.id,
        title: novaurl,
        type: 'site'
      })
      .select()
      .single();

    if (documentError) {
      console.error('Erro ao salvar o link no documento:', documentError.message);
      return;
    }

    // Chama a API que gera o screenshot
    const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
    const json = await res.json();

    if (!res.ok || !json?.url) {
      console.error('Erro ao gerar imagem:', json?.error || 'Resposta inválida');
      return;
    }

    const publicUrl: string = json.url;
    const imageUrl = publicUrl.split('/files/')[1]
      ? '/' + publicUrl.split('/files/')[1]
      : '';

    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        document_id: document.id,
        user_id: session.user.id,
        page_number: 1,
        imageTitle: novaurl,
        image_url: imageUrl
      })
      .select()
      .single();

    if (pageError) {
      console.error('Erro ao criar a página vinculada:', pageError.message);
      return;
    }

    if (onUploadSuccess) onUploadSuccess(page);
    await refreshImages();

  } catch (err) {
    const error = err as Error;
    console.error('Erro ao fazer upload do link:', error.message);
  } finally {
    setIsLoading(false);
  }
};

  const handleHttpsInput = (url: string): string => {
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
        disabled={!link.trim() || isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enviar'}
      </Button>
    </div>
  );
}
