'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleAuth = async (type: 'login' | 'signup') => {
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    
    if (error) alert(error.message)
    else alert(type === 'login' ? '¡Entraste!' : 'Revisa tu email para confirmar')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-sm space-y-6 bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h1 className="text-3xl font-bold text-[#CCFF00]">Fit IA Coach</h1>
        <p className="text-zinc-400 text-sm">Entrena con inteligencia.</p>
        <input type="email" placeholder="Email" className="w-full p-3 rounded bg-black border border-zinc-700 outline-none focus:border-[#CCFF00]" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" className="w-full p-3 rounded bg-black border border-zinc-700 outline-none focus:border-[#CCFF00]" onChange={e => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={() => handleAuth('login')} className="flex-1 bg-[#CCFF00] text-black font-bold py-3 rounded hover:bg-[#b8e600] transition">Entrar</button>
          <button onClick={() => handleAuth('signup')} className="flex-1 border border-[#CCFF00] text-[#CCFF00] py-3 rounded hover:bg-[#CCFF00] hover:text-black transition">Registro</button>
        </div>
      </div>
    </div>
  )
}