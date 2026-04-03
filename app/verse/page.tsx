'use client'
import { useEffect, useState } from 'react'

const verses = [
  'john/3/16', 'psalms/23/1', 'philippians/4/13', 'jeremiah/29/11',
  'romans/8/28', 'proverbs/3/5', 'isaiah/40/31', 'matthew/11/28',
  'joshua/1/9', 'romans/15/13', 'ephesians/2/8', 'hebrews/11/1',
  'psalm/46/1', 'john/14/6', 'galatians/5/22', 'matthew/5/16',
  'colossians/3/23', '2-timothy/1/7', 'james/1/2', 'psalm/119/105',
]

function getDailyVerse() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86400000)
  return verses[dayOfYear % verses.length]
}

export default function VersePage() {
  const [data, setData] = useState<{ text: string; reference: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const ref = getDailyVerse()
    fetch(`https://bible-api.com/${ref}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Verse of the Day</h1>
        <p className="text-stone-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-8 min-h-48 flex items-center justify-center">
        {loading && <p className="text-stone-400">Loading verse...</p>}
        {error && <p className="text-stone-400">Could not load verse. Please check your connection.</p>}
        {data && (
          <div className="w-full">
            <blockquote className="text-xl text-stone-100 leading-relaxed italic mb-6">
              &ldquo;{data.text?.trim()}&rdquo;
            </blockquote>
            <p className="text-amber-400 font-semibold text-right">{data.reference}</p>
          </div>
        )}
      </div>

      <p className="text-stone-500 text-sm">Translation: World English Bible (WEB)</p>
    </div>
  )
}
