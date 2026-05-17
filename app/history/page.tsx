'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, ChevronRight, Activity } from 'lucide-react'

export default function HistoryPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })

      // Agrupamos los ejercicios por fecha (Día)
      const grouped = data?.reduce((acc: any, log: any) => {
        const date = new Date(log.created_at).toLocaleDateString('es-ES', { 
          weekday: 'long', day: 'numeric', month: 'long' 
        })
        if (!acc[date]) acc[date] = []
        acc[date].push(log)
        return acc
      }, {})

      setLogs(grouped ? Object.entries(grouped) : [])
      setLoading(false)
    }
    fetchHistory()
  }, [])

  if (loading) return <div className="bg-black min-h-screen text-white p-10">Cargando historial...</div>

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#CCFF00]">Mi Historial</h1>
        <p className="text-zinc-500 text-sm italic">Tu camino recorrido</p>
      </header>

      {logs.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded-3xl border border-dashed border-zinc-800">
          <Activity className="mx-auto mb-4 text-zinc-700" size={48} />
          <p className="text-zinc-500">Aún no has registrado entrenamientos.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {logs.map(([date, exercises]: any) => (
            <div key={date} className="relative pl-6 border-l border-zinc-800">
              {/* Punto en la línea de tiempo */}
              <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]" />
              
              <h3 className="text-zinc-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                <Calendar size={14} /> {date}
              </h3>

              <div className="space-y-3">
                {exercises.map((ex: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{ex.exercise_name}</p>
                      <p className="text-xs text-zinc-500">
                        {ex.series_completed} series • {ex.weight_used} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        ex.rir_score === '0' ? 'bg-red-500/10 text-red-500' : 'bg-[#CCFF00]/10 text-[#CCFF00]'
                      }`}>
                        RIR: {ex.rir_score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}