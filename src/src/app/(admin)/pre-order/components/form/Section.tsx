import type { ReactNode } from 'react'

interface Props {
  step: number
  title: string
  badge?: ReactNode
  children: ReactNode
}

export function Section({ step, title, badge, children }: Props) {
  return (
    <section className="rounded-xl border border-line bg-sidebar p-4">
      <header className="mb-3 flex items-center justify-between border-b border-line pb-3">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wide text-espresso uppercase">
          <span className="flex size-5 items-center justify-center rounded-full bg-espresso text-[11px] text-white">
            {step}
          </span>
          {title}
        </h3>
        {badge}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
