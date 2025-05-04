import React, { useState, useRef, useCallback } from 'react'
import ImagePin from './ImagePin'
import ImageAreaHeader from './ImageAreaHeader'
import { ImageAreaProps } from '@/types'
import { usePageContext } from '@/contexts/PageContext'

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

  return (
    <div className="flex-1 flex-col">
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

      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative flex items-start justify-center bg-acbg"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <div
          ref={scrollContainerRef}
          className="relative transition-transform duration-300 ease-in-out pt-4"
        >
          <div className="relative">
            <iframe
              width="600px"
              height="800px"
              src={documentData?.url ?? 'https://agenciadlb.com.br'}
            />
            <div
              onClick={handleDivClick}
              className="absolute top-0 left-0 w-full h-full z-10"
              style={{ background: 'transparent', cursor: 'crosshair' }}
            />
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
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteArea
