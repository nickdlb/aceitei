'use client'
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from 'react';
import { ShowImageById } from '@/hooks/showImageByIdHook';
import { insertPin } from '@/utils/insertPinSupa';
import loadPins from '@/utils/loadPins';
import { formatDate } from '@/utils/formatDate';
import { deletePin } from '@/utils/deletePin';
import { updatePinComment } from '@/utils/updatePinComment';
import { updatePinStatus } from '@/utils/updatePinStatus';
import Link from 'next/link';
import { PencilIcon, CheckIcon, CogIcon } from '@heroicons/react/24/outline';
import RightSidebar from '@/components/sidebar/RightSidebar';

interface Pin {
    id: string;
    x: number;
    y: number;
    num: number;
    comment: string;
    created_at: string;
    status: 'ativo' | 'resolvido';
}

export default function Page() {
    const { id } = useParams();
    const router = useRouter();
    const [exibirImagem, setExibirImagem] = useState('');
    const [pins, setPins] = useState<Pin[]>([]);
    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const [comments, setComments] = useState<{[key: string]: string}>({});
    const [statusFilter, setStatusFilter] = useState<'ativo' | 'resolvido'>('ativo');
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [draggingPin, setDraggingPin] = useState<Pin | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Hook personalizado para carregar a imagem
    ShowImageById(id, exibirImagem, setExibirImagem);

    // Carrega os pins quando a página inicializa
    useEffect(() => {
        const carregarPins = async () => {
            if (id) {
                const pinsCarregados = await loadPins(id);
                if (pinsCarregados) {
                    const pinsFormatados = pinsCarregados.map(pin => ({
                        id: pin.id,
                        x: pin.pos_x,
                        y: pin.pos_y,
                        num: pin.pin_number,
                        comment: pin.comment,
                        created_at: pin.created_at,
                        status: pin.status || 'ativo'
                    }));
                    setPins(pinsFormatados);
                    
                    const commentState = pinsCarregados.reduce((acc, pin) => ({
                        ...acc,
                        [pin.id]: pin.comment
                    }), {});
                    setComments(commentState);
                }
            }
        };

        carregarPins();
    }, [id]);

    useEffect(() => {
        if (imageRef.current) {
            const img = imageRef.current;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const container = imageContainerRef.current;

            if (container) {
                if (aspectRatio > 1) {
                    container.style.width = '-webkit-fill-available';
                    container.style.height = 'auto';
                } else {
                    container.style.height = '-webkit-fill-available';
                    container.style.width = 'auto';
                }
            }
        }
    }, [exibirImagem]);

    const handleImageClick = async (event: React.MouseEvent<HTMLImageElement>) => {
        try {
            const target = event.target as HTMLImageElement;
            const rect = target.getBoundingClientRect();
            const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
            const yPercent = ((event.clientY - rect.top) / rect.height) * 100;
            let pin_Number: number;

            // Verifica se há um pin em edição e se o comentário está vazio
            const pinBeingEdited = pins.find(pin => pin.id === editingPinId);
            if (editingPinId && !comments[editingPinId].trim() && pinBeingEdited) {
                pin_Number = pinBeingEdited.num; // Manter o mesmo número do pin
                await deletePin(editingPinId);
                setPins(pins.filter(pin => pin.id !== editingPinId));
                setComments(prev => {
                    const newComments = { ...prev };
                    delete newComments[editingPinId];
                    return newComments;
                });
                setEditingPinId(null); // Reseta editingPinId após a exclusão
            } else {
                pin_Number = pins.length + 1; // Incrementar apenas se não houver pin em edição ou comentário
            }

            const newPinData = await insertPin(id, xPercent, yPercent, pin_Number, '');
            
            if (newPinData && newPinData[0]) {
                const newPin = {
                    id: newPinData[0].id,
                    x: xPercent,
                    y: yPercent,
                    num: pin_Number,
                    comment: '',
                    created_at: new Date().toISOString(),
                    status: 'ativo' as const
                };
                
                setPins(prevPins => [...prevPins, newPin]);
                setComments(prev => ({ ...prev, [newPin.id]: '' }));
                setEditingPinId(newPin.id);
                // Focus no input após a criação
                if (commentInputRef.current) {
                    commentInputRef.current.focus();
                }
            }
        } catch (error) {
            console.error("Erro ao adicionar pin:", error);
        }
    };

    const handleStatusChange = async (pinId: string) => {
        try {
            const pin = pins.find(p => p.id === pinId);
            if (!pin) return;

            const newStatus = pin.status === 'ativo' ? 'resolvido' : 'ativo';
            await updatePinStatus(pinId, newStatus);
            
            setPins(pins.map(pin => 
                pin.id === pinId 
                    ? { ...pin, status: newStatus }
                    : pin
            ));
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    const handleCommentChange = (pinId: string, value: string) => {
        setComments(prev => ({ ...prev, [pinId]: value }));
    };

    const handleCommentSave = async (pinId: string) => {
        try {
            const comment = comments[pinId];
            if (!comment.trim()) { // Verifica se o comentário está vazio após o trim
                await deletePin(pinId);
                setPins(pins.filter(pin => pin.id !== pinId));
                setEditingPinId(null); // Reseta editingPinId após a exclusão
                return;
            }
            await updatePinComment(pinId, comment);
            setPins(pins.map(pin => 
                pin.id === pinId 
                    ? { ...pin, comment: comment }
                    : pin
            ));
            setEditingPinId(null);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error("Erro ao atualizar comentário:", error);
        }
    };

    const startEditing = (pinId: string) => {
        setEditingPinId(pinId);
        // Focus no input após iniciar a edição
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = formatDate(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${formattedDate} ${hours}:${minutes}`;
    };

    const handleDeletePin = async (pinId: string) => {
        try {
            await deletePin(pinId);
            setPins(pins.filter(pin => pin.id !== pinId));
            setComments(prev => {
                const newComments = { ...prev };
                delete newComments[pinId];
                return newComments;
            });
            setEditingPinId(null); // Reseta editingPinId após a exclusão
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error("Erro ao deletar pin:", error);
        }
    };

    const handleKeyPress = async (event: React.KeyboardEvent, pinId: string) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            await handleCommentSave(pinId);
        }
    };

    const filteredPins = pins.filter(pin => pin.status === statusFilter);

    const handlePinMouseDown = (pin: Pin) => {
        setDraggingPin(pin);
        setIsDragging(true);
    };

    const handlePinMouseUp = async (pin: Pin) => {
        setIsDragging(false);
        if (draggingPin) {
            const imageRect = imageRef.current?.getBoundingClientRect();
            if (imageRect) {
                const xPercent = ((event.clientX - imageRect.left) / imageRect.width) * 100;
                const yPercent = ((event.clientY - imageRect.top) / imageRect.height) * 100;
                await updatePinPosition(pin.id, xPercent, yPercent);
            }
        }
        setDraggingPin(null);
    };

    const handlePinMouseMove = (event: React.MouseEvent) => {
        if (isDragging && draggingPin) {
            const imageRect = imageRef.current?.getBoundingClientRect();
            if (imageRect) {
                const xPercent = ((event.clientX - imageRect.left) / imageRect.width) * 100;
                const yPercent = ((event.clientY - imageRect.top) / imageRect.height) * 100;
                setPins(prevPins => prevPins.map(pin => 
                    pin.id === draggingPin.id 
                        ? { ...pin, x: xPercent, y: yPercent } 
                        : pin
                ));
            }
        }
    };

    const updatePinPosition = async (pinId: string, x: number, y: number) => {
        try {
            await supabase
                .from('markers')
                .update({ pos_x: x, pos_y: y })
                .eq('id', pinId);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Erro ao atualizar posição do pin:', error);
        }
    };

    return (
        <div className="w-full h-screen flex" onMouseMove={handlePinMouseMove} onMouseUp={handlePinMouseUp}>
            {/* Sidebar */}
            <div id="sidebar" className="w-96 bg-gray-100 border-r border-gray-300 flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b bg-white border-b-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded"></div>
                        <div className="flex items-center justify-between flex-1">
                            <Link href="/" className="font-medium hover:text-blue-600">
                                Aceitei
                            </Link>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Free</span>
                        </div>
                    </div>
                </div>

                {/* Filtros de Status */}
                <div className="px-4 py-3 bg-white border-b border-b-gray-300">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('ativo')}
                            className={`px-3 py-1 rounded text-sm ${
                                statusFilter === 'ativo' 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            Ativos
                        </button>
                        <button
                            onClick={() => setStatusFilter('resolvido')}
                            className={`px-3 py-1 rounded text-sm ${
                                statusFilter === 'resolvido' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            Resolvidos
                        </button>
                    </div>
                </div>

                {/* Contador de Comentários */}
                <div className="px-4 py-2 bg-white border-b border-b-gray-300">
                    <span className="font-medium">
                        Total de Comentários: {filteredPins.length}
                    </span>
                </div>

                {/* Lista de Comentários */}
                <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh - 100px)] bg-white">
                    <div className="space-y-4">
                        {filteredPins.sort((a, b) => a.num - b.num).map((pin) => (
                            <div key={pin.id} className="bg-white rounded-lg p-4 shadow">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-black">{pin.num}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            pin.status === 'ativo' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {pin.status === 'ativo' ? 'Ativo' : 'Resolvido'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {formatDateTime(pin.created_at)}
                                        </span>
                                        <button
                                            onClick={() => handleDeletePin(pin.id)}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                                
                                {editingPinId === pin.id ? (
                                    <div>
                                        <textarea
                                            ref={commentInputRef}
                                            value={comments[pin.id] || ''}
                                            onChange={(e) => handleCommentChange(pin.id, e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, pin.id)}
                                            className="w-full p-2 border rounded mb-2 min-h-[60px] resize-none text-sm"
                                            placeholder="Comentário..."
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleCommentSave(pin.id)}
                                            disabled={!comments[pin.id]?.trim()}
                                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                        >
                                            Confirmar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-gray-700">
                                            {pin.comment}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditing(pin.id)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(pin.id)}
                                                className={`${
                                                    pin.status === 'ativo' 
                                                        ? 'text-yellow-500 hover:text-yellow-600' 
                                                        : 'text-green-500 hover:text-green-600'
                                                }`}
                                            >
                                                {pin.status === 'ativo' ? <CheckIcon className="w-4 h-4" /> : <CogIcon className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Área principal da imagem */}
            <div className="flex container-imagem h-full items-center justify-center overflow-hidden" ref={imageContainerRef}>
                <div className="relative h-fit w-fit mx-auto"> {/* Added mx-auto and p-4 */}
                    <img 
                        src={exibirImagem} 
                        onClick={handleImageClick} 
                        className="max-w-screen-md h-fit w-fit max-h-screen max-w-screen object-contain imagem-comentario" 
                        alt="Interactive image"
                        ref={imageRef}
                    />

                    {filteredPins.map((pin) => (
                        <div
                            key={pin.id}
                            className={`absolute text-xs text-black flex items-center justify-center font-bold w-5 h-5 ${
                                pin.status === 'ativo' ? 'bg-yellow-500' : 'bg-green-500'
                            } rounded-full cursor-pointer hover:cursor-grab hover:opacity-90`}
                            style={{ 
                                left: `${pin.x}%`, 
                                top: `${pin.y}%` 
                            }}
                            onMouseDown={() => handlePinMouseDown(pin)}
                        >
                            {pin.num}
                        </div>
                    ))}
                </div>
            </div>
            {/* Right Sidebar */}
            <div id="right-sidebar" className="w-96 bg-gray-100 border-l border-gray-300 flex flex-col h-full">
                <RightSidebar />
            </div>
        </div>
    );
}
