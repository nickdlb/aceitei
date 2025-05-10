'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  getUserName,
  updateProfilePhoto,
  removeProfilePhoto,
  uploadPhotoToStorage,
  deletePhotoFromStorage,
} from '@/utils/profileUtils'

interface ProfilePhotoProps {
  photoURL: string
  onUpdatePhoto: (url: string) => void
  userId: string | null
}

const getInitial = (name?: string | null) =>
  typeof name === 'string' && name.length > 0
    ? name.charAt(0).toUpperCase()
    : 'U'

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  photoURL,
  onUpdatePhoto,
  userId,
}) => {
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (userId && photoURL) {
      getUserName(userId)
        .then(setUserName)
        .catch(console.error)
    }
  }, [photoURL, userId])

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    // Validações básicas no client
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    const maxSizeMB = 5

    if (!validTypes.includes(file.type)) {
      alert('Formato inválido. Envie JPEG, PNG ou WEBP.')
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Arquivo muito grande. Máximo permitido: ${maxSizeMB}MB`)
      return
    }

    setNewPhoto(file)
    setUploading(true)

    try {
      const { url } = await uploadPhotoToStorage(file)

      if (photoURL.includes('fotoperfil')) {
        await deletePhotoFromStorage(photoURL)
      }

      await updateProfilePhoto(userId, url)
      onUpdatePhoto(url)
      localStorage.setItem('profilePhoto', url)
    } catch (err) {
      console.error('Erro ao enviar foto', err)
      alert('Erro ao enviar foto. Tente novamente.')
    } finally {
      setUploading(false)
      setNewPhoto(null)
    }
  }

  const handleRemovePhoto = async () => {
    if (userId && photoURL.includes('fotoperfil')) {
      try {
        await deletePhotoFromStorage(photoURL)
        await removeProfilePhoto(userId)
        onUpdatePhoto('')
        localStorage.removeItem('profilePhoto')
      } catch (err) {
        console.error('Erro ao remover foto', err)
      }
    }
  }

  return (
    <div className="flex items-center mb-4">
      <Avatar className="w-20 h-20 mr-4">
        {photoURL && <AvatarImage src={photoURL} alt="Foto do Usuário" />}
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
        {uploading && <p>Enviando...</p>}
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
