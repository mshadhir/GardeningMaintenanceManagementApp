export default function LoadingSites() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-32 animate-pulse rounded-xl border border-gray-100 bg-gray-100" />
        ))}
      </div>
    </main>
  );
}
