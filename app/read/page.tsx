'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language'

function PassageReader() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { language } = useLanguage()
  const ref = searchParams.get('ref') || ''
  const back = searchParams.get('back') || '/plans'

  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!ref) return
    fetch(`/api/passage?ref=${encodeURIComponent(ref)}&lang=${language}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setText(d.passages?.[0] || '')
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [ref, language])

  return (
    <div className="flex flex-col gap-6 py-4">
      <button onClick={() => router.push(back)} className="text-stone-400 hover:text-stone-100 text-sm transition-colors text-left">
        ← {language === 'es' ? 'Volver' : 'Back'}
      </button>

      <div>
        <h1 className="text-2xl font-bold text-amber-400">{ref}</h1>
        <p className="text-stone-500 text-xs mt-1">
          {language === 'es' ? 'Reina-Valera 1960 (RVR60)' : 'English Standard Version (ESV)'}
        </p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
        {loading && <p className="text-stone-400 text-center py-8">{language === 'es' ? 'Cargando pasaje...' : 'Loading passage...'}</p>}
        {error && <p className="text-stone-400 text-center py-8">{language === 'es' ? 'No se pudo cargar el pasaje.' : 'Could not load passage.'}</p>}
        {text && (
          <pre className="whitespace-pre-wrap font-sans text-stone-100 leading-8 text-base">
            {text}
          </pre>
        )}
      </div>
    </div>
  )
}

export default function ReadPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-stone-400">Loading...</div>}>
      <PassageReader />
    </Suspense>
  )
}
