import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  const lang = req.nextUrl.searchParams.get('lang') || 'en'
  const short = req.nextUrl.searchParams.get('short') === 'true'

  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 })

  // Spanish: use bible-api.com with RVR1960
  if (lang === 'es') {
    const res = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=rvr1960`)
    if (!res.ok) return NextResponse.json({ error: 'Failed to fetch passage' }, { status: res.status })
    const data = await res.json()
    return NextResponse.json({ passages: [data.text?.trim() || ''] })
  }

  // English: use ESV API
  const apiKey = process.env.ESV_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ESV API key not configured' }, { status: 500 })

  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-headings=${!short}&include-footnotes=false&include-verse-numbers=${!short}&include-short-copyright=false&include-passage-references=false`

  const res = await fetch(url, {
    headers: { Authorization: `Token ${apiKey}` },
  })

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch passage' }, { status: res.status })
  const data = await res.json()
  return NextResponse.json(data)
}
