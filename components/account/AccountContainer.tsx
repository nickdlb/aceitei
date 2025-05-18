'use client'

import React, { useState, useEffect } from 'react'
import { checkIsAnonymous } from '@/utils/checkIsAnonymous'
import ProfilePhoto from './ProfilePhoto'
import UserInfo from './UserInfo'
import { useAuth } from '@/components/common/auth/AuthProvider'
import { Skeleton } from '@/components/ui/skeleton'
import { SubscriptionInfo } from './SubscriptionInfo'
import { getUserProfile } from '@/utils/profileUtils'
import { StripePlans } from './StripePlans'

const AccountContainer = () => {
  const [photoURL, setPhotoURL] = useState('')
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
  })
  const { session, loading } = useAuth()

  useEffect(() => {
    checkIsAnonymous()

    const fetchUserData = async () => {
      try {
        if (session?.user?.id) {
          const { photoURL, nome } = await getUserProfile(session.user.id)

          setPhotoURL(photoURL)
          setUserData({
            nome,
            email: session.user.email || '',
          })

          localStorage.setItem('profilePhoto', photoURL)
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error)
      }
    }

    if (!loading && session) {
      fetchUserData()
    }
  }, [session, loading])

  const handleUpdatePhoto = (url: string) => {
    setPhotoURL(url)
  }

  const handleUpdateName = (newName: string) => {
    setUserData(prev => ({ ...prev, nome: newName }))
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="w-[300px] h-[200px]" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pl-6 pt-12">
      <h2 className="text-acpreto text-2xl font-bold">Minha Conta</h2>
      <div className='flex gap-4'>
        <div className='flex flex-col gap-4'>
          <div className="bg-acbgbranco rounded-lg shadow p-6">
          <ProfilePhoto photoURL={photoURL} onUpdatePhoto={handleUpdatePhoto} userId={session?.user?.id || null} />
          <UserInfo userData={userData} onUpdateName={handleUpdateName} userId={session?.user?.id || null} />
        </div>
        <SubscriptionInfo />
        </div>
        <div className='bg-acbgbranco w-fit p-4 rounded-xl'>
          <h2 className='p-2 text-acpreto text-xl font-bold'> Planos </h2>
          <StripePlans/>
        </div>
      </div>
    </div>
  )
}

export default AccountContainer