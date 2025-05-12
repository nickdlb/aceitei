import React, { useState, useRef, useCallback, useEffect } from 'react';
import SiteAreaHeader from './SiteAreaHeader';
import { SiteAreaProps as OriginalSiteAreaProps, PinProps } from '@/types'; // Renamed to avoid conflict
import { usePageContext } from '@/contexts/PageContext';
import { createPinIframe } from '@/hooks/usePinIframe';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  SaveTempComment,
  CancelTempComment
} from '@/utils/tempCommentUtils'; // Corrected import names
import { supabase } from '@/utils/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Define a more specific Props interface for SiteArea, including new ones needed
export interface SiteAreaExtendedProps extends OriginalSiteAreaProps {
  onTogglePages: () => void;
  session: Session | null;
  loadComments: () => Promise<void>;
  // pins prop is already part of OriginalSiteAreaProps
}

interface TempSitePinData {
  xPercent: number;
  yPercent: number;
  clientX: number;
  clientY: number;
  iframePageUrl: string;
  iframeSize: string;
}

const SiteArea: React.FC<SiteAreaExtendedProps> = ({
  exibirImagem,
  pins,
  onTogglePages,
  isPagesOpen,
  session,
  loadComments,
}) => {
  const [zoomLevel, setZoomLevel] = useState('100');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { documentData, handleTitleUpdate, pages, pageId } = usePageContext();
  const [siteComentar, setSiteComentar] = useState(false);
  const { iframeUrl, setIframeUrl } = usePageContext();
  const [tempSitePinData, setTempSitePinData] = useState<TempSitePinData | null>(null);
  const [tempSiteCommentText, setTempSiteCommentText] = useState('');
  const [iframeSize, setIframeSize] = useState('desktop');
  const [showTempSiteCommentBox, setShowTempSiteCommentBox] = useState(false);
  const tempSiteCommentBoxRef = useRef<HTMLDivElement>(null);
  const [tempSiteCommentBoxStyle, setTempSiteCommentBoxStyle] = useState<React.CSSProperties>({});


  const handlePinAttempt = (
    xPercent: number,
    yPercent: number,
    currentIframeUrl: string,
    iframeClientX: number,
    iframeClientY: number
  ) => {
    const iframeRect = iframeRef.current?.getBoundingClientRect();
    if (!iframeRect) return;

    const finalClientX = iframeRect.left + iframeClientX;
    const finalClientY = iframeRect.top + iframeClientY;

    setTempSitePinData({
      xPercent: xPercent,
      yPercent: yPercent,
      clientX: finalClientX,
      clientY: finalClientY,
      iframePageUrl: currentIframeUrl,
      iframeSize: iframeSize
    });
    setTempSiteCommentText('');
    setShowTempSiteCommentBox(true);
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      try {
        const url = iframe.contentWindow?.location.href || '';
        setIframeUrl(url);
      } catch (error) {
        console.warn('Não foi possível acessar a URL do iframe:', error);
        setIframeUrl('');
      }

      iframe.contentWindow?.postMessage({ type: 'set-mode', mode: siteComentar }, '*');
    };

    iframe.addEventListener('load', onLoad);

    return () => {
      iframe.removeEventListener('load', onLoad);
    };
  }, [siteComentar]);

  const extrairUrlFinal = (proxiedUrl: string): string | null => {
    try {
      let atual = proxiedUrl;
      const decoded = decodeURIComponent(decodeURIComponent(proxiedUrl.slice(proxiedUrl.lastIndexOf("http"))))
      if (!decoded) return atual;
      atual = decoded;
      return atual;
    } catch {
      return null;
    }
  };

  const urlRealDoIframe = extrairUrlFinal(iframeUrl)?.slice(8);
  console.log('Essa é a url RealdOIframe', urlRealDoIframe)

  const pinsVisiveisNoIframe = pins.filter(pin => {
    return pin.url_comentario && urlRealDoIframe === pin.url_comentario && iframeSize === iframeSize;
  });

  createPinIframe({
    iframeRef,
    pins: pinsVisiveisNoIframe,
    onPinAttempt: handlePinAttempt,
    iframeUrl,
    siteComentar
  });

  const handleSaveTempSiteComment = async () => {
    if (!tempSitePinData) return;
    const currentDocDataForUtil = documentData ? { id: documentData.id } : null;
    const pinDataForUtil = {
      x: tempSitePinData.xPercent,
      y: tempSitePinData.yPercent,
      pageId: pageId || ''
    };
    const urlfinal = decodeURIComponent(decodeURIComponent(tempSitePinData.iframePageUrl.slice(tempSitePinData.iframePageUrl.lastIndexOf("http")))).slice(8)

    await SaveTempComment(
      pinDataForUtil,
      tempSiteCommentText,
      session,
      pageId || '',
      pins,
      currentDocDataForUtil,
      supabase,
      setShowTempSiteCommentBox,
      () => setTempSitePinData(null),
      setTempSiteCommentText,
      loadComments,
      urlfinal,
      iframeSize,
    );
  };

  const handleCancelTempSiteComment = () => {
    CancelTempComment(
      setShowTempSiteCommentBox,
      () => setTempSitePinData(null),
      setTempSiteCommentText
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tempSiteCommentBoxRef.current && !tempSiteCommentBoxRef.current.contains(event.target as Node)) {
        const iframeBody = iframeRef.current?.contentWindow?.document.body;
        if (iframeBody && iframeBody.contains(event.target as Node)) {
          return;
        }
        handleCancelTempSiteComment();
      }
    };

    if (showTempSiteCommentBox) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTempSiteCommentBox, iframeRef, tempSiteCommentBoxRef]);

  useEffect(() => {
    if (showTempSiteCommentBox && tempSitePinData && tempSiteCommentBoxRef.current) {
      const commentBoxWidth = tempSiteCommentBoxRef.current.offsetWidth;
      const commentBoxHeight = tempSiteCommentBoxRef.current.offsetHeight;

      // Since the box is position: fixed, viewport dimensions are the boundaries.
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // tempSitePinData.clientX and clientY are already viewport-relative click coordinates
      const pinClientX = tempSitePinData.clientX;
      const pinClientY = tempSitePinData.clientY;

      let newLeft = pinClientX + 30; // Default: to the right of the pin
      let newTop = pinClientY - commentBoxHeight / 3; // Default: vertically centered with pin

      // Adjust if overflowing right
      if (newLeft + commentBoxWidth > viewportWidth) {
        newLeft = pinClientX - commentBoxWidth - 15; // Move to the left of the pin
      }

      // Adjust if overflowing left
      if (newLeft < 0) {
        newLeft = 0; // Align with left edge of viewport
      }

      // Adjust if overflowing bottom
      if (newTop + commentBoxHeight > viewportHeight) {
        newTop = viewportHeight - commentBoxHeight; // Align with bottom edge of viewport
      }

      // Adjust if overflowing top
      if (newTop < 0) {
        newTop = 0; // Align with top edge of viewport
      }

      setTempSiteCommentBoxStyle({
        position: 'fixed', // Already fixed, but good to be explicit
        left: `${newLeft}px`,
        top: `${newTop}px`,
        minWidth: '250px',
        zIndex: 99999, // Keep high z-index
      });
    }
  }, [showTempSiteCommentBox, tempSitePinData]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      const doc = iframe.contentWindow.document;
      if (doc) {
        let styleElement = doc.getElementById('custom-cursor-style') as HTMLStyleElement | null;
        if (!styleElement) {
          styleElement = doc.createElement('style');
          styleElement.id = 'custom-cursor-style';
          doc.head.appendChild(styleElement);
        }

        if (siteComentar) {
          // Apply custom cursor to body and all elements within, overriding other styles
          styleElement.innerHTML = `
            body, body * { 
              cursor: url("/cursor-comentar.svg") 18 18, crosshair !important; 
            }
          `;
        } else {
          // Remove custom cursor style override
          styleElement.innerHTML = '';
          // Ensure default cursor is set on body if no other styles apply
          if (doc.body) {
            doc.body.style.cursor = 'default';
          }
        }
      }
    }
  }, [siteComentar, iframeUrl]); // Re-run when siteComentar or iframeUrl changes

  const handleZoomChange = useCallback((value: string) => {
    setZoomLevel(value)
    if (scrollContainerRef.current) {
      const scale = parseInt(value) / 100
      scrollContainerRef.current.style.transform = `scale(${scale})`
      scrollContainerRef.current.style.transformOrigin = 'top center'
    }
  }, [])

  const handleTitleEdit = async () => {
    if (isEditingTitle) {
      if (newTitle.trim()) {
        try {
          await handleTitleUpdate(newTitle)
        } catch (error) {
          console.error('Erro ao atualizar título do documento:', error)
        }
      } else {
        setNewTitle(documentData.title)
      }
      setIsEditingTitle(false)
    } else {
      setNewTitle(documentData.title)
      setIsEditingTitle(true)
    }
  }

  const toggleEditTitle = () => {
    setIsEditingTitle(prev => !prev)
    if (!isEditingTitle) setNewTitle(documentData.title)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(exibirImagem)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao baixar imagem:', error)
    }
  }

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'external-link') {
        const url = event.data.href;

        try {
          const parsed = new URL(url);
          const isInternal = parsed.hostname === window.location.hostname;

          if (isInternal) {
            // Permite navegação interna via pushState
            const iframe = iframeRef.current;
            if (iframe) {
              iframe.src = `/api/proxy?url=${encodeURIComponent(url)}`;
            }
          } else {
            // Exibe aviso e bloqueia navegação
            toast.warning('Link fora do Feedybacky.', {
              action: {
                label: 'Abrir em outra janela',
                onClick: () => window.open(url, '_blank')
              }
            });
          }
        } catch (err) {
          console.error('URL inválida recebida:', url);
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="flex flex-col min-h-screen flex-1">
      <SiteAreaHeader
        siteComentar={siteComentar}
        setSiteComentar={setSiteComentar}
        exibirImagem={exibirImagem}
        zoomLevel={zoomLevel}
        onTogglePages={onTogglePages}
        isPagesOpen={isPagesOpen || false}
        handleZoomChange={handleZoomChange}
        imageTitle={documentData.title}
        newTitle={newTitle}
        isEditingTitle={isEditingTitle}
        toggleEditTitle={toggleEditTitle}
        setNewTitle={setNewTitle}
        handleTitleEdit={handleTitleEdit}
        handleDownload={handleDownload}
        pagesCount={pages.length}
        iframeSize={iframeSize}
        setIframeSize={setIframeSize}
      />
      <div ref={containerRef} className='flex-1 overflow-auto relative flex items-start justify-center bg-acbg'>
        <div ref={scrollContainerRef} className={`${iframeSize === 'mobile' ? 'max-w-[500px]' : 'max-w-full'} relative flex justify-center w-full`}>
          <div className="relative w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
            <iframe ref={iframeRef} style={{ visibility: 'visible', width: '100%', height: '100%' }} sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-presentation allow-popups allow-popups-to-escape-sandbox" src={`/api/proxy?url=${documentData?.url}`} />

            {showTempSiteCommentBox && tempSitePinData && (
              <div
                ref={tempSiteCommentBoxRef}
                className="fixed bg-white p-3 rounded-md shadow-xl border border-gray-300 z-[99999]" // High z-index
                style={tempSiteCommentBoxStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <textarea
                  value={tempSiteCommentText}
                  onChange={(e) => setTempSiteCommentText(e.target.value)}
                  placeholder="Adicionar comentário..."
                  className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-acazul focus:border-acazul text-sm"
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSaveTempSiteComment();
                    } else if (e.key === 'Escape') {
                      handleCancelTempSiteComment();
                    }
                  }}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleCancelTempSiteComment} className="text-xs">
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveTempSiteComment} disabled={!tempSiteCommentText.trim()} className="text-xs bg-acazul hover:bg-acazul/90 text-white">
                    Salvar
                  </Button>
                </div>
              </div>
            )}
            {showTempSiteCommentBox && tempSitePinData && (
              <div
                className="fixed rounded-full bg-blue-500 border-2 border-white shadow-lg"
                style={{
                  left: `${tempSitePinData.clientX}px`,
                  top: `${tempSitePinData.clientY}px`,
                  width: '18px', // Smaller than ImagePin's default 30px
                  height: '18px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: '99998', // Just below comment box
                  pointerEvents: 'none', // So it doesn't interfere with clicks
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteArea;
