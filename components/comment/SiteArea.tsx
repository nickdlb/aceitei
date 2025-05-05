import React, { useState, useRef, useCallback } from 'react'
import ImageAreaHeader from './ImageAreaHeader'
import ImagePinSite from './ImagePinSite'
import { ImageAreaProps } from '@/types'
import { usePageContext } from '@/contexts/PageContext'
import { useIframePinInteraction } from '@/hooks/usePinIframe' // ⬅️ novo hook modularizado

interface Props extends ImageAreaProps {
  onTogglePages: () => void
}

const SiteArea: React.FC<Props> = ({
  exibirImagem,
  imageId,
  pins,
  handleImageClick,
  draggingPin,
  setDraggingPin,
  isDragging,
  setIsDragging,
  updatePinPosition,
  imageRef,
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

  // 🔁 Hook que trata clique e renderização de pins no iframe
  useIframePinInteraction({ iframeRef, pins, handleImageClick })

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

  const getFileFormat = (url: string | undefined) => {
    if (!url) return ''
    const ext = url.split('.').pop()?.toLowerCase() || ''
    return ext === 'jpg' ? 'JPEG' : ext.toUpperCase()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(exibirImagem)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${documentData.title || 'imagem'}.${getFileFormat(exibirImagem).toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao baixar imagem:', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen flex-1">
      <ImageAreaHeader
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
        getFileFormat={getFileFormat}
        handleDownload={handleDownload}
        pagesCount={pages.length}
      />
      <div ref={containerRef} className="flex-1 overflow-auto relative flex items-start justify-center bg-acbg">
        <div ref={scrollContainerRef} className="relative w-full flex justify-center">
          <div className="relative w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
            <iframe
              ref={iframeRef}
              style={{ visibility: 'visible', width: '100%', height: '100%' }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-presentation allow-popups allow-popups-to-escape-sandbox"
              src={`/api/proxy?url=${documentData?.url}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteArea
