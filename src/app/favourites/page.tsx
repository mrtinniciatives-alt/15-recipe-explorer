import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { cookies } from "next/headers";

import FavouriteButton from "../components/favourite-button";
import { FAVOURITES_COOKIE, parseFavouriteIds } from "@/lib/favourites";
import { getMeal } from "@/lib/meals";

async function FavouriteMeals() {
  const cookieStore = await cookies();
  const ids = parseFavouriteIds(cookieStore.get(FAVOURITES_COOKIE)?.value);
  const meals = await Promise.all(ids.map((id) => getMeal(id)));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 lg:px-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Your collection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Favourites
        </h1>
        <p className="mt-3 text-zinc-600">
          Saved recipes stay in this browser. You can keep up to 50.
        </p>
      </div>

      {ids.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 p-8 text-zinc-600">
          No favourites yet.{" "}
          <Link className="font-semibold text-emerald-800" href="/search">
            Find a recipe to save
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ids.map((id, index) => {
            const meal = meals[index];
            return (
              <li
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                key={id}
              >
                {meal ? (
                  <Image
                    alt={meal.strMeal}
                    className="h-52 w-full object-cover"
                    height={600}
                    src={meal.strMealThumb}
                    unoptimized
                    width={900}
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-zinc-100 text-sm text-zinc-500">
                    This recipe is no longer available.
                  </div>
                )}
                <div className="space-y-3 p-5">
                  <h2 className="font-semibold text-zinc-900">
                    {meal?.strMeal ?? "Unavailable recipe"}
                  </h2>
                  <FavouriteButton initialFavourite mealId={id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}

function FavouriteFallback() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 lg:px-12">
      <p className="text-zinc-600">Loading favourites…</p>
    </main>
  );
}

export default function FavouritesPage() {
  return (
    <Suspense fallback={<FavouriteFallback />}>
      <FavouriteMeals />
    </Suspense>
  );
}
