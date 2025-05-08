'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/common/auth/AuthProvider'
import { supabase } from '@/utils/supabaseClient'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

const getInitial = (name?: string | null) =>
  typeof name === 'string' && name.length > 0
    ? name.charAt(0).toUpperCase()
    : 'U'

export const UserProfile = () => {
  const { session } = useAuth()
  const [userName, setUserName] = useState('Usuário Anônimo')
  const [userPhoto, setUserPhoto] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('users')
          .select('nome, fotoperfil')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
          return
        }

        if (data) {
          setUserName(data.nome)
          setUserPhoto(data.fotoperfil || '')
        }
      }
    }

    fetchUserProfile()
  }, [session])

  return (
    <div className="p-4">
      <Link href="/account">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          {userPhoto ? (
            <AvatarImage src={userPhoto} alt="Foto do Usuário" />
          ) : null}
          <AvatarFallback>{getInitial(userName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-actextocinza font-medium">{userName}</span>
          <span className="hidden md:block text-xs">Seja Bem Vindo ao Feedybacky</span>
        </div>
      </div>
      </Link>
    </div>
  )
}

export default UserProfile
