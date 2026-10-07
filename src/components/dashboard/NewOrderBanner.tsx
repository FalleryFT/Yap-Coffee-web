import { ArrowRight, BellRing } from 'lucide-react'
import { Link } from 'react-router-dom'
import { newOrderAlert } from '../../data/dummy'

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join('')
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
}

export function NewOrderBanner() {
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-xl border border-honey border-l-4 border-l-mocha bg-peach p-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-mocha text-white">
        <BellRing size={22} strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-mocha">
        <p className="font-bold text-espresso">{newOrderAlert.count} Pesanan Baru Masuk!</p>
        <p>
          Pesanan batch jam pickup {newOrderAlert.pickupTime} oleh{' '}
          {joinNames(newOrderAlert.customers)}.
        </p>
      </div>
      <Link
        to="/orders"
        className="flex h-11 items-center gap-2 rounded-lg bg-espresso px-5 text-sm font-semibold text-white hover:bg-espresso/90"
      >
        Proses Sekarang
        <ArrowRight size={16} />
      </Link>
    </section>
  )
}