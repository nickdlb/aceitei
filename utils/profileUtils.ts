'use server'

import { supabase } from '@/utils/supabaseClient'

export async function getUserData(userId: string): Promise<any> {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data || {}
}

export async function updateUserName(userId: string, newName: string): Promise<string> {
  const { data, error } = await supabase
    .from('users')
    .update({ nome: newName })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data.nome
}

export async function getUserProfile(userId: string): Promise<{
  photoURL: string
  nome: string
}> {
  const { data, error } = await supabase
    .from('users')
    .select('fotoperfil, nome')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  return {
    photoURL: data.fotoperfil || '',
    nome: data.nome || ''
  }
}

export async function updateProfilePhoto(userId: string, url: string): Promise<string> {
  const { data, error } = await supabase
    .from('users')
    .update({ fotoperfil: url })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data.fotoperfil
}

export async function removeProfilePhoto(userId: string): Promise<null> {
  const { data, error } = await supabase
    .from('users')
    .update({ fotoperfil: null })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return null
}

export async function uploadPhotoToStorage(file: File): Promise<{
  url: string
  fileName: string
}> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSizeMB = 5

  if (!validTypes.includes(file.type)) {
    throw new Error('Formato de imagem inválido.')
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error('Imagem muito grande. Máximo 5MB.')
  }

  const sanitizedFileName = file.name
    .replace(/[^\w.-]/g, '_')
    .toLowerCase()

  const fileName = `profile-${Date.now()}-${sanitizedFileName}`

  const { error } = await supabase.storage
    .from('fotoperfil')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const url = `https://nokrffogsfxouxzrrkdp.supabase.co/storage/v1/object/public/fotoperfil/${fileName}`
  return { url, fileName }
}

export async function deletePhotoFromStorage(fileUrl: string): Promise<void> {
  const fileName = fileUrl.split('/').pop()
  if (!fileName) throw new Error('Nome do arquivo inválido')

  const { error } = await supabase.storage
    .from('fotoperfil')
    .remove([fileName])

  if (error) throw error
}
