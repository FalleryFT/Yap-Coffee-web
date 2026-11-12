import { parseGoogleMapsUrl } from '@/lib/maps'

interface MapsEmbedProps {
  /** Link Google Maps lengkap yang disimpan admin. */
  url: string
  title?: string
  className?: string
}

// Dipakai di preview form admin dan di sisi pelanggan (portal pemesanan).
export function MapsEmbed({ url, title = 'Peta titik pengambilan', className = 'h-48' }: MapsEmbedProps) {
  const result = parseGoogleMapsUrl(url)
  if (!result.ok) return null

  return (
    <iframe
      src={result.embedUrl}
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className={`w-full rounded-lg border border-line ${className}`}
    />
  )
}
