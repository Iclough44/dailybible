'use client'
import { useEffect, useState } from 'react'

const verses = [
  'john%203:16', 'psalm%2023:1', 'philippians%204:13', 'jeremiah%2029:11',
  'romans%208:28', 'proverbs%203:5', 'isaiah%2040:31', 'matthew%2011:28',
  'joshua%201:9', 'romans%2015:13', 'ephesians%202:8', 'hebrews%2011:1',
  'psalm%2046:1', 'john%2014:6', 'galatians%205:22', 'matthew%205:16',
  'colossians%203:23', '2+timothy%201:7', 'james%201:2', 'psalm%20119:105',
]

const quotes = [
  { text: "Faith is taking the first step even when you don't see the whole staircase.", author: "Martin Luther King Jr." },
  { text: "God never said that the journey would be easy, but He did say that the arrival would be worthwhile.", author: "Max Lucado" },
  { text: "Prayer is not asking. It is a longing of the soul.", author: "Mahatma Gandhi" },
  { text: "The will of God will never take you where the grace of God will not protect you.", author: "Anonymous" },
  { text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" },
  { text: "God's work done in God's way will never lack God's supply.", author: "Hudson Taylor" },
  { text: "Trust the Lord with all your heart and lean not on your own understanding.", author: "Proverbs 3:5" },
  { text: "You don't have to be perfect to be amazing in God's eyes.", author: "Anonymous" },
  { text: "Every day is a gift from God. Make the most of it.", author: "Joyce Meyer" },
  { text: "When you can't see His hand, trust His heart.", author: "Charles Spurgeon" },
  { text: "God is most glorified in us when we are most satisfied in Him.", author: "John Piper" },
  { text: "The secret of joy is Christ in me, not me in different circumstances.", author: "Elisabeth Elliot" },
  { text: "A Bible that's falling apart usually belongs to someone who isn't.", author: "Charles Spurgeon" },
  { text: "Be still and know that He is God. He will be exalted among the nations.", author: "Psalm 46:10" },
  { text: "Grace is not just about forgiveness. It's about transformation.", author: "Timothy Keller" },
  { text: "Our greatest fear should not be of failure, but of succeeding at things that don't matter.", author: "Francis Chan" },
  { text: "You were made by God and for God, and until you understand that, life will never make sense.", author: "Rick Warren" },
  { text: "Worry does not empty tomorrow of its sorrow — it empties today of its strength.", author: "Corrie ten Boom" },
  { text: "The Lord doesn't ask about your ability or inability. He asks about your availability.", author: "Mary Kay Ash" },
  { text: "We may not know what the future holds, but we know who holds the future.", author: "Anonymous" },
]

function getDailyIndex() {
  const start = new Date(new Date().getFullYear(), 0, 0)
  return Math.floor((Date.now() - start.getTime()) / 86400000)
}

export default function VersePage() {
  const [data, setData] = useState<{ text: string; reference: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const dayIndex = getDailyIndex()
  const quote = quotes[dayIndex % quotes.length]

  useEffect(() => {
    const ref = verses[dayIndex % verses.length]
    fetch(`https://bible-api.com/${ref}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed')
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [dayIndex])

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-400 mb-1">Verse of the Day</h1>
        <p className="text-stone-400 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Verse Card */}
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 min-h-36 flex items-center justify-center">
        {loading && <p className="text-stone-400">Loading verse...</p>}
        {error && <p className="text-stone-400 text-center">Could not load verse. Please check your connection.</p>}
        {data && (
          <div className="w-full">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">Scripture</p>
            <blockquote className="text-lg text-stone-100 leading-relaxed italic mb-4">
              &ldquo;{data.text?.trim()}&rdquo;
            </blockquote>
            <p className="text-amber-400 font-semibold text-right text-sm">{data.reference}</p>
          </div>
        )}
      </div>

      {/* Inspirational Quote Card */}
      <div className="w-full bg-stone-900 border border-amber-400/20 rounded-2xl p-6">
        <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">Inspiration for Today</p>
        <blockquote className="text-lg text-stone-100 leading-relaxed italic mb-4">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p className="text-stone-400 text-sm text-right">— {quote.author}</p>
      </div>

      <p className="text-stone-600 text-xs text-center">Scripture: World English Bible (WEB)</p>
    </div>
  )
}
