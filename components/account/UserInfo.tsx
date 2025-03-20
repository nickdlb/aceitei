'use client';

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import UserInfoProps from '@/types/UserInfoProps';

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
      const { data, error } = await supabase
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
          <input
            ref={nameInputRef}
            type="text"
            value={tempName}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            className="border rounded px-2 py-1 focus:outline-none"
            onBlur={handleSaveName}
          />
        ) : (
          <p>
            <strong>Nome:</strong> {userData.nome}
          </p>
        )}
        {!editingName && (
          <button
            onClick={handleEditName}
            className="text-blue-500 hover:text-blue-700"
          >
            Editar
          </button>
        )}
        {editingName && (
          <button
            onClick={handleCancelEdit}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        )}
      </div>
      <p>
        <strong>Email:</strong> {email}
      </p>
    </div>
  );
};

export default UserInfo;
