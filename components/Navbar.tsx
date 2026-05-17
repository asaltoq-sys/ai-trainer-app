import Link from 'next/link'
import { LayoutDashboard, Dumbbell, History, User } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 p-4 flex justify-around items-center z-50 pb-8">
      <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-[#CCFF00] transition">
        <LayoutDashboard size={20} />
        <span className="text-[10px] font-bold uppercase">Progreso</span>
      </Link>
      <Link href="/workout" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-[#CCFF00] transition">
        <Dumbbell size={20} />
        <span className="text-[10px] font-bold uppercase">Entrenar</span>
      </Link>
      <Link href="/history" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-[#CCFF00] transition">
        <History size={20} />
        <span className="text-[10px] font-bold uppercase">Historial</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-[#CCFF00] transition">
        <User size={20} />
        <span className="text-[10px] font-bold uppercase">Perfil</span>
      </Link>
    </nav>
  )
}