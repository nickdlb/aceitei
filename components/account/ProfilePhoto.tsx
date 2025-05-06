'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface ProfilePhotoProps {
  photoURL: string
  onUpdatePhoto: (url: string) => void
  userId: string | null
}

const getInitial = (name?: string | null) =>
  typeof name === 'string' && name.length > 0
    ? name.charAt(0).toUpperCase()
    : 'U'

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ photoURL, onUpdatePhoto, userId }) => {
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (userId) {
          const { data, error } = await supabase
            .from('users')
            .select('nome')
            .eq('user_id', userId)
            .single()

          if (error) {
            console.error('Error fetching user name:', error)
            return
          }
          if (data) {
            setUserName(data.nome || '')
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    if (photoURL) {
      fetchUserName()
    }
  }, [photoURL, userId])

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewPhoto(file)
      await uploadPhoto(file)
    }
  }

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      const fileName = `profile-${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('fotoperfil')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const url = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/fotoperfil/${fileName}`

      if (photoURL && photoURL.includes('fotoperfil')) {
        const oldFileName = photoURL.split('/').pop()
        if (oldFileName) {
          await supabase.storage.from('fotoperfil').remove([oldFileName])
        }
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ fotoperfil: url })
        .eq('user_id', userId)

      if (updateError) throw updateError

      onUpdatePhoto(url)
      localStorage.setItem('profilePhoto', url)
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setUploading(false)
      setNewPhoto(null)
    }
  }

  const handleRemovePhoto = async () => {
    try {
      if (photoURL && photoURL.includes('fotoperfil')) {
        const oldFileName = photoURL.split('/').pop()
        if (oldFileName) {
          await supabase.storage.from('fotoperfil').remove([oldFileName])
        }
      }

      const { error } = await supabase
        .from('users')
        .update({ fotoperfil: null })
        .eq('user_id', userId)

      if (error) throw error

      onUpdatePhoto('')
      localStorage.removeItem('profilePhoto')
    } catch (error) {
      console.error('Error removing photo:', error)
    }
  }

  return (
    <div className="flex items-center mb-4">
      <Avatar className="w-20 h-20 mr-4">
        {photoURL ? (
          <AvatarImage src={photoURL} alt="Foto do Usuário" />
        ) : null}
        <AvatarFallback>{getInitial(userName)}</AvatarFallback>
      </Avatar>

      <div>
        <Button className="bg-acbgbranco" asChild variant="outline">
          <label htmlFor="photoUpload" className="cursor-pointer text-acpreto">
            Alterar Foto
          </label>
        </Button>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        {uploading && <p>Uploading...</p>}
        {photoURL && (
          <Button
            onClick={handleRemovePhoto}
            variant="outline"
            className="block mt-2 bg-transparent hover:text-acvermelho"
          >
            Remover Foto
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProfilePhoto
