'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [data, setData] = useState({ 
    edad: '', peso: '', objetivo: 'perder_grasa', frecuencia: '3', sexo: 'hombre', nivel: 'intermedio', tiempo: '45'
  })
  const router = useRouter()

  const saveProfile = async () => {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) return

    await supabase.from('profiles').upsert({
      id: authData.user.id,
      age: parseInt(data.edad),
      weight: parseFloat(data.peso),
      goal: data.objetivo,
      training_days: parseInt(data.frecuencia),
      gender: data.sexo,
      fitness_level: data.nivel,
      daily_time: parseInt(data.tiempo)
    })
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-[#CCFF00] mb-4 text-center">Configura tu entrenamiento</h2>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Edad" className="p-4 rounded bg-zinc-900 border border-zinc-800 outline-none" onChange={e => setData({...data, edad: e.target.value})} />
          <input type="number" placeholder="Peso (kg)" className="p-4 rounded bg-zinc-900 border border-zinc-800 outline-none" onChange={e => setData({...data, peso: e.target.value})} />
        </div>
        <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, tiempo: e.target.value})}>
          <option value="20">Dispongo de 20 min</option>
          <option value="30">Dispongo de 30 min</option>
          <option value="45">Dispongo de 45 min</option>
          <option value="60">Dispongo de 60 min o más</option>
        </select>
        <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, nivel: e.target.value})}>
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
        </select>
        <button onClick={saveProfile} className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl text-lg mt-4">Guardar Perfil</button>
      </div>
    </div>
  )
}