export const FAVOURITES_COOKIE = "recipe-favourites";
export const MAX_FAVOURITES = 50;

export function isMealId(value: unknown): value is string {
  return typeof value === "string" && /^\d{1,12}$/.test(value);
}

export function parseFavouriteIds(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return [...new Set(parsed.filter(isMealId))].slice(0, MAX_FAVOURITES);
  } catch {
    return [];
  }
}
