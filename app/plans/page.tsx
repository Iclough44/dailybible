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
  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Reading Plans</h1>
        <p className="text-stone-400">Choose a plan and track your progress through Scripture.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-100 mb-1">{plan.name}</h2>
              <p className="text-stone-400 text-sm">{plan.description}</p>
            </div>
            <div className="flex gap-4 text-sm text-stone-500">
              <span>⏱ {plan.duration}</span>
              <span>📖 {plan.chapters} chapters</span>
            </div>
            <button className="mt-auto w-full bg-amber-400 text-stone-950 font-semibold py-2 rounded-xl hover:bg-amber-300 transition-colors">
              Start Plan
            </button>
          </div>
        ))}
      </div>

      <p className="text-stone-500 text-sm text-center">
        Sign in to save your progress across devices.
      </p>
    </div>
  )
}
