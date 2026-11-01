import { CalendarDays, ExternalLink, MapPin, Navigation, Receipt, User, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'
import { Modal } from '@/app/components/Modal'
import { pill } from '@/constants/orders'
import { describeDate } from '@/lib/format'
import type { Order } from '@/types/orders'
import { shortDate } from '@/utils/history'
import { itemsSubtotal, mapsDirectionsUrl, mapsSearchUrl, rp, whatsappUrl } from '@/utils/orders'
import { Btn, IconBtn } from './ui'

interface Props {
  order: Order
  onClose: () => void
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-xl border border-line">
      <h3 className="flex items-center gap-2 border-b border-line bg-sand/60 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-bark">
        <Icon size={14} />
        {title}
      </h3>
      <div className="px-4 py-1">{children}</div>
    </section>
  )
}

// Satu baris "label ... nilai"
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line py-2.5 text-[14px] last:border-b-0">
      <dt className="shrink-0 text-bark">{label}</dt>
      <dd className="text-right font-medium text-ink">{children}</dd>
    </div>
  )
}

const linkBtn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-medium transition-colors'

export function OrderDetailModal({ order: o, onClose }: Props) {
  const titleId = useId()
  const subtotal = itemsSubtotal(o.items)
  const extra = o.total - subtotal

  return (
    <Modal labelledBy={titleId} onClose={onClose} widthClass="max-w-[980px]">
      <div>
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-line pb-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 id={titleId} className="text-[22px] font-bold leading-tight text-espresso">
              {o.code}
            </h2>
            <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${pill[o.status]}`}>{o.status}</span>
            <span className="text-[13px] text-bark">
              Masuk {shortDate(o.date)} · {o.time}
            </span>
          </div>
          <IconBtn label="Tutup" onClick={onClose}>
            <X size={16} />
          </IconBtn>
        </header>

       <div className="mt-5 space-y-5">
  {/* Baris 1: Pelanggan + Jadwal Pengambilan (2 kolom) */}
  <div className="grid gap-5 md:grid-cols-2">
    <Section icon={User} title="Pelanggan">
      <dl>
        <Row label="Nama">{o.name}</Row>
        <Row label="WhatsApp">
          <a
            href={whatsappUrl(o.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-espresso underline-offset-2 hover:underline"
          >
            {o.phone}
          </a>
        </Row>
        <Row label="Pembayaran">{o.pay}</Row>
        {o.note && <Row label="Catatan">{o.note}</Row>}
      </dl>
    </Section>

    <Section icon={CalendarDays} title="Jadwal Pengambilan">
      <dl>
        <Row label="Kloter">{o.kloter.name}</Row>
        <Row label="Tanggal">{describeDate(o.kloter.date).dateLong}</Row>
        <Row label="Jam kloter">{o.kloter.hours} WIB</Row>
        <Row label="Slot pickup">{o.window.replace(' - ', ' – ')} WIB</Row>
      </dl>
    </Section>
  </div>

  {/* Baris 2: Ringkasan Pesanan (full width) */}
  <Section icon={Receipt} title="Ringkasan Pesanan">
    <ul>
      {o.items.map((it) => (
        <li
          key={it.name}
          className="flex items-start justify-between gap-4 border-b border-line py-3 text-[14px]"
        >
          <div>
            <div className="font-medium text-ink">
              <span className="mr-1.5 text-espresso">{it.qty}x</span>
              {it.name}
            </div>
            {it.mods.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {it.mods.map((m) => (
                  <span
                    key={m}
                    className="rounded-md bg-sand px-2 py-0.5 text-[11px] font-medium text-espresso"
                  >
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="shrink-0 text-bark">{rp(it.price)}</span>
        </li>
      ))}
    </ul>

    <dl className="py-3 text-[14px]">
      <div className="flex justify-between py-1 text-bark">
        <dt>Subtotal menu</dt>
        <dd>{rp(subtotal)}</dd>
      </div>
      {extra > 0 && (
        <div className="flex justify-between py-1 text-bark">
          <dt>Add-on &amp; biaya lain</dt>
          <dd>{rp(extra)}</dd>
        </div>
      )}
      <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-semibold text-ink">Total</dt>
        <dd className="text-[20px] font-bold text-espresso">{rp(o.total)}</dd>
      </div>
    </dl>
  </Section>

  {/* Baris 3: Titik Temu (full width) */}
  <Section icon={MapPin} title="Titik Temu Pengambilan">
    <dl>
      <Row label="Lokasi">{o.pickup.name}</Row>
      <Row label="Detail">{o.pickup.detail}</Row>
      <Row label="Area">{o.pickup.area}</Row>
      <Row label="Patokan rute">
        <span className="font-normal leading-relaxed text-bark">{o.pickup.route}</span>
      </Row>
    </dl>
    <div className="flex flex-wrap gap-2 pb-3 pt-1">
      <a
        href={mapsSearchUrl(o.pickup.mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkBtn} bg-sand text-espresso hover:bg-line`}
      >
        <ExternalLink size={15} />
        Buka di Google Maps
      </a>
      <a
        href={mapsDirectionsUrl(o.pickup.mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${linkBtn} bg-espresso text-white hover:bg-espresso/90`}
      >
        <Navigation size={15} />
        Penunjuk Arah
      </a>
    </div>
  </Section>
</div>

        <div className="mt-5 flex justify-end border-t border-line pt-5">
          <Btn variant="ghost" onClick={onClose}>
            Tutup
          </Btn>
        </div>
      </div>
    </Modal>
  )
}