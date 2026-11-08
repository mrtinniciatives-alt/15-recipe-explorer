import { getRandomMeal } from "@/lib/meals";

export async function GET() {
  const meal = await getRandomMeal();
  return Response.json(
    { meal },
    { headers: { "Cache-Control": "no-store" } },
  );
}
