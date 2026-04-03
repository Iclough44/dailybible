'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/verse', label: 'Verse of the Day' },
  { href: '/plans', label: 'Reading Plans' },
  { href: '/journal', label: 'Journal' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="bg-stone-900 border-b border-stone-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-amber-400 font-bold text-xl tracking-tight">
          Daily Bible
        </Link>
        <div className="flex gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname === href
                  ? 'text-amber-400'
                  : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
