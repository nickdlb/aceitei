'use client';

import React, { useState, useRef, useEffect } from 'react';
import ImagePin from './ImagePin';
import { ImageAreaProps, PinProps } from '@/types';
import ImageAreaHeader from './ImageAreaHeader';
import { usePageContext } from '@/contexts/PageContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { SaveTempComment, CancelTempComment } from '@/utils/tempCommentUtils';

interface Props extends ImageAreaProps {
  onTitleUpdate: (newTitle: string) => Promise<void | undefined>;
  onTogglePages: () => void;
  session: Session | null;
  loadComments: () => Promise<void>;
  pageId: string;
}

const ImageArea: React.FC<Props> = ({
  exibirImagem,
  pins,
  draggingPin,
  setDraggingPin,
  isDragging,
  setIsDragging,
  updatePinPosition,
  imageRef,
  onTitleUpdate,
  onTogglePages,
  isPagesOpen,
  pagesCount,
  session,
  loadComments,
  pageId,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { documentData } = usePageContext();
  const [tempPinData, setTempPinData] = useState<{ x: number; y: number; pageId: string } | null>(null);
  const [tempCommentText, setTempCommentText] = useState('');
  const [showTempCommentBox, setShowTempCommentBox] = useState(false);
  const tempCommentBoxRef = useRef<HTMLDivElement>(null);
  const [tempCommentBoxStyle, setTempCommentBoxStyle] = useState<React.CSSProperties>({});

  const handleImageClickInternal = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!scrollContainerRef.current || isDragging || draggingPin || !imageRef.current) return;
    if (tempCommentBoxRef.current && tempCommentBoxRef.current.contains(e.target as Node)) {
      return;
    }

    const style = window.getComputedStyle(scrollContainerRef.current);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const scale = matrix.a || 1;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / scale;
    const offsetY = (e.clientY - rect.top) / scale;
    const scaledWidth = rect.width / scale;
    const scaledHeight = rect.height / scale;

    const x = (offsetX / scaledWidth) * 100;
    const y = (offsetY / scaledHeight) * 100;

    setTempPinData({ x, y, pageId: pageId });
    setTempCommentText('');
    setShowTempCommentBox(true);
  };

  const handleSaveTempComment = async () => {
    await SaveTempComment(
      tempPinData,
      tempCommentText,
      session,
      pageId,
      pins,
      documentData,
      supabase,
      setShowTempCommentBox,
      setTempPinData,
      setTempCommentText,
      loadComments
    );
  };

  const handleCancelTempComment = () => {
    CancelTempComment(
      setShowTempCommentBox,
      setTempPinData,
      setTempCommentText
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tempCommentBoxRef.current && !tempCommentBoxRef.current.contains(event.target as Node) &&
        imageRef.current && !imageRef.current.contains(event.target as Node)) {
        const targetIsImage = imageRef.current && imageRef.current.contains(event.target as Node);
        if (!targetIsImage && showTempCommentBox) {
          const isClickForNewPin = imageRef.current?.contains(event.target as Node);
          if (!isClickForNewPin) {
            handleCancelTempComment();
          }
        }
      }
    };

    if (showTempCommentBox) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTempCommentBox, imageRef, tempCommentBoxRef]);

  useEffect(() => {
    if (showTempCommentBox && tempPinData && tempCommentBoxRef.current && scrollContainerRef.current && imageRef.current) {
      const commentBoxWidth = tempCommentBoxRef.current.offsetWidth;
      const commentBoxHeight = tempCommentBoxRef.current.offsetHeight;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const containerHeight = scrollContainerRef.current.offsetHeight;
      const imageRect = imageRef.current.getBoundingClientRect();
      const scrollContainerStyle = window.getComputedStyle(scrollContainerRef.current!);
      const scrollMatrix = new DOMMatrixReadOnly(scrollContainerStyle.transform);
      const scale = scrollMatrix.a || 1;
      const pinXOnScaledImage = (tempPinData.x / 100) * (imageRect.width / scale);
      const pinYOnScaledImage = (tempPinData.y / 100) * (imageRect.height / scale);
      let newLeft = pinXOnScaledImage + 20;
      let newTop = pinYOnScaledImage - commentBoxHeight / 2;
      console.log('NewLeft',newLeft, 'commentBoxWidth', commentBoxWidth, 'containerWidth', containerWidth)
         console.log('NewTop',newTop, 'commentBoxHeight', commentBoxHeight, 'containerHeight', containerHeight)
      if (newLeft + commentBoxWidth > containerWidth) {
        newLeft = pinXOnScaledImage - commentBoxWidth - 20;
      }
      if (newLeft < 0) {
        newLeft = 0;
      }
      if (newTop + commentBoxHeight > containerHeight - 30) {
        newTop = containerHeight - commentBoxHeight - 30;
      }
      if (newTop < 0) {
        newTop = 10;
      }
      
      setTempCommentBoxStyle({
        position: 'absolute',
        left: `${newLeft}px`,
        top: `${newTop}px`,
        minWidth: '250px',
        zIndex: 50,
      });

    }
  }, [showTempCommentBox, tempPinData, pins, pageId]);


  return (
    <div className="flex-1 flex-col">
      <ImageAreaHeader
        exibirImagem={exibirImagem}
        onTitleUpdate={onTitleUpdate}
        isPagesOpen={isPagesOpen || false}
        onTogglePages={onTogglePages || (() => { })}
        pagesCount={pagesCount}
        scrollContainerRef={scrollContainerRef}
      />

      <div ref={containerRef} className="flex-1 overflow-auto relative flex items-center justify-center bg-acbg" style={{ height: 'calc(100vh - 3.5rem)' }}>
        <div ref={scrollContainerRef}
          className="relative transition-transform duration-300 ease-in-out pt-4">
          <div className="relative">
            <img ref={imageRef} src={exibirImagem} alt={documentData.title || 'Imagem para comentários'}
              className="max-h-[calc(100vh-5rem)] w-auto object-contain" 
              onClick={handleImageClickInternal} style={{ cursor: `url('/cursor-comentar.svg') 18 18, pointer` }}/>
            {pins.map((pin) => (
              <ImagePin
                key={pin.id}
                pin={pin}
                draggingPin={draggingPin}
                setDraggingPin={setDraggingPin}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                updatePinPosition={updatePinPosition}
                style={{
                  position: 'absolute',
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

            {showTempCommentBox && tempPinData && (
              <ImagePin
                key="temp-pin"
                pin={{
                  id: 'temp-pin',
                  x: tempPinData.x,
                  y: tempPinData.y,
                  page_id: tempPinData.pageId,
                  num: pins.length > 0 ? Math.max(...pins.map(p => p.num)) + 1 : 1,
                  status: 'ativo',
                  user_id: session?.user?.id || 'temp-user',
                  created_at: new Date().toISOString(),
                  comment: tempCommentText,
                  reactions: [],
                  url_comentario: null,
                }}
                draggingPin={null}
                setDraggingPin={() => { }}
                isDragging={false}
                setIsDragging={() => { }}
                updatePinPosition={() => Promise.resolve()}
                style={{
                  position: 'absolute',
                  left: `${tempPinData.x}%`,
                  top: `${tempPinData.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
            {showTempCommentBox && tempPinData && (
              <div ref={tempCommentBoxRef} className="absolute bg-white p-3 rounded-md shadow-xl border border-gray-300" style={tempCommentBoxStyle}
                onClick={(e) => e.stopPropagation()}>
                <textarea value={tempCommentText} onChange={(e) => setTempCommentText(e.target.value)} placeholder="Adicionar comentário..." className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-acazul focus:border-acazul text-sm" rows={3} autoFocus onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveTempComment();
                    } else if (e.key === 'Escape') {
                      handleCancelTempComment();
                    }
                  }}/>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleCancelTempComment}
                    className="text-xs">
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveTempComment} disabled={!tempCommentText.trim()} className="text-xs bg-acazul hover:bg-acazul/90 text-white">
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageArea;
