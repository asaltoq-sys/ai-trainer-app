'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Play, CheckCircle2, Video, X, Dumbbell } from 'lucide-react'

export default function WorkoutPage() {
  const [rutina, setRutina] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeEx, setActiveEx] = useState<any>(null)
  const [serieActual, setSerieActual] = useState(1)
  const [timer, setTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)

  useEffect(() => {
    let interval: any;
    if (isResting && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, timer]);

  const fetchWorkout = async () => {
    setLoading(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', auth.user?.id).single()
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: prof })
      })
      const data = await res.json()
      if (data?.rutina) setRutina(data.rutina)
    } catch (e) {
      alert("Error al conectar con Gemini")
    }
    setLoading(false)
  }

  const validarSerie = (descanso: number, total: number) => {
    if (serieActual < total) {
      setTimer(descanso); setIsResting(true); setSerieActual(serieActual + 1)
    } else {
      finalizarEjercicio()
    }
  }

  const finalizarEjercicio = async () => {
    const rir = window.confirm("¿Has llegado al fallo? (OK = Sí / Cancelar = No)")
    const { data: auth } = await supabase.auth.getUser()
    if (auth.user && activeEx) {
      await supabase.from('exercise_logs').insert({
        profile_id: auth.user.id,
        exercise_name: activeEx.nombre,
        series_completed: activeEx.sets,
        rir_score: rir ? "0" : "1-2"
      })
    }
    setActiveEx(null); setSerieActual(1)
  }

  if (loading) return <div className="bg-black min-h-screen text-[#CCFF00] flex flex-col items-center justify-center font-bold italic">DISEÑANDO SESIÓN...</div>

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-40">
      <h1 className="text-2xl font-black text-[#CCFF00] mb-8 italic uppercase tracking-tighter">Entrenamiento</h1>

      {!rutina ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center">
          <Dumbbell className="mx-auto mb-6 text-zinc-700" size={60} />
          <button onClick={fetchWorkout} className="w-full bg-[#CCFF00] text-black py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#CCFF00]/10">
            GENERAR RUTINA ⚡️
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {rutina.map((sec: any, idx: number) => (
            <div key={idx} className="space-y-4">
              <p className="text-[#CCFF00] text-xs font-black uppercase border-l-2 border-[#CCFF00] pl-3">{sec.seccion}</p>
              {sec.ejercicios.map((ex: any, eIdx: number) => (
                <button key={eIdx} onClick={() => setActiveEx(ex)} className="w-full bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center active:bg-zinc-800 transition-colors">
                  <div className="text-left"><p className="font-bold text-lg">{ex.nombre}</p><p className="text-zinc-500 text-sm">{ex.sets} x {ex.reps}</p></div>
                  <Play size={24} className="text-[#CCFF00] fill-[#CCFF00]" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeEx && (
        <div className="fixed inset-0 bg-black z-[100] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="max-w-[80%]">
              <h2 className="text-2xl font-black text-[#CCFF00] uppercase italic">{activeEx.nombre}</h2>
              <a href={activeEx.video} target="_blank" rel="noreferrer" className="text-zinc-400 text-xs flex items-center gap-1 mt-1 underline"><Video size={14} /> TÉCNICA</a>
            </div>
            <button onClick={() => setActiveEx(null)} className="bg-zinc-900 p-2 rounded-full"><X size={28} /></button>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            {isResting ? (
              <div className="text-center"><p className="text-zinc-500 font-bold mb-2 uppercase">Descanso</p><div className="text-[120px] font-black text-[#CCFF00] leading-none">{timer}s</div><button onClick={() => setTimer(0)} className="mt-10 text-zinc-500 underline text-sm">Saltar</button></div>
            ) : (
              <div className="text-center w-full"><p className="text-zinc-500 font-bold mb-2 uppercase">Serie</p><div className="text-[120px] font-black leading-none mb-4">{serieActual}<span className="text-4xl text-zinc-800">/{activeEx.sets}</span></div><p className="text-2xl font-bold text-zinc-400 mb-12">{activeEx.reps} REPS</p><button onClick={() => validarSerie(activeEx.descanso, activeEx.sets)} className="bg-[#CCFF00] text-black w-32 h-32 rounded-full font-black text-2xl shadow-2xl shadow-[#CCFF00]/20 mx-auto flex items-center justify-center">OK</button></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}