import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    TrashIcon,
    PencilIcon,
    EyeIcon,
    ShareIcon,
    ChatBubbleLeftIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { supabase } from '@/utils/supabaseClient';
import { getImageUrl } from '@/utils/imageUrl';
import { useImages } from '@/contexts/ImagesContext';

interface ImageCardProps {
    image: {
        id: string;
        document_id: string;
        image_url: string;
        imageTitle: string;
        created_at: string;
        page_id: string;
        title: string;
        active_comments: number;
        resolved_comments: number;
    };
    onDelete: (id: string) => void;
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showShareLink, setShowShareLink] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(image.imageTitle);
    const router = useRouter();
    const imageUrl = getImageUrl(image.image_url);
    const { refreshImages } = useImages();

    const handleShare = async () => {
        const linkToShare = `${window.location.origin}/${image.document_id}`;
        try {
            await navigator.clipboard.writeText(linkToShare);
            setShowShareLink(true);
            setTimeout(() => setShowShareLink(false), 3000);
        } catch (err) {
            console.error('Erro ao copiar link:', err);
        }
    };

    const handleTitleEdit = async () => {
        try {
            const { error } = await supabase
                .from('pages')
                .update({ imageTitle: title })
                .eq('id', image.page_id);

            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao atualizar título:', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Tem certeza que deseja excluir este documento?')) {
            return;
        }

        setIsDeleting(true);
        try {
            // 1. Buscar todas as páginas do documento
            const { data: pages, error: pagesError } = await supabase
                .from('pages')
                .select('id, image_url')
                .eq('document_id', image.document_id);

            if (pagesError) {
                console.error('Erro ao buscar páginas:', pagesError);
                return;
            }

            if (!pages || pages.length === 0) {
                console.error('Nenhuma página encontrada');
                return;
            }

            const pageIds = pages.map(p => p.id);

            // 2. Primeiro buscar todos os pins das páginas
            const { data: pins } = await supabase
                .from('comments')
                .select('id')
                .in('page_id', pageIds);

            if (pins && pins.length > 0) {
                // 2.1 Excluir comentários dos pins encontrados
                const pinIds = pins.map(pin => pin.id);
                const { error: commentsError } = await supabase
                    .from('comments')
                    .delete()
                    .in('id', pinIds);

                if (commentsError) {
                    console.error('Erro ao excluir comentários:', commentsError);
                    return;
                }
            }

            // 3. Excluir todas as páginas
            const { error: pagesDeleteError } = await supabase
                .from('pages')
                .delete()
                .eq('document_id', image.document_id);

            if (pagesDeleteError) {
                console.error('Erro ao excluir páginas:', pagesDeleteError);
                return;
            }

            // 4. Excluir o documento
            const { error: documentError } = await supabase
                .from('documents')
                .delete()
                .eq('id', image.document_id);

            if (documentError) {
                console.error('Erro ao excluir documento:', documentError);
                return;
            }

            // 5. Por último, excluir as imagens do storage
            const { error: storageError } = await supabase.storage
                .from('images')
                .remove(pages.map(p => p.image_url));

            if (storageError) {
                console.error('Erro ao excluir imagens do storage:', storageError);
            }

            // 6. Atualizar a interface e o contexto
            await onDelete(image.document_id);
            await refreshImages();
        } catch (error) {
            console.error('Erro ao deletar documento:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!imageUrl || imageError) {
        return (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-500">Imagem não disponível</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 w-80">
            <div
                className="relative aspect-video cursor-pointer group"
                onClick={() => router.push(`/${image.document_id}`)}
            >
                <Image
                    src={imageUrl}
                    alt={image.imageTitle || 'Imagem'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => setImageError(true)}
                    unoptimized
                />
                <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center mr-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${image.document_id}`);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                    >
                        <EyeIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center"
                    >
                        <ShareIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(e);
                        }}
                        disabled={isDeleting}
                        className={`p-2 bg-white rounded-full shadow-md hover:bg-gray-100 w-8 h-8 flex items-center justify-center ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <TrashIcon className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-sm font-medium p-1 border rounded flex-1"
                                autoFocus
                                onBlur={handleTitleEdit}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleTitleEdit();
                                }}
                            />
                        ) : (
                            <>
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {title || 'Sem título'}
                                </h3>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <PencilIcon className="w-3 h-3 text-gray-400" />
                                </button>
                            </>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(image.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                            <ChatBubbleLeftIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-500 ml-1">{image.active_comments || 0}</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircleIcon className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-500 ml-1">{image.resolved_comments || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            {showShareLink && (
                <div className="absolute bottom-0 left-0 right-0 bg-white p-2 text-xs text-center">
                    Link copiado!
                </div>
            )}
        </div>
    );
}
