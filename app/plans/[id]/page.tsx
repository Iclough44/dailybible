'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PLAN_READINGS, PLAN_INFO, type PlanId } from '@/lib/readings'
import type { User } from '@supabase/supabase-js'

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [marking, setMarking] = useState(false)

  const planId = id as PlanId
  const plan = PLAN_INFO[planId]
  const readings = PLAN_READINGS[planId]

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
    if (!user || currentDay >= readings.length) return
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

  function readPassage(ref: string) {
    const backUrl = `/plans/${id}`
    router.push(`/read?ref=${encodeURIComponent(ref)}&back=${encodeURIComponent(backUrl)}`)
  }

  if (!plan || !readings) {
    return <div className="py-16 text-center text-stone-400">Plan not found.</div>
  }

  const todayReading = readings[currentDay - 1]
  const progress = Math.round((currentDay / readings.length) * 100)
  const isComplete = currentDay > readings.length

  return (
    <div className="flex flex-col gap-6 py-4">
      <button onClick={() => router.push('/plans')} className="text-stone-400 hover:text-stone-100 text-sm text-left">
        ← Back to Plans
      </button>

      <div>
        <h1 className="text-2xl font-bold text-amber-400 mb-3">{plan.name}</h1>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-stone-800 rounded-full h-2">
            <div
              className="bg-amber-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-stone-400 text-sm shrink-0">
            {Math.min(currentDay - 1, readings.length)}/{readings.length} days
          </span>
        </div>
      </div>

      {isComplete ? (
        <div className="bg-stone-900 border border-amber-400 rounded-2xl p-8 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <h2 className="text-xl font-bold text-amber-400 mb-2">Plan Complete!</h2>
          <p className="text-stone-400">You have finished {plan.name}. Well done!</p>
        </div>
      ) : (
        <div className="bg-stone-900 border border-amber-400/30 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <p className="text-stone-400 text-xs mb-1 uppercase tracking-widest">Day {currentDay}</p>
            <h2 className="text-xl font-semibold text-stone-100">{todayReading}</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => readPassage(todayReading)}
              className="flex-1 bg-amber-400 text-stone-950 font-semibold py-3 rounded-xl hover:bg-amber-300 transition-colors"
            >
              Read Passage (ESV)
            </button>
            {user && (
              <button
                onClick={markComplete}
                disabled={marking}
                className="flex-1 bg-stone-800 border border-stone-700 text-stone-100 font-semibold py-3 rounded-xl hover:border-amber-400 transition-colors disabled:opacity-50"
              >
                {marking ? 'Saving...' : 'Mark Complete'}
              </button>
            )}
          </div>
          {!user && (
            <button
              onClick={() => router.push('/login')}
              className="text-center text-amber-400 text-sm hover:underline"
            >
              Sign in to track progress
            </button>
          )}
        </div>
      )}

      {/* All readings list */}
      <div className="flex flex-col gap-2">
        <h3 className="text-stone-400 text-xs font-medium uppercase tracking-wider">All Readings</h3>
        {readings.map((reading, i) => {
          const dayNum = i + 1
          const isDone = dayNum < currentDay
          const isToday = dayNum === currentDay
          return (
            <button
              key={i}
              onClick={() => readPassage(reading)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left w-full transition-colors ${
                isDone
                  ? 'bg-stone-900 text-stone-500'
                  : isToday
                  ? 'bg-stone-800 border border-amber-400 text-stone-100 font-medium'
                  : 'bg-stone-900 text-stone-400 hover:border hover:border-stone-700'
              }`}
            >
              <span className="text-stone-600 w-8 text-right shrink-0">{dayNum}</span>
              <span className="flex-1">{reading}</span>
              {isDone
                ? <span className="text-amber-400 shrink-0">✓</span>
                : <span className="text-stone-600 shrink-0">›</span>
              }
            </button>
          )
        })}
      </div>
    </div>
  )
}
