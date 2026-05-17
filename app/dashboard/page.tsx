'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Scale, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [weightHistory, setWeightHistory] = useState<any[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // 1. Perfil
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(prof)

    // 2. Historial de peso (últimos 7 registros)
    const { data: history } = await supabase
      .from('weight_history')
      .select('weight, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: true })
    
    // Formateamos la fecha para la gráfica
    const formattedHistory = history?.map(h => ({
      peso: h.weight,
      fecha: new Date(h.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    })) || []
    
    setWeightHistory(formattedHistory)
  }

  const handleWeightUpdate = async () => {
    if (!newWeight) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    // Guardar en el historial
    await supabase.from('weight_history').insert([
      { profile_id: user?.id, weight: parseFloat(newWeight) }
    ])

    // Actualizar peso actual en el perfil
    await supabase.from('profiles').update({ weight: parseFloat(newWeight) }).eq('id', user?.id)

    setNewWeight('')
    fetchInitialData()
    setLoading(false)
  }

  if (!profile) return <div className="bg-black min-h-screen text-white p-10">Cargando progreso...</div>

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#CCFF00]">Mi Progreso</h1>
        <p className="text-zinc-500 text-sm">Control de peso y métricas</p>
      </header>

      {/* Gráfica de Evolución */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-[#CCFF00]" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Evolución del Peso</h3>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="fecha" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#CCFF00' }}
              />
              <Line type="monotone" dataKey="peso" stroke="#CCFF00" strokeWidth={3} dot={{ fill: '#CCFF00', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Actualizar Peso */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Scale size={20} className="text-[#CCFF00]" />
          <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Registrar Peso Hoy</h3>
        </div>
        <div className="flex gap-3">
          <input 
            type="number" 
            placeholder={`${profile.weight} kg`}
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="flex-1 bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-[#CCFF00]"
          />
          <button 
            onClick={handleWeightUpdate}
            disabled={loading}
            className="bg-[#CCFF00] text-black font-bold px-6 rounded-xl disabled:opacity-50"
          >
            {loading ? '...' : 'OK'}
          </button>
        </div>
      </div>

      {/* Información de Perfil */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <Calendar size={18} className="text-zinc-500 mb-2" />
          <p className="text-zinc-500 text-xs font-bold uppercase">Edad</p>
          <p className="text-xl font-bold">{profile.age} años</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <TrendingUp size={18} className="text-zinc-500 mb-2" />
          <p className="text-zinc-500 text-xs font-bold uppercase">Nivel</p>
          <p className="text-xl font-bold capitalize">{profile.fitness_level}</p>
        </div>
      </div>
    </div>
  )
}