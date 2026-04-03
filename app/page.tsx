import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center pt-4">
        <h1 className="text-4xl font-bold text-amber-400 mb-2">Daily Bible</h1>
        <p className="text-stone-400 text-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/verse" className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-4xl">📖</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Verse of the Day</h2>
            <p className="text-stone-400 text-sm">Start your morning with Scripture</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>

        <Link href="/plans" className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-4xl">📅</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Reading Plans</h2>
            <p className="text-stone-400 text-sm">Follow a structured reading plan</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>

        <Link href="/journal" className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-4xl">✍️</span>
          <div>
            <h2 className="font-semibold text-stone-100 group-hover:text-amber-400 transition-colors">Journal</h2>
            <p className="text-stone-400 text-sm">Reflect and write your thoughts</p>
          </div>
          <span className="ml-auto text-stone-600">›</span>
        </Link>

        <Link href="/login" className="group bg-stone-900 border border-stone-800 rounded-2xl p-5 flex items-center gap-4 hover:border-amber-400 transition-colors active:scale-95">
          <span className="text-4xl">👤</span>
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
