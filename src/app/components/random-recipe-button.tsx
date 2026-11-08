"use client";

import Image from "next/image";
import { useState } from "react";

import FavouriteButton from "./favourite-button";
import type { Meal } from "@/lib/meals";

type RandomMealResult = {
  meal: Meal;
  isFavourite: boolean;
};

function isRandomMealResult(value: unknown): value is RandomMealResult {
  if (typeof value !== "object" || value === null || !("meal" in value)) {
    return false;
  }

  const result = value as { meal: unknown; isFavourite?: unknown };
  const meal = result.meal;
  return (
    typeof result.isFavourite === "boolean" &&
    typeof meal === "object" &&
    meal !== null &&
    "idMeal" in meal &&
    typeof meal.idMeal === "string" &&
    "strMeal" in meal &&
    typeof meal.strMeal === "string" &&
    "strMealThumb" in meal &&
    typeof meal.strMealThumb === "string"
  );
}

export default function RandomRecipeButton() {
  const [result, setResult] = useState<RandomMealResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function findRandomMeal() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/random", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Random recipe request failed (${response.status}).`);
      }
      const data: unknown = await response.json();
      if (!isRandomMealResult(data)) {
        throw new Error("The random recipe response was invalid.");
      }
      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load a random recipe.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <button
        className="rounded-full border border-emerald-800 px-5 py-3 font-semibold text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"
        disabled={isLoading}
        onClick={findRandomMeal}
        type="button"
      >
        {isLoading ? "Finding a recipe…" : "Surprise me"}
      </button>
      {error && (
        <p aria-live="polite" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {result && (
        <article className="mt-6 flex max-w-xl items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <Image
            alt=""
            className="h-20 w-24 rounded-xl object-cover"
            height={160}
            src={result.meal.strMealThumb}
            unoptimized
            width={192}
          />
          <h2 className="flex-1 font-semibold text-zinc-900">
            {result.meal.strMeal}
          </h2>
          <FavouriteButton
            initialIsFavourite={result.isFavourite}
            mealId={result.meal.idMeal}
          />
        </article>
      )}
    </div>
  );
}
