'use client'

import { useRouter } from 'next/navigation'

const HomePage = () => {

  const router = useRouter()

  const handleCheckout = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'supabase-user-id' }),
    })
  
    const text = await res.text()
  
    if (!res.ok) {
      console.error('Erro na API:', text)
      return
    }
  
    try {
      const data = JSON.parse(text)
      window.location.href = data.url
    } catch (err) {
      console.error('Erro ao parsear JSON:', err)
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <button onClick={handleCheckout}>Assinar agora</button>
    </main>
  );
};

export default HomePage;
