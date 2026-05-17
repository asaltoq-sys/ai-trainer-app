'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [data, setData] = useState({ 
    edad: '', 
    peso: '', 
    objetivo: 'perder_grasa', 
    frecuencia: '3',
    sexo: 'hombre',
    nivel: 'intermedio'
  })
  const router = useRouter()

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('No hay sesión activa')

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      age: parseInt(data.edad),
      weight: parseFloat(data.peso),
      goal: data.objetivo,
      training_days: parseInt(data.frecuencia),
      gender: data.sexo,
      fitness_level: data.nivel
    })

    if (error) alert(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-[#CCFF00] mb-4">Personaliza tu Plan</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Edad" className="p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, edad: e.target.value})} />
          <input type="number" placeholder="Peso (kg)" className="p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, peso: e.target.value})} />
        </div>

        <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, sexo: e.target.value})}>
          <option value="hombre">Hombre</option>
          <option value="mujer">Mujer</option>
        </select>

        <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, nivel: e.target.value})}>
          <option value="principiante">Principiante (Empezando)</option>
          <option value="intermedio">Intermedio (Entreno habitual)</option>
          <option value="avanzado">Avanzado (Atleta)</option>
        </select>

        <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, objetivo: e.target.value})}>
          <option value="perder_grasa">Perder Grasa</option>
          <option value="ganar_musculo">Ganar Músculo</option>
          <option value="mantener">Mantenimiento / Salud</option>
        </select>

        <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, frecuencia: e.target.value})}>
          <option value="2">2 días/semana</option>
          <option value="3">3 días/semana</option>
          <option value="4">4 días/semana</option>
          <option value="5">5+ días/semana</option>
        </select>

        <button onClick={saveProfile} className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl text-lg mt-4">
          Actualizar y Generar Plan
        </button>
      </div>
    </div>
  )
}