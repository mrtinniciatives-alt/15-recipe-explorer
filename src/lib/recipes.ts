export type Recipe = {
  id: string;
  name: string;
  thumb: string;
};

export const recipes: Recipe[] = [
  {
    id: "lemon-pasta",
    name: "Creamy Lemon Pasta",
    thumb:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "avocado-toast",
    name: "Avocado Toast with Herbs",
    thumb:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "tomato-soup",
    name: "Roasted Tomato Soup",
    thumb:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chickpea-curry",
    name: "Chickpea Coconut Curry",
    thumb:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "green-salad",
    name: "Crispy Green Goddess Salad",
    thumb:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "pancakes",
    name: "Fluffy Buttermilk Pancakes",
    thumb:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=80",
  },
];

export function searchRecipes(query: string): Recipe[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (normalizedQuery.length < 2) {
    return [];
  }

  return recipes.filter((recipe) =>
    recipe.name.toLocaleLowerCase().includes(normalizedQuery),
  );
}
