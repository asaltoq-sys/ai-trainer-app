'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleAuth = async (type: 'login' | 'signup') => {
    // Aquí está la corrección: añadimos "data" antes de "error"
    const { data, error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    
    if (error) {
      alert(error.message)
    } else if (data?.user) {
      // Comprobamos si ya tiene perfil en la base de datos
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (profile) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-sm space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center">
        <h1 className="text-3xl font-bold text-[#CCFF00]">Fit IA Coach</h1>
        <p className="text-zinc-400 text-sm">Tu entrenador inteligente</p>
        <input type="email" placeholder="Email" className="w-full p-3 rounded bg-black border border-zinc-700 outline-none" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-3 rounded bg-black border border-zinc-700 outline-none" onChange={e => setPassword(e.target.value)} />
        <div className="flex gap-2 pt-2">
          <button onClick={() => handleAuth('login')} className="flex-1 bg-[#CCFF00] text-black font-bold py-3 rounded hover:bg-[#b8e600] transition-colors">Entrar</button>
          <button onClick={() => handleAuth('signup')} className="flex-1 border border-[#CCFF00] text-[#CCFF00] py-3 rounded hover:bg-[#CCFF00] hover:text-black transition-colors">Registro</button>
        </div>
      </div>
    </div>
  )
}