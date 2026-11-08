"use server";

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
  const ids = parseFavouriteIds(cookieStore.get(FAVOURITES_COOKIE)?.value);
  const isFavourite = ids.includes(mealId);
  const nextIds = isFavourite
    ? ids.filter((id) => id !== mealId)
    : [...ids.slice(-(MAX_FAVOURITES - 1)), mealId];

  cookieStore.set(FAVOURITES_COOKIE, JSON.stringify(nextIds), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return !isFavourite;
}
