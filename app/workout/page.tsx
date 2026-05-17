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
      const { data: authData } = await supabase.auth.getUser()
      const user = authData?.user
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single()
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      })
      const data = await res.json()
      
      if (data && data.rutina) {
        setRutina(data.rutina)
      } else {
        alert("La IA está descansando. Intenta de nuevo en unos segundos.")
      }
    } catch (e) {
      alert("Error de conexión con el entrenador.")
    }
    setLoading(false)
  }

  const validarSerie = (descanso: number, totalSeries: number) => {
    if (serieActual < totalSeries) {
      setTimer(descanso)
      setIsResting(true)
      setSerieActual(serieActual + 1)
    } else {
      finalizarEjercicio()
    }
  }

  const finalizarEjercicio = async () => {
    const rir = window.confirm("¿Podrías haber hecho más repeticiones?")
    const { data: authData } = await supabase.auth.getUser()
    const user = authData?.user
    
    if (user && activeEx) {
      await supabase.from('exercise_logs').insert({
        profile_id: user.id,
        exercise_name: activeEx.nombre,
        series_completed: activeEx.sets,
        rir_score: rir ? "0" : "1-2"
      })
    }
    setActiveEx(null)
    setSerieActual(1)
  }

  if (loading) return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-6">
      <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#CCFF00] font-bold animate-pulse">PREPARANDO TU SESIÓN...</p>
    </div>
  )

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-40">
      <h1 className="text-2xl font-black text-[#CCFF00] mb-8 italic">ENTRENAMIENTO</h1>

      {!rutina ? (
        <div className="flex flex-col items-center justify-center border border-zinc-800 bg-zinc-900/50 rounded-3xl py-16 px-6 text-center">
          <Dumbbell className="text-zinc-700 mb-6" size={60} />
          <h2 className="text-xl font-bold mb-2">Sin rutina activa</h2>
          <p className="text-zinc-500 text-sm mb-8 max-w-[200px]">Pulsa el botón para que la IA diseñe tu entrenamiento.</p>
          <button 
            onClick={fetchWorkout}
            className="w-full bg-[#CCFF00] text-black py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#CCFF00]/10 active:scale-95 transition-all"
          >
            GENERAR RUTINA ⚡️
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {rutina.map((sec: any, idx: number) => (
            <div key={idx} className="space-y-4">
              <p className="text-[#CCFF00] text-xs font-black uppercase tracking-[0.2em] border-l-2 border-[#CCFF00] pl-3">
                {sec.seccion}
              </p>
              {sec.ejercicios.map((ex: any, eIdx: number) => (
                <button 
                  key={eIdx} 
                  onClick={() => setActiveEx(ex)}
                  className="w-full bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center active:bg-zinc-800 transition-colors"
                >
                  <div className="text-left">
                    <p className="font-bold text-lg">{ex.nombre}</p>
                    <p className="text-zinc-500 text-sm font-medium">{ex.sets} series x {ex.reps}</p>
                  </div>
                  <Play size={24} className="text-[#CCFF00] fill-[#CCFF00]" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* VENTANA DEL EJERCICIO (MODAL) */}
      {activeEx && (
        <div className="fixed inset-0 bg-black z-[100] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div className="max-w-[80%]">
              <h2 className="text-2xl font-black text-[#CCFF00] uppercase leading-tight">{activeEx.nombre}</h2>
              <a href={activeEx.video} target="_blank" rel="noreferrer" className="text-zinc-400 text-xs flex items-center gap-1 mt-1 underline">
                <Video size={14} /> Ver técnica
              </a>
            </div>
            <button onClick={() => setActiveEx(null)} className="bg-zinc-900 p-2 rounded-full"><X size={28} /></button>
          </div>

          <div className="flex-1 flex flex-col justify-center