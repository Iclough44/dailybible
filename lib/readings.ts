// Bible books with chapter counts in canonical order
const BOOKS: [string, number][] = [
  ['Genesis', 50], ['Exodus', 40], ['Leviticus', 27], ['Numbers', 36],
  ['Deuteronomy', 34], ['Joshua', 24], ['Judges', 21], ['Ruth', 4],
  ['1 Samuel', 31], ['2 Samuel', 24], ['1 Kings', 22], ['2 Kings', 25],
  ['1 Chronicles', 29], ['2 Chronicles', 36], ['Ezra', 10], ['Nehemiah', 13],
  ['Esther', 10], ['Job', 42], ['Psalms', 150], ['Proverbs', 31],
  ['Ecclesiastes', 12], ['Song of Solomon', 8], ['Isaiah', 66],
  ['Jeremiah', 52], ['Lamentations', 5], ['Ezekiel', 48], ['Daniel', 12],
  ['Hosea', 14], ['Joel', 3], ['Amos', 9], ['Obadiah', 1], ['Jonah', 4],
  ['Micah', 7], ['Nahum', 3], ['Habakkuk', 3], ['Zephaniah', 3],
  ['Haggai', 2], ['Zechariah', 14], ['Malachi', 4],
  ['Matthew', 28], ['Mark', 16], ['Luke', 24], ['John', 21], ['Acts', 28],
  ['Romans', 16], ['1 Corinthians', 16], ['2 Corinthians', 13],
  ['Galatians', 6], ['Ephesians', 6], ['Philippians', 4], ['Colossians', 4],
  ['1 Thessalonians', 5], ['2 Thessalonians', 3], ['1 Timothy', 6],
  ['2 Timothy', 4], ['Titus', 3], ['Philemon', 1], ['Hebrews', 13],
  ['James', 5], ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5],
  ['2 John', 1], ['3 John', 1], ['Jude', 1], ['Revelation', 22],
]

const NT_BOOKS: [string, number][] = [
  ['Matthew', 28], ['Mark', 16], ['Luke', 24], ['John', 21], ['Acts', 28],
  ['Romans', 16], ['1 Corinthians', 16], ['2 Corinthians', 13],
  ['Galatians', 6], ['Ephesians', 6], ['Philippians', 4], ['Colossians', 4],
  ['1 Thessalonians', 5], ['2 Thessalonians', 3], ['1 Timothy', 6],
  ['2 Timothy', 4], ['Titus', 3], ['Philemon', 1], ['Hebrews', 13],
  ['James', 5], ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5],
  ['2 John', 1], ['3 John', 1], ['Jude', 1], ['Revelation', 22],
]

// Generate sequential readings from a book list, grouping into chunks per day
function generateReadings(books: [string, number][], days: number): string[] {
  // Build flat list of all chapters
  const chapters: string[] = []
  for (const [book, count] of books) {
    for (let ch = 1; ch <= count; ch++) {
      chapters.push(`${book} ${ch}`)
    }
  }

  const total = chapters.length
  const readings: string[] = []

  for (let day = 0; day < days; day++) {
    const start = Math.floor((day * total) / days)
    const end = Math.floor(((day + 1) * total) / days)
    const dayChapters = chapters.slice(start, end)

    // Group consecutive chapters of the same book
    const groups: string[] = []
    let i = 0
    while (i < dayChapters.length) {
      const parts = dayChapters[i].split(' ')
      const chNum = parseInt(parts[parts.length - 1])
      const bookName = parts.slice(0, parts.length - 1).join(' ')
      let j = i + 1
      while (j < dayChapters.length) {
        const nextParts = dayChapters[j].split(' ')
        const nextBook = nextParts.slice(0, nextParts.length - 1).join(' ')
        if (nextBook !== bookName) break
        j++
      }
      const endCh = parseInt(dayChapters[j - 1].split(' ').pop()!)
      if (chNum === endCh) {
        groups.push(`${bookName} ${chNum}`)
      } else {
        groups.push(`${bookName} ${chNum}-${endCh}`)
      }
      i = j
    }
    readings.push(groups.join('; '))
  }

  return readings
}

// Psalms & Proverbs: 31 days
function generatePsalmsProverbs(): string[] {
  const readings: string[] = []
  for (let day = 1; day <= 31; day++) {
    const psalmStart = (day - 1) * 5 + 1
    const psalmEnd = Math.min(day * 5, 150)
    readings.push(`Psalms ${psalmStart}-${psalmEnd}; Proverbs ${day}`)
  }
  return readings
}

export type PlanId = 'genesis-to-revelation' | 'new-testament-90' | 'psalms-proverbs' | 'gospels'

export const PLAN_READINGS: Record<PlanId, string[]> = {
  'genesis-to-revelation': generateReadings(BOOKS, 365),
  'new-testament-90': generateReadings(NT_BOOKS, 90),
  'psalms-proverbs': generatePsalmsProverbs(),
  'gospels': generateReadings(
    [['Matthew', 28], ['Mark', 16], ['Luke', 24], ['John', 21]], 30
  ),
}

export const PLAN_INFO: Record<PlanId, { name: string; description: string; duration: string; chapters: number }> = {
  'genesis-to-revelation': {
    name: 'Genesis to Revelation',
    description: 'Read through the entire Bible in one year — ~3 chapters per day.',
    duration: '365 days',
    chapters: 1189,
  },
  'new-testament-90': {
    name: 'New Testament in 90 Days',
    description: 'A focused journey through the New Testament.',
    duration: '90 days',
    chapters: 260,
  },
  'psalms-proverbs': {
    name: 'Psalms & Proverbs',
    description: 'Read through the wisdom books — one psalm and one proverb per day.',
    duration: '31 days',
    chapters: 181,
  },
  'gospels': {
    name: 'The Four Gospels',
    description: 'Read Matthew, Mark, Luke, and John back to back.',
    duration: '30 days',
    chapters: 89,
  },
}
