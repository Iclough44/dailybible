'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { PLAN_INFO } from '@/lib/readings'
import type { User } from '@supabase/supabase-js'

const plans = Object.entries(PLAN_INFO).map(([id, info]) => ({ id, ...info }))

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
          .then(({ data: result }) => {
            if (result) setActivePlans(result.map((p) => p.plan_id))
          })
      }
    })
  }, [])

  async function handleStartPlan(planId: string) {
    if (!user) { router.push('/login'); return }
    setLoading(planId)
    await supabase.from('plan_progress').upsert({ user_id: user.id, plan_id: planId, day: 1 })
    setActivePlans((prev) => [...prev, planId])
    setLoading(null)
    router.push(`/plans/${planId}`)
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-3xl font-bold text-amber-400 mb-1">Reading Plans</h1>
        <p className="text-stone-400 text-sm">Choose a plan — tap any day to read the passage in ESV.</p>
      </div>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => {
          const isActive = activePlans.includes(plan.id)
          return (
            <div key={plan.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col gap-4">
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
                className="w-full bg-amber-400 text-stone-950 font-semibold py-2 rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50"
              >
                {loading === plan.id ? 'Opening...' : isActive ? 'Continue Plan' : 'Start Plan'}
              </button>
            </div>
          )
        })}
      </div>

      {!user && (
        <p className="text-stone-500 text-sm text-center">
          <button onClick={() => router.push('/login')} className="text-amber-400 hover:underline">Sign in</button> to save your progress.
        </p>
      )}
    </div>
  )
}
