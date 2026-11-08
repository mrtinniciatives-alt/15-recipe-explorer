"use client";

import Image from "next/image";
import { useState } from "react";

import FavouriteButton from "./favourite-button";
import type { Meal } from "@/lib/meals";

export default function RandomRecipeButton() {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function getRandomRecipe() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/random", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Random recipe request failed with status ${response.status}`);
      }

      const data: { meal: Meal } = await response.json();
      setMeal(data.meal);
    } catch {
      setError("A random recipe could not be loaded. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        className="inline-flex rounded-full border border-emerald-200 px-5 py-3 font-semibold text-emerald-50 transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-70"
        disabled={isLoading}
        onClick={getRandomRecipe}
        type="button"
      >
        {isLoading ? "Finding a recipe…" : "Surprise me"}
      </button>
      {error && (
        <p aria-live="polite" className="mt-3 text-sm text-rose-200">
          {error}
        </p>
      )}
      {meal && (
        <article className="mt-6 max-w-sm overflow-hidden rounded-2xl bg-white text-zinc-900 shadow-lg">
          <Image
            alt={meal.strMeal}
            className="h-48 w-full object-cover"
            height={600}
            src={meal.strMealThumb}
            unoptimized
            width={900}
          />
          <div className="space-y-3 p-5">
            <h2 className="text-lg font-semibold">{meal.strMeal}</h2>
            <FavouriteButton initialFavourite={false} mealId={meal.idMeal} />
          </div>
        </article>
      )}
    </div>
  );
}
