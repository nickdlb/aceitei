import { useState, useEffect } from 'react';
import loadPins from '@/utils/loadPins';

export const useComments = (id: string) => {
  const [activeComments, setActiveComments] = useState(0);
  const [completedComments, setCompletedComments] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  useEffect(() => {
    const fetchCommentCounts = async () => {
      const pins = await loadPins(id);
      if (pins) {
        const activeCount = pins.filter(pin => pin.status === 'ativo').length;
        const completedCount = pins.filter(pin => pin.status === 'resolvido').length;
        setActiveComments(activeCount);
        setCompletedComments(completedCount);
        setTotalComments(pins.length);
      }
    };
    fetchCommentCounts();
  }, [id]);

  return {
    activeComments,
    completedComments,
    totalComments
  };
};