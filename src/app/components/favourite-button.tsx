"use client";

import { useOptimistic, useState, useTransition } from "react";

import { toggleFavourite } from "@/app/actions/favourites";

type FavouriteButtonProps = {
  mealId: string;
  initiallyFavourite: boolean;
};

export default function FavouriteButton({
  mealId,
  initiallyFavourite,
}: FavouriteButtonProps) {
  const [isFavourite, setOptimisticFavourite] = useOptimistic(initiallyFavourite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    startTransition(async () => {
      setOptimisticFavourite(!isFavourite);
      const result = await toggleFavourite(mealId);
      if (!result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <div>
      <button
        aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        aria-pressed={isFavourite}
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
          isFavourite
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            : "border-zinc-300 bg-white text-zinc-700 hover:border-rose-200 hover:text-rose-700"
        }`}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ♥
        </span>
        {isFavourite ? "Saved" : "Save"}
      </button>
      {error && (
        <p aria-live="polite" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
