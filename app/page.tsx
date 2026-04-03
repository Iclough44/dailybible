import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center gap-12 py-16">
      <div>
        <h1 className="text-5xl font-bold text-amber-400 mb-4">Daily Bible</h1>
        <p className="text-stone-400 text-lg max-w-md">
          Your daily companion for Scripture — read the verse of the day, follow reading plans, and journal your reflections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <Link href="/verse" className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-400 transition-colors text-left">
          <div className="text-3xl mb-3">📖</div>
          <h2 className="text-lg font-semibold text-stone-100 mb-1 group-hover:text-amber-400 transition-colors">Verse of the Day</h2>
          <p className="text-stone-400 text-sm">Start each morning with a fresh verse from Scripture.</p>
        </Link>

        <Link href="/plans" className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-400 transition-colors text-left">
          <div className="text-3xl mb-3">📅</div>
          <h2 className="text-lg font-semibold text-stone-100 mb-1 group-hover:text-amber-400 transition-colors">Reading Plans</h2>
          <p className="text-stone-400 text-sm">Follow structured plans to read through the Bible.</p>
        </Link>

        <Link href="/journal" className="group bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-400 transition-colors text-left">
          <div className="text-3xl mb-3">✍️</div>
          <h2 className="text-lg font-semibold text-stone-100 mb-1 group-hover:text-amber-400 transition-colors">Journal</h2>
          <p className="text-stone-400 text-sm">Write down reflections, prayers, and what God is teaching you.</p>
        </Link>
      </div>
    </div>
  )
}
