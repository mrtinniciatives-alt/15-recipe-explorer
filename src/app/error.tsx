"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16 sm:px-10 lg:px-12">
      <section
        aria-labelledby="error-title"
        className="w-full rounded-2xl border border-red-200 bg-white p-8"
        role="alert"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-red-700">
          Something went wrong
        </p>
        <h1
          className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950"
          id="error-title"
        >
          We couldn&apos;t load your projects.
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Check your database connection and try again.
        </p>
        <button
          className="mt-6 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          onClick={() => retry()}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
