'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const [data, setData] = useState({ edad: '', peso: '', objetivo: 'perder_grasa', frecuencia: '3' })
  const router = useRouter()

  const saveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('No hay sesión de usuario activa')

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      age: parseInt(data.edad),
      weight: parseFloat(data.peso),
      goal: data.objetivo,
      training_days: parseInt(data.frecuencia)
    })

    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      router.push('/dashboard') 
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-[#CCFF00]">Cuéntame de ti</h2>
        
        <div className="space-y-4">
          <input type="number" placeholder="Edad" className="w-full p-4 rounded bg-zinc-900 border border-zinc-800 outline-none focus:border-[#CCFF00]" onChange={e => setData({...data, edad: e.target.value})} />
          <input type="number" placeholder="Peso (kg)" className="w-full p-4 rounded bg-zinc-900 border border-zinc-800 outline-none focus:border-[#CCFF00]" onChange={e => setData({...data, peso: e.target.value})} />
          
          <label className="block text-sm text-zinc-500 mb-1">Tu objetivo principal</label>
          <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, objetivo: e.target.value})}>
            <option value="perder_grasa">Perder Grasa</option>
            <option value="ganar_musculo">Ganar Músculo</option>
            <option value="mantener">Mantenimiento / Salud</option>
          </select>

          <label className="block text-sm text-zinc-500 mb-1">Días de entreno por semana</label>
          <select className="w-full p-4 rounded bg-zinc-900 border border-zinc-800" onChange={e => setData({...data, frecuencia: e.target.value})}>
            <option value="2">2 días</option>
            <option value="3">3 días</option>
            <option value="4">4 días</option>
            <option value="5">5+ días</option>
          </select>

          <button onClick={saveProfile} className="w-full bg-[#CCFF00] text-black font-bold py-4 rounded-xl text-lg shadow-lg hover:bg-[#b8e600] transition">
            Generar mi Plan de IA
          </button>
        </div>
      </div>
    </div>
  )
}