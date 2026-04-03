'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const plans = [
  {
    id: 'genesis-to-revelation',
    name: 'Genesis to Revelation',
    description: 'Read through the entire Bible in one year — ~3 chapters per day.',
    duration: '365 days',
    chapters: 1189,
  },
  {
    id: 'new-testament-90',
    name: 'New Testament in 90 Days',
    description: 'A focused journey through the New Testament.',
    duration: '90 days',
    chapters: 260,
  },
  {
    id: 'psalms-proverbs',
    name: 'Psalms & Proverbs',
    description: 'Read through the wisdom books — one psalm and one proverb per day.',
    duration: '31 days',
    chapters: 181,
  },
  {
    id: 'gospels',
    name: 'The Four Gospels',
    description: 'Read Matthew, Mark, Luke, and John back to back.',
    duration: '30 days',
    chapters: 89,
  },
]

export default function PlansPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [activePlans, setActivePlans] = useState<string[]>([])
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('plan_progress')
          .select('plan_id')
          .eq('user_id', data.user.id)
          .then(({ data: plans }) => {
            if (plans) setActivePlans(plans.map((p) => p.plan_id))
          })
      }
    })
  }, [])

  async function handleStartPlan(planId: string) {
    if (!user) {
      router.push('/login')
      return
    }
    setLoading(planId)
    await supabase.from('plan_progress').upsert({
      user_id: user.id,
      plan_id: planId,
      day: 1,
    })
    setActivePlans((prev) => [...prev, planId])
    setLoading(null)
    router.push(`/plans/${planId}`)
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Reading Plans</h1>
        <p className="text-stone-400">Choose a plan and track your progress through Scripture.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isActive = activePlans.includes(plan.id)
          return (
            <div key={plan.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold text-stone-100 mb-1">{plan.name}</h2>
                <p className="text-stone-400 text-sm">{plan.description}</p>
              </div>
              <div className="flex gap-4 text-sm text-stone-500">
                <span>⏱ {plan.duration}</span>
                <span>📖 {plan.chapters} chapters</span>
              </div>
              <button
                onClick={() => handleStartPlan(plan.id)}
                disabled={loading === plan.id}
                className="mt-auto w-full bg-amber-400 text-stone-950 font-semibold py-2 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {loading === plan.id ? 'Starting...' : isActive ? 'Continue Plan' : 'Start Plan'}
              </button>
            </div>
          )
        })}
      </div>

      {!user && (
        <p className="text-stone-500 text-sm text-center">
          <button onClick={() => router.push('/login')} className="text-amber-400 hover:underline">Sign in</button> to save your progress across devices.
        </p>
      )}
    </div>
  )
}
