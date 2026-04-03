'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const planData: Record<string, { name: string; readings: string[] }> = {
  'genesis-to-revelation': {
    name: 'Genesis to Revelation',
    readings: [
      'Genesis 1-3', 'Genesis 4-7', 'Genesis 8-11', 'Genesis 12-15',
      'Genesis 16-18', 'Genesis 19-22', 'Genesis 23-26', 'Genesis 27-29',
      'Genesis 30-32', 'Genesis 33-36', 'Exodus 1-4', 'Exodus 5-8',
      'Exodus 9-12', 'Exodus 13-16', 'Exodus 17-20', 'Leviticus 1-4',
      'Numbers 1-4', 'Deuteronomy 1-3', 'Joshua 1-4', 'Judges 1-4',
    ],
  },
  'new-testament-90': {
    name: 'New Testament in 90 Days',
    readings: [
      'Matthew 1-4', 'Matthew 5-7', 'Matthew 8-11', 'Matthew 12-15',
      'Matthew 16-19', 'Matthew 20-22', 'Matthew 23-25', 'Matthew 26-28',
      'Mark 1-4', 'Mark 5-8', 'Mark 9-12', 'Mark 13-16',
      'Luke 1-4', 'Luke 5-8', 'Luke 9-12', 'Luke 13-16',
      'Luke 17-20', 'Luke 21-24', 'John 1-4', 'John 5-8',
      'John 9-12', 'John 13-16', 'John 17-21', 'Acts 1-4',
    ],
  },
  'psalms-proverbs': {
    name: 'Psalms & Proverbs',
    readings: [
      'Psalm 1-5 & Proverbs 1', 'Psalm 6-10 & Proverbs 2', 'Psalm 11-15 & Proverbs 3',
      'Psalm 16-20 & Proverbs 4', 'Psalm 21-25 & Proverbs 5', 'Psalm 26-30 & Proverbs 6',
      'Psalm 31-35 & Proverbs 7', 'Psalm 36-40 & Proverbs 8', 'Psalm 41-45 & Proverbs 9',
      'Psalm 46-50 & Proverbs 10', 'Psalm 51-55 & Proverbs 11', 'Psalm 56-60 & Proverbs 12',
      'Psalm 61-65 & Proverbs 13', 'Psalm 66-70 & Proverbs 14', 'Psalm 71-75 & Proverbs 15',
      'Psalm 76-80 & Proverbs 16', 'Psalm 81-85 & Proverbs 17', 'Psalm 86-90 & Proverbs 18',
      'Psalm 91-95 & Proverbs 19', 'Psalm 96-100 & Proverbs 20', 'Psalm 101-105 & Proverbs 21',
      'Psalm 106-110 & Proverbs 22', 'Psalm 111-115 & Proverbs 23', 'Psalm 116-120 & Proverbs 24',
      'Psalm 121-125 & Proverbs 25', 'Psalm 126-130 & Proverbs 26', 'Psalm 131-135 & Proverbs 27',
      'Psalm 136-140 & Proverbs 28', 'Psalm 141-145 & Proverbs 29', 'Psalm 146-150 & Proverbs 30-31',
    ],
  },
  'gospels': {
    name: 'The Four Gospels',
    readings: [
      'Matthew 1-4', 'Matthew 5-7', 'Matthew 8-11', 'Matthew 12-15',
      'Matthew 16-19', 'Matthew 20-22', 'Matthew 23-25', 'Matthew 26-28',
      'Mark 1-4', 'Mark 5-8', 'Mark 9-12', 'Mark 13-16',
      'Luke 1-4', 'Luke 5-8', 'Luke 9-12', 'Luke 13-16',
      'Luke 17-20', 'Luke 21-24', 'John 1-4', 'John 5-8',
      'John 9-12', 'John 13-16', 'John 17-21',
    ],
  },
}

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [marking, setMarking] = useState(false)

  const plan = planData[id]

  const loadProgress = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('plan_progress')
      .select('day')
      .eq('user_id', userId)
      .eq('plan_id', id)
      .single()
    if (data) setCurrentDay(data.day)
  }, [id])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) loadProgress(data.user.id)
    })
  }, [loadProgress])

  async function markComplete() {
    if (!user || currentDay >= plan.readings.length) return
    setMarking(true)
    const nextDay = currentDay + 1
    await supabase.from('plan_progress').upsert({
      user_id: user.id,
      plan_id: id,
      day: nextDay,
    })
    setCurrentDay(nextDay)
    setMarking(false)
  }

  if (!plan) {
    return <div className="py-16 text-center text-stone-400">Plan not found.</div>
  }

  const todayReading = plan.readings[currentDay - 1]
  const progress = Math.round((currentDay / plan.readings.length) * 100)
  const isComplete = currentDay > plan.readings.length

  return (
    <div className="flex flex-col gap-8 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/plans')} className="text-stone-400 hover:text-stone-100 text-sm">
          ← Back to Plans
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-amber-400 mb-2">{plan.name}</h1>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-stone-800 rounded-full h-2">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-stone-400 text-sm">{Math.min(currentDay - 1, plan.readings.length)}/{plan.readings.length} days</span>
        </div>
      </div>

      {isComplete ? (
        <div className="bg-stone-900 border border-amber-400 rounded-2xl p-8 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <h2 className="text-xl font-bold text-amber-400 mb-2">Plan Complete!</h2>
          <p className="text-stone-400">You have finished {plan.name}. Well done!</p>
        </div>
      ) : (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 flex flex-col gap-6">
          <div>
            <p className="text-stone-400 text-sm mb-1">Day {currentDay} reading</p>
            <h2 className="text-2xl font-semibold text-stone-100">{todayReading}</h2>
          </div>
          {user ? (
            <button
              onClick={markComplete}
              disabled={marking}
              className="w-full bg-amber-400 text-stone-950 font-semibold py-3 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50"
            >
              {marking ? 'Saving...' : 'Mark as Read & Continue'}
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-amber-400 text-stone-950 font-semibold py-3 rounded-xl hover:bg-amber-300 transition-colors"
            >
              Sign in to track progress
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-stone-400 text-sm font-medium uppercase tracking-wider">All Readings</h3>
        {plan.readings.map((reading, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
              i + 1 < currentDay
                ? 'bg-stone-900 text-stone-500 line-through'
                : i + 1 === currentDay
                ? 'bg-stone-800 border border-amber-400 text-stone-100 font-medium'
                : 'bg-stone-900 text-stone-400'
            }`}
          >
            <span className="text-stone-600 w-6 text-right">{i + 1}</span>
            {reading}
            {i + 1 < currentDay && <span className="ml-auto text-amber-400">✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
