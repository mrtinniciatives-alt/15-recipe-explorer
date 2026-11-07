"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type SearchBoxProps = {
  initialQuery: string;
};

export default function SearchBox({ initialQuery }: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const nextUrl = query.trim()
        ? `/search?q=${encodeURIComponent(query.trim())}`
        : "/search";

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, router]);

  return (
    <div className="relative mt-6">
      <label className="sr-only" htmlFor="recipe-search">
        Search recipes
      </label>
      <input
        autoComplete="off"
        className="h-14 w-full rounded-2xl border border-zinc-300 bg-white px-5 pr-28 text-base text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
        id="recipe-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try “pasta” or “tomato”"
        type="search"
        value={query}
      />
      <span
        aria-live="polite"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-500"
      >
        {isPending ? "Searching…" : ""}
      </span>
    </div>
  );
}
