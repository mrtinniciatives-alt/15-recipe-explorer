import { cookies } from "next/headers";
import Image from "next/image";
import { Suspense } from "react";

import FavouriteButton from "../components/favourite-button";
import { FAVOURITES_COOKIE, parseFavouriteIds } from "@/lib/favourites";
import { getMeal } from "@/lib/meals";

export default function FavouritesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12 sm:px-10 lg:px-12">
      <Suspense
        fallback={
          <p aria-live="polite" className="text-zinc-600">
            Loading favourites…
          </p>
        }
      >
        <FavouritesContent />
      </Suspense>
    </main>
  );
}

async function FavouritesContent() {
  const cookieStore = await cookies();
  const favouriteIds = parseFavouriteIds(
    cookieStore.get(FAVOURITES_COOKIE)?.value,
  );
  const meals = (
    await Promise.all(favouriteIds.map((id) => getMeal(id)))
  ).filter((meal) => meal !== null);

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
        Your collection
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Favourites
      </h1>
      {meals.length === 0 ? (
        <p className="mt-5 text-zinc-600">
          You haven’t saved any recipes yet. Search for a meal and tap its heart
          to keep it here.
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <li
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              key={meal.idMeal}
            >
              <Image
                alt={meal.strMeal}
                className="h-52 w-full object-cover"
                height={600}
                src={meal.strMealThumb}
                unoptimized
                width={900}
              />
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <h2 className="font-semibold text-zinc-900">{meal.strMeal}</h2>
                <FavouriteButton
                  initialIsFavourite
                  mealId={meal.idMeal}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
