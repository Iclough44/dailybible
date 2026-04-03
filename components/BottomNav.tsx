'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/language'

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const tabs = [
    { href: '/',         label: t('home'),    icon: '🏠' },
    { href: '/verse',    label: t('verse'),   icon: '📖' },
    { href: '/plans',    label: t('plans'),   icon: '📅' },
    { href: '/journal',  label: t('journal'), icon: '✍️' },
    { href: '/account',  label: t('account'), icon: '👤' },
  ]

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
      <div className="bg-stone-900" style={{ height: 'env(safe-area-inset-bottom)' }} />
    </nav>
  )
}
