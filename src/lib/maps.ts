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

export interface Coordinates {
  latitude: number
  longitude: number
}

function toCoordinates(lat: string | undefined, lng: string | undefined): Coordinates | null {
  if (lat === undefined || lng === undefined) return null
  const latitude = Number(lat)
  const longitude = Number(lng)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  return Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180 ? { latitude, longitude } : null
}

/** "-7.9525, 112.6128" (salinan dari Google Maps) → koordinat; null bila formatnya tidak cocok. */
export function parseCoordinates(text: string): Coordinates | null {
  const match = text.trim().match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/)
  return match ? toCoordinates(match[1], match[2]) : null
}

/** Koordinat yang tertanam pada link Google Maps lengkap; sama dengan yang dibaca server saat menyimpan. */
export function coordinatesFromMapsUrl(raw: string): Coordinates | null {
  const pin = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  if (pin) return toCoordinates(pin[1], pin[2])
  const decoded = safeDecode(raw)
  const at = decoded.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/)
  if (at) return toCoordinates(at[1], at[2])
  const query = decoded.match(/[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?)[, ]\s*(-?\d+(?:\.\d+)?)/)
  return query ? toCoordinates(query[1], query[2]) : null
}
