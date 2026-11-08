"use client";

import { useState, useTransition } from "react";

import { getRandomFavourite } from "@/app/actions/favourites";
import type { Recipe } from "@/lib/recipes";
import FavouriteButton from "./favourite-button";

export default function RandomRecipeButton() {
  const [recipe, setRecipe] = useState<{
    meal: Recipe;
    isFavourite: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError("");
    startTransition(async () => {
      try {
        setRecipe(await getRandomFavourite());
      } catch {
        setError("A random recipe could not be loaded. Please try again.");
      }
    });
  }

  return (
    <div className="mt-5">
      <button
        className="rounded-full border border-emerald-800 px-5 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        {isPending ? "Finding a recipe…" : "Surprise me"}
      </button>
      {error && (
        <p aria-live="polite" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {recipe && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-white p-5">
          <div>
            <p className="text-sm text-emerald-800">Your random recipe</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-900">
              {recipe.meal.name}
            </h2>
          </div>
          <FavouriteButton
            initiallyFavourite={recipe.isFavourite}
            mealId={recipe.meal.id}
          />
        </div>
      )}
    </div>
  );
}
