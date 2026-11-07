import Image from "next/image";

import SearchBox from "./search-box";
import { searchRecipes } from "@/lib/recipes";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const results = searchRecipes(query);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 lg:px-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Recipe search
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Find something delicious
        </h1>
        <p className="mt-3 text-zinc-600">
          Search by recipe name, then copy the URL to share your results.
        </p>
        <SearchBox initialQuery={query} />
      </div>

      <section aria-live="polite" className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">
          {query.length >= 2
            ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`
            : "Try searching for a recipe"}
        </h2>
        {query.length < 2 ? (
          <p className="mt-3 text-zinc-600">
            Enter at least two characters to see matching recipes.
          </p>
        ) : results.length === 0 ? (
          <p className="mt-3 text-zinc-600">
            No recipes matched. Try a different ingredient or dish.
          </p>
        ) : (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((recipe) => (
              <li
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                key={recipe.id}
              >
                <Image
                  alt={recipe.name}
                  className="h-52 w-full object-cover"
                  height={600}
                  src={recipe.thumb}
                  unoptimized
                  width={900}
                />
                <h3 className="px-5 py-4 font-semibold text-zinc-900">
                  {recipe.name}
                </h3>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
