import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 flex justify-around items-center z-50">
      <Link href="/dashboard" className="text-[#CCFF00] text-xs font-bold uppercase">Progreso</Link>
      <Link href="/workout" className="bg-[#CCFF00] text-black px-4 py-2 rounded-full text-xs font-bold uppercase">Entrenar</Link>
      <Link href="/profile" className="text-[#CCFF00] text-xs font-bold uppercase">Perfil</Link>
    </nav>
  )
}