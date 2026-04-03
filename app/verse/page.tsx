'use client'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/language'

const verses = [
  'John 3:16', 'Psalm 23:1-6', 'Philippians 4:13', 'Jeremiah 29:11',
  'Romans 8:28', 'Proverbs 3:5-6', 'Isaiah 40:31', 'Matthew 11:28-30',
  'Joshua 1:9', 'Romans 15:13', 'Ephesians 2:8-9', 'Hebrews 11:1',
  'Psalm 46:1', 'John 14:6', 'Galatians 5:22-23', 'Matthew 5:16',
  'Colossians 3:23', '2 Timothy 1:7', 'James 1:2-4', 'Psalm 119:105',
]

const quotes = {
  en: [
    { text: "Faith is taking the first step even when you don't see the whole staircase.", author: "Martin Luther King Jr." },
    { text: "God never said that the journey would be easy, but He did say that the arrival would be worthwhile.", author: "Max Lucado" },
    { text: "The will of God will never take you where the grace of God will not protect you.", author: "Anonymous" },
    { text: "When you can't see His hand, trust His heart.", author: "Charles Spurgeon" },
    { text: "God is most glorified in us when we are most satisfied in Him.", author: "John Piper" },
    { text: "A Bible that's falling apart usually belongs to someone who isn't.", author: "Charles Spurgeon" },
    { text: "You were made by God and for God, and until you understand that, life will never make sense.", author: "Rick Warren" },
    { text: "Worry does not empty tomorrow of its sorrow — it empties today of its strength.", author: "Corrie ten Boom" },
    { text: "God's work done in God's way will never lack God's supply.", author: "Hudson Taylor" },
    { text: "We may not know what the future holds, but we know who holds the future.", author: "Anonymous" },
  ],
  es: [
    { text: "La fe es dar el primer paso incluso cuando no ves toda la escalera.", author: "Martin Luther King Jr." },
    { text: "La voluntad de Dios nunca te llevará donde la gracia de Dios no te proteja.", author: "Anónimo" },
    { text: "Cuando no puedas ver Su mano, confía en Su corazón.", author: "Charles Spurgeon" },
    { text: "Dios es más glorificado en nosotros cuando estamos más satisfechos en Él.", author: "John Piper" },
    { text: "Una Biblia que se está cayendo a pedazos generalmente pertenece a alguien que no.", author: "Charles Spurgeon" },
    { text: "Fuiste hecho por Dios y para Dios, y hasta que entiendas eso, la vida nunca tendrá sentido.", author: "Rick Warren" },
    { text: "El trabajo de Dios hecho a la manera de Dios nunca le faltará el suministro de Dios.", author: "Hudson Taylor" },
    { text: "Puede que no sepamos lo que el futuro tiene para nosotros, pero sabemos quién tiene el futuro.", author: "Anónimo" },
    { text: "No hay mayor amor que el de Dios, y ese amor nunca falla.", author: "Anónimo" },
    { text: "La oración no es pedirle a Dios que cambie Sus planes, sino pedir que nos cambie a nosotros.", author: "C.S. Lewis" },
  ],
}

function getDailyIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  return Math.floor((Date.now() - start.getTime()) / 86400000)
}

export default function VersePage() {
  const { language, t } = useLanguage()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const dayIndex = getDailyIndex()
  const verseRef = verses[dayIndex % verses.length]
  const quote = quotes[language][dayIndex % quotes[language].length]

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`/api/passage?ref=${encodeURIComponent(verseRef)}&short=true&lang=${language}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setText(d.passages?.[0]?.trim() || '')
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [verseRef, language])

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-400 mb-1">{t('verseOfTheDay')}</h1>
        <p className="text-stone-400 text-sm">
          {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 min-h-36 flex items-center justify-center">
        {loading && <p className="text-stone-400">{t('loadingVerse')}</p>}
        {error && <p className="text-stone-400 text-center">{t('couldNotLoad')}</p>}
        {text && (
          <div className="w-full">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">{t('scripture')}</p>
            <blockquote className="text-lg text-stone-100 leading-relaxed italic mb-4">
              &ldquo;{text}&rdquo;
            </blockquote>
            <p className="text-amber-400 font-semibold text-right text-sm">
              {verseRef} ({language === 'es' ? 'RVR60' : 'ESV'})
            </p>
          </div>
        )}
      </div>

      <div className="w-full bg-stone-900 border border-amber-400/20 rounded-2xl p-6">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">{t('inspirationToday')}</p>
        <blockquote className="text-lg text-stone-100 leading-relaxed italic mb-4">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-stone-400 text-sm text-right">— {quote.author}</p>
      </div>

      <p className="text-stone-600 text-xs text-center">{t('translation')}</p>
    </div>
  )
}
