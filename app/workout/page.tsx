'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Play, CheckCircle2, Youtube, X, Dumbbell } from 'lucide-react'

export default function WorkoutPage() {
  const [rutina, setRutina] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeEx, setActiveEx] = useState<any>(null)
  const [serieActual, setSerieActual] = useState(1)
  const [timer, setTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)

  // Manejo del cronómetro
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
      const { data: { user } } = await supabase.auth.getUser()
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
        alert("La IA no respondió con el formato correcto")
      }
    } catch (e) {
      alert("Error de conexión")
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
    const { data: { user } } = await supabase.auth.getUser()
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
      <div className="w-10 h-10 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[#CCFF00] font-bold">CARGANDO ENTRENAMIENTO...</p>
    </div>
  )

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-40">
      <h1 className="text-xl font-black text-zinc-700 uppercase tracking-widest mb-8">Sesión</h1>

      {!rutina ? (
        <div className="flex flex-col items-center justify-center border-2 border-zinc-900 rounded-3xl py-12 px-4">
          <Dumbbell className="text-zinc-800 mb-6" size={48} />
          <h2 className="text-2xl font-bold mb-6 text-center">No hay rutina activa</h2>
          <button 
            onClick={fetchWorkout}
            className="w-full max-w-xs bg-[#CCFF00] text-black py-5 rounded-2xl font-black text-xl shadow-lg shadow-[#CCFF00]/10"
          >
            GENERAR RUTINA ⚡️
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {rutina.map((sec: any, idx: number) => (
            <div key={idx} className="space-y-3">
              <p className="text-[#CCFF00] text-xs font-bold uppercase tracking-tighter">{sec.seccion}</p>
              {sec.ejercicios.map((ex: any, eIdx: number) => (
                <button 
                  key={eIdx} 
                  onClick={() => setActiveEx(ex)}
                  className="w-full bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center"
                >
                  <div className="text-left">
                    <p className="font-bold">{ex.nombre}</p>
                    <p className="text-zinc-500 text-xs">{ex.sets} x {ex.reps}</p>
                  </div>
                  <Play size={18} className="text-[#CCFF00]" />
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE EJERCICIO */}
      {activeEx && (
        <div className="fixed inset-0 bg-black z-[100] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-[#CCFF00] uppercase italic">{activeEx.nombre}</h2>
            <button onClick={() => setActiveEx(null)} className="text-zinc-500"><X size={32} /></button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center">
            {isResting ? (
              <div className="text-center">
                <p className="text-zinc-500 font-bold mb-2">DESCANSO</p>
                <div className="text-9xl font-black text-[#CCFF00]">{timer}s</div>
                <button onClick={() => setTimer(0)} className="mt-8 text-zinc-500 underline">Saltar</button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-zinc-500 font-bold mb-2">SERIE</p>
                <div className="text-9xl font-black">{serieActual}<span className="text-3xl text-zinc-800">/{activeEx.sets}</span></div>
                <p className="text-2xl font-bold mt-4 text-zinc-400">{activeEx.reps} REPS</p>
                <button 
                  onClick={() => validarSerie(activeEx.descanso, activeEx.sets)}
                  className="mt-12 bg-[#CCFF00] text-black w-32 h-32 rounded-full font-black text-xl shadow-xl shadow-[#CCFF00]/10"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}