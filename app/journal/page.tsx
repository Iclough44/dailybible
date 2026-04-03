'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type Entry = {
  id: string
  title: string
  body: string
  created_at: string
}

export default function JournalPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadEntries = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        loadEntries(data.user.id).then(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })
  }, [loadEntries])

  async function saveEntry() {
    if (!title.trim() || !body.trim() || !user) return
    const { error } = await supabase.from('journal_entries').insert({
      user_id: user.id,
      title: title.trim(),
      body: body.trim(),
    })
    if (!error) {
      setTitle('')
      setBody('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      await loadEntries(user.id)
    }
  }

  async function deleteEntry(id: string) {
    await supabase.from('journal_entries').delete().eq('id', id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  if (loading) {
    return <div className="py-16 text-center text-stone-400">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-stone-300 text-lg">Sign in to access your journal.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-amber-400 text-stone-950 font-semibold px-6 py-2 rounded-xl hover:bg-amber-300 transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Journal</h1>
        <p className="text-stone-400">Write down your reflections, prayers, and what God is teaching you.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-stone-100">New Entry</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
        />
        <textarea
          placeholder="Write your reflection..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
        />
        <button
          onClick={saveEntry}
          className="self-end bg-amber-400 text-stone-950 font-semibold px-6 py-2 rounded-xl hover:bg-amber-300 transition-colors"
        >
          {saved ? 'Saved!' : 'Save Entry'}
        </button>
      </div>

      {entries.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-100">Past Entries</h2>
          {entries.map((entry) => (
            <div key={entry.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-stone-100">{entry.title}</h3>
                  <p className="text-stone-500 text-sm">
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-stone-600 hover:text-red-400 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-stone-300 whitespace-pre-wrap leading-relaxed">{entry.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-stone-500 text-center py-8">No entries yet. Write your first reflection above.</p>
      )}
    </div>
  )
}
