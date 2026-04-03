async function getVerseOfTheDay() {
  // Rotating list of daily verses (index by day of year)
  const verses = [
    'john/3/16', 'psalms/23/1', 'philippians/4/13', 'jeremiah/29/11',
    'romans/8/28', 'proverbs/3/5', 'isaiah/40/31', 'matthew/11/28',
    'joshua/1/9', 'romans/15/13', 'ephesians/2/8', 'hebrews/11/1',
  ]
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  const ref = verses[dayOfYear % verses.length]
  try {
    const res = await fetch(`https://bible-api.com/${ref}`, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error('Failed')
    return await res.json()
  } catch {
    return null
  }
}

export default async function VersePage() {
  const data = await getVerseOfTheDay()

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Verse of the Day</h1>
        <p className="text-stone-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-8">
        {data ? (
          <>
            <blockquote className="text-xl text-stone-100 leading-relaxed italic mb-6">
              &ldquo;{data.text?.trim()}&rdquo;
            </blockquote>
            <p className="text-amber-400 font-semibold text-right">{data.reference}</p>
          </>
        ) : (
          <p className="text-stone-400 text-center">Could not load verse. Please check your connection.</p>
        )}
      </div>

      <p className="text-stone-500 text-sm">Translation: World English Bible (WEB)</p>
    </div>
  )
}
