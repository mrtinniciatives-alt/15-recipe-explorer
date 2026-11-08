"use client";

import { useOptimistic, useState, useTransition } from "react";

import { toggleFavourite } from "@/app/favourites/actions";

type FavouriteButtonProps = {
  mealId: string;
  initialFavourite: boolean;
};

export default function FavouriteButton({
  mealId,
  initialFavourite,
}: FavouriteButtonProps) {
  const [favourite, setFavourite] = useState(initialFavourite);
  const [optimisticFavourite, setOptimisticFavourite] = useOptimistic(
    favourite,
    (_current, next: boolean) => next,
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const nextFavourite = !optimisticFavourite;
    setError("");

    startTransition(async () => {
      setOptimisticFavourite(nextFavourite);
      try {
        setFavourite(await toggleFavourite(mealId));
      } catch {
        setError("Could not update favourites. Please try again.");
      }
    });
  }

  return (
    <div>
      <button
        aria-label={
          optimisticFavourite ? "Remove from favourites" : "Add to favourites"
        }
        aria-pressed={optimisticFavourite}
        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          optimisticFavourite
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            : "border-zinc-300 bg-white text-zinc-700 hover:border-rose-200 hover:text-rose-700"
        }`}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        <span aria-hidden="true">{optimisticFavourite ? "♥" : "♡"}</span>
        {optimisticFavourite ? "Saved" : "Save"}
      </button>
      {error && (
        <p aria-live="polite" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
