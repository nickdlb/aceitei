'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createSupabaseClient } from '@/utils/supabaseClient';
import { useAuth } from '@/components/auth/AuthProvider';
import UserInfoProps from '@/types/UserInfoProps';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const handleEditName = () => {
    setEditingName(true);
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };

  const handleSaveName = async () => {
    try {
      const { data, error } = await createSupabaseClient
        .from('users')
        .update({ nome: tempName })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      onUpdateName(data.nome);
      setEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleCancelEdit = () => {
    setTempName(userData.nome);
    setEditingName(false);
  };

    const handleBlur = async () => {
        if(editingName) {
            await handleSaveName();
        }
    }

  const handleKeyPress = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleSaveName();
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        {editingName ? (
          <Input
            ref={nameInputRef}
            type="text"
            value={tempName}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            className="w-auto"
            onBlur={handleBlur}
          />
        ) : (
          <p>
            <strong>Nome:</strong> {userData.nome}
          </p>
        )}
        {!editingName && (
          <Button onClick={handleEditName} variant="outline" size="sm">
            Editar
          </Button>
        )}
        {editingName && (
          <Button onClick={handleCancelEdit} variant="ghost" size="sm">
            Cancelar
          </Button>
        )}
      </div>
      <p>
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
};

export default UserInfo;
