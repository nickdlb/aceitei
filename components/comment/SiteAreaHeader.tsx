import React from 'react'
import { Download, Pencil, LayoutList } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from 'react'

interface SiteAreaHeaderProps {
  exibirImagem: string
  isEditingTitle: boolean
  imageTitle: string
  newTitle: string
  zoomLevel: string
  isPagesOpen: boolean
  pagesCount?: number
  handleZoomChange: (value: string) => void
  onTogglePages: () => void
  handleTitleEdit: () => Promise<void>
  toggleEditTitle: () => void
  setNewTitle: (title: string) => void
  handleDownload: () => void
  siteComentar: string
  setSiteComentar: (value: string) => void
}

const SiteAreaHeader: React.FC<SiteAreaHeaderProps> = ({
  zoomLevel,
  handleZoomChange,
  imageTitle,
  isEditingTitle,
  newTitle,
  handleTitleEdit,
  toggleEditTitle,
  setNewTitle,
  siteComentar,
  setSiteComentar
}) => {

  return (
    <div className="h-16 bg-acbgbranco flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {isEditingTitle ? (
          <Input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-sm border-none !ring-0 pl-0 font-medium !leading-8 min-w-full"
            autoFocus
            maxLength={50}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleTitleEdit()
            }}
          />
        ) : (
          <h2 className="text-sm font-medium text-actextocinza">{imageTitle}</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleEditTitle}
          className="text-acpreto min-w-fit hover:text-aclaranja"
        >
          <Pencil className="size-4" />
        </Button>
        <p className="min-w-fit text-xs text-actextocinza">
        </p>
      </div>
      <div className='flex gap-4'>
        <Button onClick={() => setSiteComentar('comentar')} variant={'outline'} className={`${siteComentar === 'comentar' ? 'bg-blue-700 text-white' : ''}`}>Comentar</Button>
        <Button onClick={() => setSiteComentar('navegar')} variant={'outline'} className={`${siteComentar === 'navegar' ? 'bg-blue-700 text-white' : ''}`}>Navegar</Button>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={zoomLevel}
          onChange={(e) => handleZoomChange(e.target.value)}
          className="rounded px-2 py-1 text-sm text-acpretohover"
        >
          <option value="100">100%</option>
          <option value="150">150%</option>
          <option value="200">200%</option>
        </select>
      </div>
    </div>
  )
}

export default SiteAreaHeader
