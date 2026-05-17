'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function WorkoutPage() {
  const [workout, setWorkout] = useState<any>(null)
  const [activeExercise, setActiveExercise] = useState<number | null>(null)
  const [currentSerie, setCurrentSerie] = useState(1)

  // Aquí iría la lógica de generar el entrenamiento con Gemini (POST /api/chat)
  // ... similar a lo que teníamos en el dashboard

  return (
    <div className="bg-black min-h-screen text-white p-6 pb-24">
      <h1 className="text-2xl font-bold text-[#CCFF00] mb-6">Sesión Activa</h1>
      
      {/* Lista de ejercicios en acordeón */}
      {workout?.exercises.map((ex: any, idx: number) => (
        <div key={idx} className="mb-4 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
          <button 
            onClick={() => setActiveExercise(activeExercise === idx ? null : idx)}
            className="w-full p-4 flex justify-between items-center text-left"
          >
            <span className="font-bold">{ex.nombre}</span>
            <span>{activeExercise === idx ? '▲' : '▼'}</span>
          </button>

          {activeExercise === idx && (
            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
              <div className="flex gap-4 mb-4">
                 <button className="text-blue-400 text-sm underline">Ver Vídeo</button>
                 <span className="text-zinc-500">|</span>
                 <span className="text-zinc-300 text-sm">{ex.instrucciones}</span>
              </div>

              {/* Validación de Series */}
              <div className="space-y-2">
                {[...Array(ex.series)].map((_, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <span>Serie {sIdx + 1}</span>
                    <button className="bg-zinc-800 px-4 py-1 rounded text-xs">Validar</button>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-white text-black py-2 rounded-lg font-bold text-sm">
                Terminar Ejercicio
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}