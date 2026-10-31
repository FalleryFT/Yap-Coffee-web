import type { MapsParseResult } from '@/types/maps'

const SHORT_LINK_REASON =
  'Link pendek (maps.app.goo.gl) belum bisa ditampilkan. Buka linknya di browser, lalu salin URL lengkap dari address bar.'
const NOT_MAPS_REASON = 'Link harus berasal dari Google Maps (google.com/maps).'
const NO_POINT_REASON =
  'Titik lokasi tidak ditemukan pada link ini. Pilih satu tempat di Google Maps, lalu salin linknya.'

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function isGoogleMapsUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase()
  if (/^maps\.google\.[a-z.]+$/.test(host)) return true
  return /^(www\.)?google\.[a-z.]+$/.test(host) && url.pathname.startsWith('/maps')
}

/**
 * Membaca link Google Maps (URL lengkap) dan membuat URL embed iframe.
 * Urutan pencarian titik: koordinat pin (!3d..!4d..) → @lat,lng → nama tempat → ?q= / ?query=.
 */
export function parseGoogleMapsUrl(raw: string): MapsParseResult {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return { ok: false, reason: 'Link tidak valid. Tempel link lengkap yang diawali https://' }
  }

  const host = url.hostname.toLowerCase()
  if (host === 'maps.app.goo.gl' || (host === 'goo.gl' && url.pathname.startsWith('/maps'))) {
    return { ok: false, reason: SHORT_LINK_REASON }
  }
  if (!isGoogleMapsUrl(url)) return { ok: false, reason: NOT_MAPS_REASON }

  const path = safeDecode(url.pathname)
  let query: string | null = null

  const pin = url.href.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  if (pin) query = `${pin[1]},${pin[2]}`

  if (!query) {
    const at = path.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
    if (at) query = `${at[1]},${at[2]}`
  }

  if (!query) {
    const place = path.match(/\/(?:place|search)\/([^/@]+)/)
    if (place) query = place[1].replace(/\+/g, ' ').trim()
  }

  if (!query) {
    query = url.searchParams.get('q') ?? url.searchParams.get('query')
  }

  if (!query) return { ok: false, reason: NO_POINT_REASON }

  return {
    ok: true,
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=17&output=embed`,
  }
}
