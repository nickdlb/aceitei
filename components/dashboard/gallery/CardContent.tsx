'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCardContext } from '@/contexts/CardContext';
import { createSupabaseClient } from '@/utils/supabaseClient';

export const CardContent = () => {
  const { pageData, documentData } = useCardContext();
  const [title, setTitle] = useState(documentData.title || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleEdit = async () => {
    const finalTitle = title.trim() === '' ? 'Sem título' : title;

    try {
      const { error } = await createSupabaseClient
        .from('documents')
        .update({ title: finalTitle })
        .eq('id', documentData.id);

      if (error) throw error;

      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  };

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
              onKeyDown={(e) => {
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
              {pageData.active_comments || 0}
            </span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-actextocinza" />
            <span className="text-xs text-actextocinza ml-1">
              {pageData.resolved_comments || 0}
            </span>
          </div>
          <p className="text-xs text-actextocinza">
            {format(new Date(documentData.created_at), "d'/'MM'/'yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  );
};