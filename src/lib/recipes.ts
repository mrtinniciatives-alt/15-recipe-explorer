export type Recipe = {
  id: string;
  name: string;
  thumb: string;
};

const mealIdPattern = /^[1-9]\d{0,19}$/;

export function isMealId(value: unknown): value is string {
  return typeof value === "string" && mealIdPattern.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRecipe(value: unknown): Recipe {
  if (
    !isRecord(value) ||
    !isMealId(value.idMeal) ||
    typeof value.strMeal !== "string" ||
    typeof value.strMealThumb !== "string" ||
    !value.strMealThumb.startsWith("https://")
  ) {
    throw new Error("The recipe service returned an invalid meal.");
  }

  return {
    id: value.idMeal,
    name: value.strMeal,
    thumb: value.strMealThumb,
  };
}

async function fetchMeals(url: string, revalidate: number): Promise<Recipe[]> {
  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(`The recipe service returned status ${response.status}.`);
  }

  const data: unknown = await response.json();
  if (!isRecord(data) || !(data.meals === null || Array.isArray(data.meals))) {
    throw new Error("The recipe service returned an invalid response.");
  }

  return data.meals === null ? [] : data.meals.map(parseRecipe);
}

export async function searchMeals(query: string): Promise<Recipe[]> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) {
    return [];
  }

  return fetchMeals(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(normalizedQuery)}`,
    3600,
  );
}

export async function getMealById(id: string): Promise<Recipe | null> {
  if (!isMealId(id)) {
    throw new Error("A valid meal ID is required.");
  }

  const meals = await fetchMeals(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`,
    3600,
  );
  return meals[0] ?? null;
}

export async function getRandomMeal(): Promise<Recipe> {
  const meals = await fetchMeals(
    "https://www.themealdb.com/api/json/v1/1/random.php",
    0,
  );
  const meal = meals[0];

  if (!meal) {
    throw new Error("The recipe service did not return a random meal.");
  }

  return meal;
}
