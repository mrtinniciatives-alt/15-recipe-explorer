"use client";

import { useOptimistic, useState, useTransition } from "react";

import { toggleFavourite } from "../favourites/actions";

type FavouriteButtonProps = {
  mealId: string;
  initialIsFavourite: boolean;
};

export default function FavouriteButton({
  mealId,
  initialIsFavourite,
}: FavouriteButtonProps) {
  const [isFavourite, setIsFavourite] = useOptimistic(initialIsFavourite);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    const nextIsFavourite = !isFavourite;
    setError("");

    startTransition(async () => {
      setIsFavourite(nextIsFavourite);
      try {
        await toggleFavourite(mealId);
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Could not update favourites.",
        );
      }
    });
  }

  return (
    <div>
      <button
        aria-label={
          isFavourite ? "Remove from favourites" : "Add to favourites"
        }
        aria-pressed={isFavourite}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
          isFavourite
            ? "border-rose-200 bg-rose-50 text-rose-600"
            : "border-zinc-200 bg-white text-zinc-500 hover:border-rose-200 hover:text-rose-600"
        }`}
        disabled={isPending}
        onClick={handleClick}
        type="button"
      >
        <span aria-hidden="true" className="text-xl leading-none">
          {isFavourite ? "♥" : "♡"}
        </span>
      </button>
      {error && (
        <p aria-live="polite" className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
