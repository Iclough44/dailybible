'use client'
import { useState, useEffect } from 'react'

type Entry = {
  id: string
  date: string
  title: string
  body: string
}

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('journal-entries')
    if (stored) setEntries(JSON.parse(stored))
  }, [])

  function saveEntry() {
    if (!title.trim() || !body.trim()) return
    const newEntry: Entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: title.trim(),
      body: body.trim(),
    }
    const updated = [newEntry, ...entries]
    setEntries(updated)
    localStorage.setItem('journal-entries', JSON.stringify(updated))
    setTitle('')
    setBody('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function deleteEntry(id: string) {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    localStorage.setItem('journal-entries', JSON.stringify(updated))
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

      {entries.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-100">Past Entries</h2>
          {entries.map((entry) => (
            <div key={entry.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-stone-100">{entry.title}</h3>
                  <p className="text-stone-500 text-sm">{entry.date}</p>
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
      )}

      {entries.length === 0 && (
        <p className="text-stone-500 text-center py-8">No entries yet. Write your first reflection above.</p>
      )}
    </div>
  )
}
