'use client'
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from 'react';
import { ShowImageById } from '@/hooks/showImageByIdHook';
import { insertPin } from '@/utils/insertPinSupa';
import loadPins from '@/utils/loadPins';
import { deletePin } from '@/utils/deletePin';
import { updatePinComment } from '@/utils/updatePinComment';
import { updatePinStatus } from '@/utils/updatePinStatus';
import { supabase } from '@/utils/supabaseClient';
import Sidebar from '@/components/Sidebar';
import ImageArea from '@/components/image/ImageArea';
import { Pin } from '@/types/Pin';

export default function Page() {
    const { id } = useParams();
    const [exibirImagem, setExibirImagem] = useState('');
    const [pins, setPins] = useState<Pin[]>([]);
    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const [comments, setComments] = useState<{[key: string]: string}>({});
    const [statusFilter, setStatusFilter] = useState<'ativo' | 'resolvido'>('ativo');
    const [refreshKey, setRefreshKey] = useState(0);
    const [draggingPin, setDraggingPin] = useState<Pin | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    ShowImageById(id, exibirImagem, setExibirImagem);

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
    }, [id, refreshKey]);

    const handleImageClick = async (xPercent: number, yPercent: number) => {
        try {
            const pinBeingEdited = pins.find(pin => pin.id === editingPinId);
            let pin_Number: number;

            if (editingPinId && !comments[editingPinId].trim() && pinBeingEdited) {
                pin_Number = pinBeingEdited.num;
                await deletePin(editingPinId);
                setPins(pins.filter(pin => pin.id !== editingPinId));
                setComments(prev => {
                    const newComments = { ...prev };
                    delete newComments[editingPinId];
                    return newComments;
                });
                setEditingPinId(null);
            } else {
                pin_Number = pins.length + 1;
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
            setRefreshKey(prevKey => prevKey + 1);
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
            if (!comment.trim()) {
                await deletePin(pinId);
                setPins(pins.filter(pin => pin.id !== pinId));
                setEditingPinId(null);
                setRefreshKey(prevKey => prevKey + 1);
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

    const handleDeletePin = async (pinId: string) => {
        try {
            await deletePin(pinId);
            setPins(pins.filter(pin => pin.id !== pinId));
            setComments(prev => {
                const newComments = { ...prev };
                delete newComments[pinId];
                return newComments;
            });
            setEditingPinId(null);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error("Erro ao deletar pin:", error);
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

    const filteredPins = pins.filter(pin => pin.status === statusFilter);

    return (
        <div className="w-full h-screen flex">
            <Sidebar 
                pins={filteredPins}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                editingPinId={editingPinId}
                comments={comments}
                handleCommentChange={handleCommentChange}
                handleCommentSave={handleCommentSave}
                handleDeletePin={handleDeletePin}
                handleStatusChange={handleStatusChange}
                setEditingPinId={setEditingPinId}
            />
            <ImageArea
                exibirImagem={exibirImagem}
                pins={filteredPins}
                handleImageClick={handleImageClick}
                draggingPin={draggingPin}
                setDraggingPin={setDraggingPin}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                updatePinPosition={updatePinPosition}
            />
        </div>
    );
}