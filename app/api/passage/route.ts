import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 })

  const apiKey = process.env.ESV_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ESV API key not configured' }, { status: 500 })

  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}&include-headings=true&include-footnotes=false&include-verse-numbers=true&include-short-copyright=false&include-passage-references=true`

  const res = await fetch(url, {
    headers: { Authorization: `Token ${apiKey}` },
  })

  if (!res.ok) return NextResponse.json({ error: 'Failed to fetch passage' }, { status: res.status })

  const data = await res.json()
  return NextResponse.json(data)
}
