import { Skeleton, SkeletonCard } from './Skeleton'

const MAIN = 'flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'
const BAR_HEIGHTS = ['h-[45%]', 'h-[70%]', 'h-[55%]', 'h-[85%]', 'h-[60%]', 'h-[40%]', 'h-[75%]']

function Page({ children, className = MAIN }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={className} aria-busy="true" aria-live="polite">
      <span className="sr-only">Memuat halaman…</span>
      {children}
    </main>
  )
}

function HeaderSkeleton({ centered = false }: { centered?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 ${centered ? 'items-center' : ''}`}>
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  )
}

function StatRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-36" />
        </SkeletonCard>
      ))}
    </div>
  )
}

function ChartCardSkeleton() {
  return (
    <SkeletonCard className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="flex h-48 items-end gap-3">
        {BAR_HEIGHTS.map((height, i) => (
          <Skeleton key={i} className={`flex-1 ${height}`} />
        ))}
      </div>
    </SkeletonCard>
  )
}

function TableCardSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <SkeletonCard className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-56 max-w-1/2" />
      </div>
      <div className="divide-y divide-line">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="hidden h-4 w-32 sm:block" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </SkeletonCard>
  )
}

// ---------- Dashboard ----------

/** Isi dashboard di bawah header (dipakai juga di dalam DashboardScreen saat pemuatan pertama). */
export function DashboardBodySkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <ChartCardSkeleton />
        <SkeletonCard className="flex flex-col gap-4 p-6">
          <Skeleton className="h-5 w-36" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </SkeletonCard>
      </div>
      <StatRowSkeleton />
      <TableCardSkeleton />
    </>
  )
}

export function DashboardSkeleton() {
  return (
    <Page>
      <HeaderSkeleton />
      <DashboardBodySkeleton />
    </Page>
  )
}

// ---------- Orders ----------

export function OrdersSkeleton() {
  return (
    <Page>
      <StatRowSkeleton />
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-11 w-72 max-w-full" />
        <Skeleton className="h-11 w-40" />
        <Skeleton className="h-11 w-40" />
      </div>
      <TableCardSkeleton />
    </Page>
  )
}

// ---------- Menu ----------

export function MenuGridSkeleton() {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
      <span className="sr-only">Memuat menu…</span>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonCard key={i} className="flex flex-col gap-3 p-4">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-5 w-24" />
        </SkeletonCard>
      ))}
    </section>
  )
}

export function MenuSkeleton() {
  return (
    <Page>
      <HeaderSkeleton />
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-11 w-72 max-w-full" />
        <Skeleton className="h-11 w-40" />
      </div>
      <MenuGridSkeleton />
    </Page>
  )
}

// ---------- Pre-Order ----------

export function ScheduleListSkeleton() {
  return (
    <div aria-busy="true">
      <span className="sr-only">Memuat jadwal…</span>
      <TableCardSkeleton rows={4} />
    </div>
  )
}

export function PreOrderSkeleton() {
  return (
    <Page className="flex flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <HeaderSkeleton />
      <ScheduleListSkeleton />
    </Page>
  )
}

// ---------- History ----------

export function HistorySkeleton() {
  return (
    <Page>
      <HeaderSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <ChartCardSkeleton />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} className="flex flex-col gap-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-40" />
            </SkeletonCard>
          ))}
        </div>
      </div>
      <TableCardSkeleton />
    </Page>
  )
}

// ---------- Outlet & Profile ----------

export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <span className="sr-only">Memuat…</span>
      <SkeletonCard className="flex flex-col gap-5 p-6">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: fields }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </SkeletonCard>
      <div className="flex justify-end">
        <Skeleton className="h-11 w-40 rounded-lg" />
      </div>
    </div>
  )
}

export function FormPageSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:px-6" aria-busy="true">
      <HeaderSkeleton centered />
      <FormSkeleton fields={fields} />
    </main>
  )
}

// ---------- Kerangka admin (sidebar + topbar) ----------

export function AdminShellSkeleton() {
  return (
    <div className="flex min-h-dvh" aria-busy="true">
      <span className="sr-only">Memuat…</span>
      <aside className="hidden w-64 shrink-0 flex-col gap-3 border-r border-line bg-sidebar p-6 lg:flex">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-line bg-cream/90 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="size-9 rounded-full" />
        </div>
        <div className="flex-1" />
      </div>
    </div>
  )
}