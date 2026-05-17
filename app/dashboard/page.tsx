'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [workout, setWorkout] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (authData?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single()
        setProfile(data)
      }
    }
    fetchProfile()
  }, [])

  const generateWorkout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      })
      const data = await res.json()
      setWorkout(data.text)
    } catch (e) {
      alert("Fallo al conectar con la IA")
    }
    setLoading(false)
  }

  if (!profile) return <div className="bg-black min-h-screen text-white p-10">Cargando...</div>

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-20">
      <h1 className="text-3xl font-bold text-[#CCFF00] mb-6">Fit IA Coach</h1>
      
      {/* Resumen del perfil */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between mb-6 text-sm">
        <span>{profile.age} años</span>
        <span>{profile.weight} kg</span>
        <span className="capitalize">{profile.fitness_level}</span>
      </div>

      {/* Resultado de la IA */}
      {workout ? (
        <div className="bg-zinc-900 p-6 rounded-3xl border border-[#CCFF00]/30 mb-6 animate-in fade-in duration-500">
          <h2 className="text-[#CCFF00] font-bold mb-4 italic">TU PLAN DE HOY:</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {workout}
          </div>
          <button onClick={() => setWorkout('')} className="mt-6 text-xs text-zinc-500 underline">Generar otro entrenamiento</button>
        </div>
      ) : (
        <button 
          onClick={generateWorkout}
          disabled={loading}
          className="w-full bg-[#CCFF00] text-black p-8 rounded-3xl font-black text-2xl shadow-lg shadow-[#CCFF00]/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "ESTUDIANDO TU PERFIL..." : "GENERAR ENTRENAMIENTO ⚡️"}
        </button>
      )}
    </div>
  )
}