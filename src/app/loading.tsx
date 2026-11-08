export default function Loading() {
  return (
    <main
      aria-label="Loading projects"
      className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 sm:py-16 lg:px-12"
    >
      <div className="mb-10 space-y-3">
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
        <div className="h-12 w-64 animate-pulse rounded bg-zinc-200" />
        <div className="h-5 w-full max-w-lg animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            aria-hidden="true"
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            key={item}
          >
            <div className="h-2 animate-pulse bg-zinc-200" />
            <div className="space-y-4 p-6">
              <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
              <div className="h-10 animate-pulse rounded bg-zinc-100" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
