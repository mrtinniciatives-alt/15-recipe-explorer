import { cookies } from "next/headers";

import {
  FAVOURITES_COOKIE,
  parseFavouriteIds,
} from "@/lib/favourites";
import { getRandomMeal } from "@/lib/meals";

export async function GET() {
  const [meal, cookieStore] = await Promise.all([
    getRandomMeal(),
    cookies(),
  ]);
  const favouriteIds = parseFavouriteIds(
    cookieStore.get(FAVOURITES_COOKIE)?.value,
  );

  return Response.json(
    {
      isFavourite: favouriteIds.includes(meal.idMeal),
      meal,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
