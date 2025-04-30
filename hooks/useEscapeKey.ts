import { useEffect } from 'react';

export function useEscapeKey(editingPinId: string | null, setEditingPinId: (id: string | null) => void, pins: any[], CommentDelete: (pinId: string) => Promise<void>) {
    useEffect(() => {
        const handleKeyDown = async (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (editingPinId) {
                    const editingPin = pins.find(pin => pin.id === editingPinId);

                    if (editingPin && (!editingPin.comment || editingPin.comment.trim() === '')) {
                        await CommentDelete(editingPinId);
                    } else {
                        setEditingPinId(null);
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [editingPinId, setEditingPinId, pins, CommentDelete]);
}
