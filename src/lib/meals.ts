export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
};

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function isMeal(value: unknown): value is Meal {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const meal = value as Record<string, unknown>;
  return (
    typeof meal.idMeal === "string" &&
    /^\d{1,12}$/.test(meal.idMeal) &&
    typeof meal.strMeal === "string" &&
    typeof meal.strMealThumb === "string"
  );
}

async function fetchMeals(url: string, revalidate: number): Promise<Meal[]> {
  const response = await fetch(url, { next: { revalidate } });
  if (!response.ok) {
    throw new Error(`TheMealDB request failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null || !("meals" in data)) {
    throw new Error("TheMealDB returned an invalid response.");
  }

  const meals = (data as { meals: unknown }).meals;
  if (meals === null) {
    return [];
  }
  if (!Array.isArray(meals) || !meals.every(isMeal)) {
    throw new Error("TheMealDB returned invalid meal data.");
  }

  return meals;
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const url = `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
  return fetchMeals(url, 3600);
}

export async function getMeal(id: string): Promise<Meal | null> {
  const url = `${API_BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`;
  return (await fetchMeals(url, 3600))[0] ?? null;
}

export async function getRandomMeal(): Promise<Meal> {
  const meals = await fetchMeals(`${API_BASE_URL}/random.php`, 0);
  const meal = meals[0];
  if (!meal) {
    throw new Error("TheMealDB did not return a random meal.");
  }

  return meal;
}
