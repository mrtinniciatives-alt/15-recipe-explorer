import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import FavouriteButton from "@/app/components/favourite-button";
import { FAVOURITES_COOKIE, parseFavouriteIds } from "@/lib/favourites";
import { getMealById } from "@/lib/recipes";

export default async function FavouritesPage() {
  const cookieStore = await cookies();
  const ids = parseFavouriteIds(cookieStore.get(FAVOURITES_COOKIE)?.value);
  const meals = await Promise.all(ids.map((id) => getMealById(id)));
  const availableMeals = meals.filter((meal) => meal !== null);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 lg:px-12">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
        Your collection
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Favourites
      </h1>
      {ids.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-8 text-center">
          <p className="text-zinc-600">You haven’t saved any recipes yet.</p>
          <Link
            className="mt-4 inline-flex rounded-full bg-emerald-950 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            href="/search"
          >
            Find recipes
          </Link>
        </div>
      ) : (
        <>
          {availableMeals.length < ids.length && (
            <p className="mt-4 text-sm text-amber-800">
              {ids.length - availableMeals.length} saved meal
              {ids.length - availableMeals.length === 1 ? " is" : "s are"} no
              longer available.
            </p>
          )}
          {availableMeals.length > 0 ? (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {availableMeals.map((meal) => (
                <li
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                  key={meal.id}
                >
                  <Image
                    alt={meal.name}
                    className="h-52 w-full object-cover"
                    height={600}
                    src={meal.thumb}
                    unoptimized
                    width={900}
                  />
                  <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <h2 className="font-semibold text-zinc-900">{meal.name}</h2>
                    <FavouriteButton initiallyFavourite mealId={meal.id} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-zinc-600">
              Your saved recipes couldn’t be loaded.
            </p>
          )}
        </>
      )}
    </main>
  );
}
