'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const verses = [
  'john%203:16', 'psalm%2023:1', 'philippians%204:13', 'jeremiah%2029:11',
  'romans%208:28', 'proverbs%203:5', 'isaiah%2040:31', 'matthew%2011:28',
  'joshua%201:9', 'romans%2015:13', 'ephesians%202:8', 'hebrews%2011:1',
  'psalm%2046:1', 'john%2014:6', 'galatians%205:22', 'matthew%205:16',
  'colossians%203:23', '2+timothy%201:7', 'james%201:2', 'psalm%20119:105',
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
    fetch(`https://bible-api.com/${ref}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
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
