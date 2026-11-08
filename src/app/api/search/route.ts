import { searchRecipes } from "@/lib/recipes";

const cacheHeaders = {
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
};

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json(
      { error: "Query must be at least 2 characters long." },
      {
        headers: { "Cache-Control": "no-store" },
        status: 400,
      },
    );
  }

  return Response.json(
    { results: searchRecipes(query) },
    { headers: cacheHeaders },
  );
}
