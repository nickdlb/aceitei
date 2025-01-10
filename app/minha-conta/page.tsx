'use client';

    import React, { useState, useEffect, useRef } from 'react';
    import Sidebar from '@/components/sidebar/Sidebar';
    import { UserCircleIcon } from '@heroicons/react/24/outline';
    import { supabase } from '@/utils/supabaseClient';

    const MinhaConta = () => {
      const [photoURL, setPhotoURL] = useState('');
      const [newPhoto, setNewPhoto] = useState<File | null>(null);
      const [uploading, setUploading] = useState(false);
      const [userData, setUserData] = useState({
        nome: '',
        usuario: '',
        email: '',
      });
      const [editingName, setEditingName] = useState(false);
      const [tempName, setTempName] = useState('');
      const userId = '1';
      const nameInputRef = useRef<HTMLInputElement>(null);

      useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            if (userId) {
              const { data, error } = await supabase
                .from('users')
                .select('fotoperfil, nome, usuario, email')
                .eq('id', userId)
                .single();

              if (error) {
                console.error('Error fetching user profile:', error);
                return;
              }

              if (data) {
                setPhotoURL(data.fotoperfil || '');
                setUserData({
                  nome: data.nome || '',
                  usuario: data.usuario || '',
                  email: data.email || '',
                });
                setTempName(data.nome || '');
                localStorage.setItem('profilePhoto', data.fotoperfil || '');
              }
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };

        fetchUserProfile();
      }, [userId]);

      useEffect(() => {
        const uploadPhoto = async () => {
          if (newPhoto) {
            setUploading(true);
            try {
              const fileName = `profile-${Date.now()}-${newPhoto.name}`;
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('fotoperfil')
                .upload(fileName, newPhoto, {
                  cacheControl: '3600',
                  upsert: false,
                });

              if (uploadError) {
                console.error('Supabase Storage Upload Error:', uploadError);
                throw uploadError;
              }

              const url = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/fotoperfil/${fileName}`;

              if (userId) {
                // Delete old photo if exists
                if (photoURL && photoURL.includes('fotoperfil')) {
                  const oldFileName = photoURL.split('/').pop();
                  if (oldFileName) {
                    const { error: deleteError } = await supabase.storage
                      .from('fotoperfil')
                      .remove([oldFileName]);
                    if (deleteError) {
                      console.error('Error deleting old photo:', deleteError);
                    }
                  }
                }

                const { data: updateData, error: updateError } = await supabase
                  .from('users')
                  .update({ fotoperfil: url })
                  .eq('id', userId);

                if (updateError) {
                  console.error('Supabase Users Update Error:', updateError);
                  throw updateError;
                }
              } else {
                console.error('User ID is undefined, cannot update user profile.');
              }

              setPhotoURL(url);
              localStorage.setItem('profilePhoto', url);
            } catch (error) {
              console.error('Error uploading photo:', error);
            } finally {
              setUploading(false);
              setNewPhoto(null);
            }
          }
        };

        uploadPhoto();
      }, [newPhoto, userId, photoURL]);

      const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          setNewPhoto(e.target.files[0]);
        }
      };

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
            .eq('id', userId)
            .select()
            .single();

          if (error) {
            console.error('Error updating name:', error);
            return;
          }

          setUserData(prev => ({ ...prev, nome: data.nome }));
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

      const handleRemovePhoto = async () => {
        try {
          if (photoURL && photoURL.includes('fotoperfil')) {
            const oldFileName = photoURL.split('/').pop();
            if (oldFileName) {
              const { error: deleteError } = await supabase.storage
                .from('fotoperfil')
                .remove([oldFileName]);
              if (deleteError) {
                console.error('Error deleting old photo:', deleteError);
                return;
              }
            }
          }

          const { data, error } = await supabase
            .from('users')
            .update({ fotoperfil: null })
            .eq('id', userId)
            .select()
            .single();

          if (error) {
            console.error('Error removing photo:', error);
            return;
          }

          setPhotoURL('');
          localStorage.removeItem('profilePhoto');
        } catch (error) {
          console.error('Error removing photo:', error);
        }
      };

      return (
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 p-6">
            <h1 className="text-2xl font-bold mb-4">Minha Conta</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Foto do Usuário"
                    className="w-20 h-20 rounded-full mr-4"
                  />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-gray-400 mr-4" />
                )}
                <div>
                  <label htmlFor="photoUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
                    Alterar Foto
                  </label>
                  <input
                    type="file"
                    id="photoUpload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {uploading && <p>Uploading...</p>}
                  {photoURL && (
                    <button
                      onClick={handleRemovePhoto}
                      className="text-red-500 hover:text-red-700 block mt-2"
                    >
                      Remover Foto
                    </button>
                  )}
                </div>
              </div>
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
                  <strong>Usuário:</strong> {userData.usuario}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default MinhaConta;
