'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/',        label: 'Home',    icon: '🏠' },
  { href: '/verse',   label: 'Verse',   icon: '📖' },
  { href: '/plans',   label: 'Plans',   icon: '📅' },
  { href: '/journal', label: 'Journal', icon: '✍️' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 z-50">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                active ? 'text-amber-400' : 'text-stone-500'
              }`}
            >
              <span className="text-2xl leading-none">{icon}</span>
              <span className={`text-xs font-medium ${active ? 'text-amber-400' : 'text-stone-500'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
      {/* iPhone home indicator spacing */}
      <div className="h-safe-area-inset-bottom bg-stone-900" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
