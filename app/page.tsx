import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-[#CCFF00]">Fit IA Coach</h1>
      <p className="text-xl text-zinc-400 mb-8 max-w-md">
        Tu entrenamiento optimizado por Inteligencia Artificial. Personalizado para tus objetivos.
      </p>
      <Link href="/login" className="bg-[#CCFF00] text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform">
        Empezar ahora
      </Link>
    </div>
  )
}
