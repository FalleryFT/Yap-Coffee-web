export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-espresso/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export function SkeletonCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`rounded-2xl border border-line bg-white p-5 shadow-card ${className}`}>{children}</div>
}

/** Baris tabel kerangka untuk di dalam <tbody> (dipakai saat tabel belum punya data sama sekali). */
export function TableRowsSkeleton({ cols, rows = 6 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} aria-hidden="true">
          {Array.from({ length: cols }, (_, c) => (
            <td key={c} className="px-3 py-5">
              <Skeleton className={c === 0 ? 'h-4 w-24' : 'h-4 w-full max-w-36'} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}