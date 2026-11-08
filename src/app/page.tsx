import Link from "next/link";
import { cookies } from "next/headers";

import { FAVOURITES_COOKIE, parseFavouriteIds } from "@/lib/favourites";
import { searchMeals } from "@/lib/recipes";
import RandomRecipeButton from "./components/random-recipe-button";
import RecipeCard from "./components/recipe-card";

export default async function Home() {
  const [recipes, cookieStore] = await Promise.all([
    searchMeals("pasta"),
    cookies(),
  ]);
  const favouriteIds = new Set(
    parseFavouriteIds(cookieStore.get(FAVOURITES_COOKIE)?.value),
  );
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
        {featuredRecipes.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-3">
          {featuredRecipes.map((recipe) => (
            <RecipeCard
              isFavourite={favouriteIds.has(recipe.id)}
              key={recipe.id}
              recipe={recipe}
            />
          ))}
          </ul>
        ) : (
          <p className="text-zinc-600">
            No recipes are available right now. Try the search page again soon.
          </p>
        )}
      </section>
    </main>
  );
}
