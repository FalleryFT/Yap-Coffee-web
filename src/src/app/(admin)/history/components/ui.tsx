export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>{children}</div>
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-4 text-left text-[12px] font-bold uppercase tracking-wider text-bark ${className}`}>
      {children}
    </th>
  )
}
