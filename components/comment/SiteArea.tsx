import React, { useState, useRef, useCallback } from 'react'
import ImagePinSite from './ImagePinSite'
import ImageAreaHeader from './ImageAreaHeader'
import { ImageAreaProps } from '@/types'
import { usePageContext } from '@/contexts/PageContext'
import { useEffect } from 'react'

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
  const { documentData, handleTitleUpdate, pages } = usePageContext()
  const iframeRef = useRef<HTMLIFrameElement>(null)

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
          setIsEditingTitle(false)
        } catch (error) {
          console.error('Erro ao atualizar título do documento:', error)
        }
      } else {
        setIsEditingTitle(false)
        setNewTitle(documentData.title)
      }
    } else {
      setNewTitle(documentData.title)
      setIsEditingTitle(true)
    }
  }

  const toggleEditTitle = () => {
    setIsEditingTitle(!isEditingTitle)
    if (!isEditingTitle) setNewTitle(documentData.title)
  }

  const getFileFormat = (url: string | undefined) => {
    if (!url) return ''
    const extension = url.split('.').pop()?.toLowerCase() || ''
    return extension === 'jpg' ? 'JPEG' : extension.toUpperCase()
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

  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    handleImageClick(x, y)
  }

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
  
    const setupIframeClick = () => {
      const iframeDoc = iframe.contentDocument
      const body = iframeDoc?.body
      if (!iframeDoc || !body) return
  
      body.style.position = 'relative'
      body.style.cursor = 'crosshair'
  
      const handleClick = async (e: MouseEvent) => {
        const rect = body.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        await handleImageClick(x, y)
      }
  
      body.addEventListener('click', handleClick)
  
      return () => {
        body.removeEventListener('click', handleClick)
      }
    }
  
    // Sempre que pins mudarem, o iframe pode ter sido recarregado
    const cleanup = setupIframeClick()
  
    return () => {
      cleanup?.()
    }
  }, [pins, handleImageClick])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentDocument?.body) return
  
    const iframeDoc = iframe.contentDocument
    const body = iframeDoc.body
  
    const renderPinsInIframe = () => {
      // Limpa os anteriores
      const existing = iframeDoc.querySelectorAll('.pin-custom')
      existing.forEach(el => el.remove())
  
      // Cria cada novo pin
      pins.forEach((pin) => {
        const el = iframeDoc.createElement('div')
        el.className = 'pin-custom'
        el.innerText = `${pin.num || ''}`
        el.style.position = 'absolute'
        el.style.left = `${pin.x}%`
        el.style.top = `${pin.y}%`
        el.style.width = '20px'
        el.style.height = '20px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = '#2563eb'
        el.style.border = '2px solid white'
        el.style.color = 'white'
        el.style.fontSize = '12px'
        el.style.display = 'flex'
        el.style.alignItems = 'center'
        el.style.justifyContent = 'center'
        el.style.transform = 'translate(-50%, -50%)'
        el.style.zIndex = '9999'
  
        body.appendChild(el)
      })
    }
  
    renderPinsInIframe()
  }, [pins])

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
        pagesCount={pages.length} />
      <div ref={containerRef} className="flex-1 overflow-auto relative flex items-start justify-center bg-acbg">
        <div ref={scrollContainerRef} className="relative w-full flex justify-center">
          <div className="relative w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
            <iframe ref={iframeRef} style={{ visibility: 'visible', width: '100%', height: '100%' }}
              sandbox="allow-scripts allow-forms allow-same-origin allow-pointer-lock allow-presentation allow-popups allow-popups-to-escape-sandbox" src={`/api/proxy?url=https://ims.ind.br`}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteArea
