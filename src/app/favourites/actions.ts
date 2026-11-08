"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  FAVOURITES_COOKIE,
  isMealId,
  MAX_FAVOURITES,
  parseFavouriteIds,
} from "@/lib/favourites";

export async function toggleFavourite(mealId: string): Promise<boolean> {
  if (!isMealId(mealId)) {
    throw new Error("Invalid meal ID.");
  }

  const cookieStore = await cookies();
  const favouriteIds = parseFavouriteIds(
    cookieStore.get(FAVOURITES_COOKIE)?.value,
  );
  const isFavourite = favouriteIds.includes(mealId);
  const nextIds = isFavourite
    ? favouriteIds.filter((id) => id !== mealId)
    : [...favouriteIds.filter((id) => id !== mealId), mealId].slice(
        -MAX_FAVOURITES,
      );

  cookieStore.set(FAVOURITES_COOKIE, JSON.stringify(nextIds), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/favourites");

  return !isFavourite;
}
