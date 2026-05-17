'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [workout, setWorkout] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: authData } = await supabase.auth.getUser()
    if (authData?.user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single()
      setProfile(data)
    }
  }

  const updateTime = async (newTime: number) => {
    setProfile({...profile, daily_time: newTime})
    await supabase.from('profiles').update({ daily_time: newTime }).eq('id', profile.id)
  }

  const generateWorkout = async () => {
    setLoading(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile })
    })
    const data = await res.json()
    setWorkout(data.text)
    setLoading(false)
  }

  if (!profile) return <div className="bg-black min-h-screen text-white p-10">Cargando...</div>

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-20">
      <h1 className="text-3xl font-bold text-[#CCFF00] mb-6">Fit IA Coach</h1>
      
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mb-6">
        <p className="text-zinc-500 text-xs font-bold uppercase mb-4">¿De cuánto tiempo dispones hoy?</p>
        <div className="flex gap-2">
          {[20, 30, 45, 60].map((t) => (
            <button 
              key={t}
              onClick={() => updateTime(t)}
              className={`flex-1 py-2 rounded-xl font-bold transition ${profile.daily_time === t ? 'bg-[#CCFF00] text-black' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {t} min
            </button>
          ))}
        </div>
      </div>

      {workout ? (
        <div className="bg-zinc-900 p-6 rounded-3xl border border-[#CCFF00]/30">
          <div className="whitespace-pre-wrap text-sm text-zinc-300">{workout}</div>
          <button onClick={() => setWorkout('')} className="mt-6 w-full py-4 text-zinc-500 underline text-sm">Cambiar tiempo o rutina</button>
        </div>
      ) : (
        <button onClick={generateWorkout} disabled={loading} className="w-full bg-[#CCFF00] text-black p-8 rounded-3xl font-black text-2xl shadow-lg active:scale-95 disabled:opacity-50">
          {loading ? "CONFIGURANDO RELOJ..." : "GENERAR ENTRENAMIENTO ⚡️"}
        </button>
      )}
    </div>
  )
}