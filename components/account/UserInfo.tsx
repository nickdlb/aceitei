'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/common/auth/AuthProvider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateUserName } from '@/utils/profileUtils';
import { toast } from 'sonner';

export interface UserInfoProps {
  userData: {
    nome: string;
    email: string;
  };
  onUpdateName: (newName: string) => void;
  userId: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ userData, onUpdateName, userId }) => {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userData.nome);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { session } = useAuth();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (!editingName) {
      setTempName(userData.nome);
    }
  }, [userData.nome, editingName]);

  const handleEditName = () => {
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleSaveName = async () => {
    if (!userId || tempName.trim() === '') return;

    try {
      const newName = await updateUserName(userId, tempName.trim());
      onUpdateName(newName);
      setEditingName(false);
      toast.success('Nome atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar nome:', error);
      toast.error('Erro ao atualizar nome. Tente novamente.');
    }
  };

  const handleCancelEdit = () => {
    setTempName(userData.nome);
    setEditingName(false);
  };

  const handleBlur = async () => {
    if (editingName) await handleSaveName();
  };

  const handleKeyPress = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleSaveName();
    }
  };

  return (
    <div className="mt-4">
      <div className="text-acpreto flex items-center gap-2">
        <strong>Nome:</strong>
        {editingName ? (
          <Input
            ref={nameInputRef}
            type="text"
            value={tempName}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            className="!text-base !min-w-0 !pl-0 border-none !ring-0"
          />
        ) : (
          <>{userData.nome}</>
        )}
        {!editingName && (
          <Button
            className="text-acpreto bg-acbgbranco"
            onClick={handleEditName}
            variant="outline"
            size="sm"
          >
            Editar
          </Button>
        )}
        {editingName && (
          <Button
            className="text-acpreto bg-acbgbranco border"
            onClick={handleCancelEdit}
            variant="ghost"
            size="sm"
          >
            Cancelar
          </Button>
        )}
      </div>
      <p className="text-acpreto">
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
};

export default UserInfo;
