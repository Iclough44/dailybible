'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const links = [
  { href: '/', label: 'Home' },
  { href: '/verse', label: 'Verse of the Day' },
  { href: '/plans', label: 'Reading Plans' },
  { href: '/journal', label: 'Journal' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-stone-900 border-b border-stone-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-amber-400 font-bold text-xl tracking-tight">
          Daily Bible
        </Link>
        <div className="flex items-center gap-6">
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
          {user ? (
            <button
              onClick={signOut}
              className="text-sm text-stone-400 hover:text-stone-100 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors ${
                pathname === '/login' ? 'text-amber-400' : 'text-stone-400 hover:text-stone-100'
              }`}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
