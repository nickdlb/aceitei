import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, MessageSquare, CheckCircle } from 'lucide-react';
import CardContentProps from '@/types/CardContentProps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const CardContent = ({
  title,
  created_at,
  active_comments,
  resolved_comments,
  isEditing,
  setTitle,
  handleTitleEdit,
  setIsEditing,
}: CardContentProps) => {
  return (
    <div className="pb-4 pt-2 px-4">
      <div className="!p-0 flex gap-1 flex-col">
        <div className="h-8 flex items-center">
          {isEditing ? (
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm text-acpreto font-medium !leading-8 !p-0 !border-none !ring-0 flex-1"
              autoFocus
              onBlur={handleTitleEdit}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleTitleEdit();
              }}
            />
          ) : (
            <>
              <h3 className="text-sm font-medium text-actextocinza truncate">
                {title || 'Sem título'}
              </h3>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                variant="ghost"
                size="icon"
                className="p-1 rounded-full"
              >
                <Edit className="w-3 h-3 text-actextocinza" />
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 text-actextocinza" />
            <span className="text-xs text-actextocinza ml-1">
              {active_comments || 0}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-actextocinza" />
            <span className="text-xs text-actextocinza ml-1">
              {resolved_comments || 0}
            </span>
          </div>
          <p className="text-xs text-actextocinza">
            {format(new Date(created_at), "d'/'MM'/'yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  );
};
