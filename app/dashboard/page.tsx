'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    fetchProfile()
  }, [])

  if (!profile) return <div className="bg-black min-h-screen text-white p-10 text-center">Cargando tu plan...</div>

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#CCFF00]">Fit IA Coach</h1>
        <p className="text-zinc-400 mt-2">Panel de entrenamiento</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase font-bold">Peso</p>
          <p className="text-2xl font-bold">{profile.weight} kg</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <p className="text-zinc-500 text-xs uppercase font-bold">Edad</p>
          <p className="text-2xl font-bold">{profile.age} años</p>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mb-6">
        <h3 className="text-[#CCFF00] font-bold mb-2">Tu Objetivo: {profile.goal?.replace('_', ' ')}</h3>
        <p className="text-sm text-zinc-300">
          Entrenarás {profile.training_days} días por semana. Prepárate para empezar.
        </p>
      </div>

      <div className="bg-[#CCFF00] text-black p-6 rounded-3xl font-bold text-center text-xl">
        PRÓXIMA SESIÓN: HIIT & FUERZA ⚡️
      </div>
    </div>
  )
}