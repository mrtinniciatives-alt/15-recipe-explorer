import Link from "next/link";

import RandomRecipeButton from "./components/random-recipe-button";
import { recipes } from "@/lib/recipes";

export default function Home() {
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 sm:px-10 lg:px-12">
      <section className="rounded-3xl bg-emerald-950 px-8 py-14 text-white sm:px-14 sm:py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Find your next favorite
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Good food starts with a little inspiration.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-emerald-100">
          Search quick weeknight dinners, comforting classics, and fresh ideas
          for whatever is in your kitchen.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-100"
          href="/search"
        >
          Explore recipes
        </Link>
        <RandomRecipeButton />
      </section>

      <section className="py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              A few ideas
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              Popular right now
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-600"
            href="/search?q=pasta"
          >
            Browse all recipes
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {featuredRecipes.map((recipe) => (
            <Link
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              href={`/search?q=${encodeURIComponent(recipe.name)}`}
              key={recipe.id}
            >
              <div
                aria-label={recipe.name}
                className="h-48 bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url("${recipe.thumb}")` }}
              />
              <h3 className="px-5 py-4 font-semibold text-zinc-900 group-hover:text-emerald-800">
                {recipe.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
