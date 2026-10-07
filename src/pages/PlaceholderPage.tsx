// Halaman sementara agar menu sidebar bisa diklik. Diganti satu per satu.
export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-espresso">{title}</h1>
      <p className="mt-2 text-sm">Halaman ini belum dibuat.</p>
    </main>
  )
}