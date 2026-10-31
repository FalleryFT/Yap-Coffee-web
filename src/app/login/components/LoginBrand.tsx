import { Coffee } from 'lucide-react'

export function LoginBrand() {
  return (
    <header className="mb-8 text-center">
      <div className="flex items-center justify-center gap-2.5">
        <span className="grid size-10 place-items-center rounded-full bg-espresso text-white">
          <Coffee size={20} aria-hidden />
        </span>
        <span className="text-[1.75rem] leading-none font-bold tracking-tight text-espresso">Yap Coffee</span>
      </div>
      <p className="mt-2 text-xs font-medium tracking-wide text-bark">ADMIN PORTAL</p>
    </header>
  )
}
