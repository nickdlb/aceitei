import React, { useState, useRef, useCallback } from 'react'
import SiteAreaHeader from './SiteAreaHeader'
import { SiteAreaProps } from '@/types'
import { usePageContext } from '@/contexts/PageContext'
import { useIframePinInteraction } from '@/hooks/usePinIframe'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface Props extends SiteAreaProps {
  onTogglePages: () => void
}

const SiteArea: React.FC<Props> = ({
  exibirImagem,
  pins,
  handleImageClick,
  onTogglePages,
  isPagesOpen
}) => {
  const [zoomLevel, setZoomLevel] = useState('100')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { documentData, handleTitleUpdate, pages } = usePageContext()
  const [siteComentar, setSiteComentar] = useState(false);
  const { iframeUrl, setIframeUrl } = usePageContext()

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
  return pin.url_comentario && urlRealDoIframe === pin.url_comentario;
});

  useIframePinInteraction({ iframeRef, pins:pinsVisiveisNoIframe, handleImageClick, iframeUrl, siteComentar});

  // Apply cursor style based on siteComentar state
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

  // useEffect(() => { // This useEffect seems redundant with the one above that handles cursor and postMessage
  // const iframe = iframeRef.current;
  // if (iframe?.contentWindow) {
  //   iframe.contentWindow.postMessage({ type: 'set-mode', mode: siteComentar }, '*');
  // }
  // }, [siteComentar]);

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
      />
      <div ref={containerRef} className="flex-1 overflow-auto relative flex items-start justify-center bg-acbg">
        <div ref={scrollContainerRef} className="relative w-full flex justify-center">
          <div className="relative w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
            <iframe ref={iframeRef} style={{ visibility: 'visible', width: '100%', height: '100%' }} sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-presentation allow-popups allow-popups-to-escape-sandbox" src={`/api/proxy?url=${documentData?.url}`}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteArea
