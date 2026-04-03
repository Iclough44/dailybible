import { NextRequest, NextResponse } from 'next/server'

// Book name to bolls.life book number mapping
const BOOK_NUMBERS: Record<string, number> = {
  'genesis': 1, 'exodus': 2, 'leviticus': 3, 'numbers': 4, 'deuteronomy': 5,
  'joshua': 6, 'judges': 7, 'ruth': 8, '1 samuel': 9, '2 samuel': 10,
  '1 kings': 11, '2 kings': 12, '1 chronicles': 13, '2 chronicles': 14,
  'ezra': 15, 'nehemiah': 16, 'esther': 17, 'job': 18, 'psalms': 19,
  'psalm': 19, 'proverbs': 20, 'ecclesiastes': 21, 'song of solomon': 22,
  'isaiah': 23, 'jeremiah': 24, 'lamentations': 25, 'ezekiel': 26,
  'daniel': 27, 'hosea': 28, 'joel': 29, 'amos': 30, 'obadiah': 31,
  'jonah': 32, 'micah': 33, 'nahum': 34, 'habakkuk': 35, 'zephaniah': 36,
  'haggai': 37, 'zechariah': 38, 'malachi': 39, 'matthew': 40, 'mark': 41,
  'luke': 42, 'john': 43, 'acts': 44, 'romans': 45, '1 corinthians': 46,
  '2 corinthians': 47, 'galatians': 48, 'ephesians': 49, 'philippians': 50,
  'colossians': 51, '1 thessalonians': 52, '2 thessalonians': 53,
  '1 timothy': 54, '2 timothy': 55, 'titus': 56, 'philemon': 57,
  'hebrews': 58, 'james': 59, '1 peter': 60, '2 peter': 61,
  '1 john': 62, '2 john': 63, '3 john': 64, 'jude': 65, 'revelation': 66,
}

// Parse "Genesis 1-3" → { bookNum: 1, startChapter: 1, endChapter: 3 }
function parseRef(ref: string): { bookNum: number; startChapter: number; endChapter: number } | null {
  const clean = ref.trim()
  // Match "Book Name 1" or "Book Name 1-3"
  const match = clean.match(/^(.+?)\s+(\d+)(?:-(\d+))?$/)
  if (!match) return null
  const bookName = match[1].toLowerCase()
  const startChapter = parseInt(match[2])
  const endChapter = match[3] ? parseInt(match[3]) : startChapter
  const bookNum = BOOK_NUMBERS[bookName]
  if (!bookNum) return null
  return { bookNum, startChapter, endChapter }
}

async function fetchSpanishChapter(bookNum: number, chapter: number): Promise<string> {
  const res = await fetch(`https://bolls.life/get-chapter/RV1960/${bookNum}/${chapter}/`)
  if (!res.ok) return ''
  const verses: { verse: number; text: string }[] = await res.json()
  return verses
    .map((v) => `${v.verse} ${v.text.replace(/<[^>]*>/g, '')}`)
    .join('\n')
}

async function fetchSpanishPassage(ref: string): Promise<string> {
  // Handle semicolon-separated refs like "Genesis 1-3; Exodus 1"
  const parts = ref.split(';').map((s) => s.trim())
  const sections: string[] = []

  for (const part of parts) {
    const parsed = parseRef(part)
    if (!parsed) continue
    const { bookNum, startChapter, endChapter } = parsed
    const chapterTexts: string[] = []
    for (let ch = startChapter; ch <= endChapter; ch++) {
      const text = await fetchSpanishChapter(bookNum, ch)
      if (text) chapterTexts.push(`Capítulo ${ch}\n\n${text}`)
    }
    if (chapterTexts.length > 0) {
      sections.push(`${part}\n\n${chapterTexts.join('\n\n')}`)
    }
  }

  return sections.join('\n\n---\n\n')
}

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  const lang = req.nextUrl.searchParams.get('lang') || 'en'
  const short = req.nextUrl.searchParams.get('short') === 'true'

  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 })

  // Spanish: use bolls.life with RV1960
  if (lang === 'es') {
    try {
      const text = await fetchSpanishPassage(ref)
      if (!text) return NextResponse.json({ error: 'Passage not found' }, { status: 404 })
      return NextResponse.json({ passages: [text] })
    } catch {
      return NextResponse.json({ error: 'Failed to fetch Spanish passage' }, { status: 500 })
    }
  }

  // English: use ESV API
  const apiKey = process.env.ESV_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ESV API key not configured' }, { status: 500 })

  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-headings=${!short}&include-footnotes=false&include-verse-numbers=${!short}&include-short-copyright=false&include-passage-references=false`

  const res = await fetch(url, { headers: { Authorization: `Token ${apiKey}` } })
  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch passage' }, { status: res.status })
  const data = await res.json()
  return NextResponse.json(data)
}
