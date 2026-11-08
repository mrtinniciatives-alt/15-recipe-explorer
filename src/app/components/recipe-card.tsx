import Image from "next/image";

import type { Recipe } from "@/lib/recipes";
import FavouriteButton from "./favourite-button";

type RecipeCardProps = {
  recipe: Recipe;
  isFavourite: boolean;
};

export default function RecipeCard({
  recipe,
  isFavourite,
}: RecipeCardProps) {
  return (
    <li className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <Image
        alt={recipe.name}
        className="h-52 w-full object-cover"
        height={600}
        src={recipe.thumb}
        unoptimized
        width={900}
      />
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h3 className="font-semibold text-zinc-900">{recipe.name}</h3>
        <FavouriteButton
          initiallyFavourite={isFavourite}
          mealId={recipe.id}
        />
      </div>
    </li>
  );
}
