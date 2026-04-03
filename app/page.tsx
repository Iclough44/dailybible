'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const verses = [
  'John 3:16', 'Psalm 23:1-6', 'Philippians 4:13', 'Jeremiah 29:11',
  'Romans 8:28', 'Proverbs 3:5-6', 'Isaiah 40:31', 'Matthew 11:28-30',
  'Joshua 1:9', 'Romans 15:13', 'Ephesians 2:8-9', 'Hebrews 11:1',
  'Psalm 46:1', 'John 14:6', 'Galatians 5:22-23', 'Matthew 5:16',
  'Colossians 3:23', '2 Timothy 1:7', 'James 1:2-4', 'Psalm 119:105',
]

function getDailyIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  return Math.floor((Date.now() - start.getTime()) / 86400000)
}

export default function Home() {
  const [data, setData] = useState<{ text: string; reference: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = verses[getDailyIndex() % verses.length]
    fetch(`/api/passage?ref=${encodeURIComponent(ref)}&short=true`)
      .then((r) => r.json())
      .then((d) => { setData({ text: d.passages?.[0]?.trim() || '', reference: ref }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-3xl font-bold text-amber-400 mb-1">Daily Bible</h1>
        <p className="text-stone-500 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Verse of the Day - Hero */}
      <div className="bg-stone-900 border border-amber-400/30 rounded-2xl p-6">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">Verse of the Day</p>
        {loading ? (
          <p className="text-stone-400 italic">Loading verse...</p>
        ) : data ? (
          <>
            <blockquote className="text-lg text-stone-100 leading-relaxed italic mb-4">
              &ldquo;{data.text?.trim()}&rdquo;
            </blockquote>
            <p className="text-amber-400 font-semibold text-right text-sm">{data.reference}</p>
          </>
        ) : (
          <p className="text-stone-400 italic">Could not load verse.</p>
        )}
      </div>

      {/* Nav Cards */}
      <div className="flex flex-col gap-3">
        <Link href="/verse" className="group bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-3xl">📖</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Verse & Inspiration</h2>
            <p className="text-stone-400 text-sm">Today's verse + inspirational quote</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>

        <Link href="/plans" className="group bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-3xl">📅</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Reading Plans</h2>
            <p className="text-stone-400 text-sm">Follow a structured reading plan</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>

        <Link href="/journal" className="group bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-3xl">✍️</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Journal</h2>
            <p className="text-stone-400 text-sm">Reflect and write your thoughts</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>

        <Link href="/login" className="group bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-3xl">👤</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Account</h2>
            <p className="text-stone-400 text-sm">Sign in to sync your data</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>
      </div>
    </div>
  )
}
