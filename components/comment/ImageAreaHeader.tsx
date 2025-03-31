import React from 'react';
import { Download, Pencil, LayoutList } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageAreaHeaderProps {
  imageTitle: string;
  exibirImagem: string;
  isEditingTitle: boolean;
  newTitle: string;
  zoomLevel: string;
  isPagesOpen: boolean;
  handleTitleEdit: () => Promise<void>;
  getFileFormat: (url: string | undefined) => string;
  handleDownload: () => Promise<void>;
  handleZoomChange: (value: string) => void;
  onTogglePages: () => void;
  setNewTitle: (value: string) => void;
}

const ImageAreaHeader: React.FC<ImageAreaHeaderProps> = ({
  imageTitle,
  exibirImagem,
  isEditingTitle,
  newTitle,
  zoomLevel,
  isPagesOpen,
  handleTitleEdit,
  getFileFormat,
  handleDownload,
  handleZoomChange,
  onTogglePages,
  setNewTitle
}) => {
  const getFileFormatLocal = (url: string | undefined) => {
    if (!url) return '';
    const extension = url.split('.').pop()?.toLowerCase() || '';
    return extension === 'jpg' ? 'JPEG' : extension.toUpperCase();
  };

  const handleDownloadLocal = async () => {
    try {
      const response = await fetch(exibirImagem);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageTitle || 'imagem'}.${getFileFormatLocal(exibirImagem).toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
    }
  };

  const handleZoomChangeLocal = (value: string) => {
    handleZoomChange(value);
  };

  return (
    <div className="h-14 bg-acbgbranco flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-sm border-none !ring-0 pl-0 font-medium !leading-8"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTitleEdit();
                }
              }}
            />
          ) : (
            <h2 className="text-sm font-medium text-actextocinza">{imageTitle}</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTitleEdit}
            className="text-acpreto hover:text-aclaranja"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-actextocinza">Formato: {getFileFormatLocal(exibirImagem)}</p>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={zoomLevel}
          onChange={(e) => handleZoomChangeLocal(e.target.value)}
          className="rounded px-2 py-1 text-sm text-acpretohover"
        >
          <option value="100">100%</option>
          <option value="150">150%</option>
          <option value="200">200%</option>
        </select>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownloadLocal}
          className="text-acpreto hover:text-acazul"
        >
          <Download className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePages}
          className="text-acpreto hover:text-aclaranja"
        >
          <LayoutList className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ImageAreaHeader;
