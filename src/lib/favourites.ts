export const FAVOURITES_COOKIE = "recipe-favourites";
export const MAX_FAVOURITES = 50;

const mealIdPattern = /^[1-9]\d{0,19}$/;

export function parseFavouriteIds(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  const ids = parsed.filter(
    (id): id is string =>
      typeof id === "string" && mealIdPattern.test(id),
  );
  return [...new Set(ids)].slice(0, MAX_FAVOURITES);
}
