'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Dumbbell, History, User } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  // Ocultar la barra en páginas donde no hace falta
  if (pathname === '/login' || pathname === '/onboarding' || pathname === '/forgot-password' || pathname === '/') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 p-4 flex justify-around items-center z-50 pb-8">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition ${pathname === '/dashboard' ? 'text-[#CCFF00]' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-bold uppercase">Progreso</span>
      </Link>
      <Link href="/workout" className={`flex flex-col items-center gap-1 transition ${pathname === '/workout' ? 'text-[#CCFF00]' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <Dumbbell size={24} />
        <span className="text-[10px] font-bold uppercase">Entrenar</span>
      </Link>
      <Link href="/history" className={`flex flex-col items-center gap-1 transition ${pathname === '/history' ? 'text-[#CCFF00]' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <History size={24} />
        <span className="text-[10px] font-bold uppercase">Historial</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center gap-1 transition ${pathname === '/profile' ? 'text-[#CCFF00]' : 'text-zinc-500 hover:text-zinc-300'}`}>
        <User size={24} />
        <span className="text-[10px] font-bold uppercase">Perfil</span>
      </Link>
    </nav>
  )
}