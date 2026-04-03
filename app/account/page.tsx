'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage, type Language } from '@/lib/language'
import type { User } from '@supabase/supabase-js'

export default function AccountPage() {
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <h1 className="text-3xl font-bold text-amber-400">{t('accountTitle')}</h1>

      {/* Account Info */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Account</p>
        {user ? (
          <div className="flex flex-col gap-3">
            <p className="text-stone-300 text-sm">{t('signedInAs')}</p>
            <p className="text-stone-100 font-medium">{user.email}</p>
            <button
              onClick={signOut}
              className="w-full bg-stone-800 border border-stone-700 text-stone-100 font-semibold py-3 rounded-xl hover:border-red-400 hover:text-red-400 transition-colors"
            >
              {t('signOut')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-stone-400 text-sm">{t('notSignedIn')}</p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-amber-400 text-stone-950 font-semibold py-3 rounded-xl hover:bg-amber-300 transition-colors"
            >
              {t('signIn')}
            </button>
          </div>
        )}
      </div>

      {/* Language Toggle */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest">{t('language')}</p>
        <div className="flex gap-3">
          {(['en', 'es'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
                language === lang
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-stone-800 border border-stone-700 text-stone-300 hover:border-amber-400'
              }`}
            >
              {lang === 'en' ? `🇺🇸 ${t('english')}` : `🇪🇸 ${t('spanish')}`}
            </button>
          ))}
        </div>
        <p className="text-stone-500 text-xs">
          {language === 'en' ? 'Scripture: English Standard Version (ESV)' : 'Escritura: Reina-Valera 1960 (RVR60)'}
        </p>
      </div>
    </div>
  )
}
