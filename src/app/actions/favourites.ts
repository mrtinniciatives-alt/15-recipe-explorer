"use server";

import { cookies } from "next/headers";

import { FAVOURITES_COOKIE, MAX_FAVOURITES, parseFavouriteIds } from "@/lib/favourites";
import { getRandomMeal, isMealId } from "@/lib/recipes";

export type ToggleFavouriteResult =
  | { success: true; isFavourite: boolean }
  | { success: false; isFavourite: boolean; message: string };

export async function toggleFavourite(
  mealId: string,
): Promise<ToggleFavouriteResult> {
  if (!isMealId(mealId)) {
    return {
      success: false,
      isFavourite: false,
      message: "That meal ID is invalid.",
    };
  }

  const cookieStore = await cookies();
  const ids = parseFavouriteIds(cookieStore.get(FAVOURITES_COOKIE)?.value);
  const isFavourite = ids.includes(mealId);

  if (isFavourite) {
    const updatedIds = ids.filter((id) => id !== mealId);
    cookieStore.set(FAVOURITES_COOKIE, JSON.stringify(updatedIds), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return { success: true, isFavourite: false };
  }

  if (ids.length >= MAX_FAVOURITES) {
    return {
      success: false,
      isFavourite: false,
      message: `You can save up to ${MAX_FAVOURITES} meals.`,
    };
  }

  cookieStore.set(FAVOURITES_COOKIE, JSON.stringify([...ids, mealId]), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return { success: true, isFavourite: true };
}

export async function getRandomFavourite(): Promise<{
  meal: Awaited<ReturnType<typeof getRandomMeal>>;
  isFavourite: boolean;
}> {
  const [meal, cookieStore] = await Promise.all([getRandomMeal(), cookies()]);
  const ids = parseFavouriteIds(cookieStore.get(FAVOURITES_COOKIE)?.value);

  return { meal, isFavourite: ids.includes(meal.id) };
}
