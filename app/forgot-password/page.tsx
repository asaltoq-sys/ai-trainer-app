'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })
    setSent(true)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Recuperar Contraseña</h2>
      {sent ? <p>Revisa tu email.</p> : (
        <div className="w-full max-w-sm space-y-4">
          <input type="email" placeholder="Tu email" className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setEmail(e.target.value)} />
          <button onClick={handleReset} className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl">Enviar enlace</button>
        </div>
      )}
    </div>
  )
}