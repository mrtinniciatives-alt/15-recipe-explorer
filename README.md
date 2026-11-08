# Recipe Explorer

Recipe Explorer searches TheMealDB, lets you save recipes, and can suggest a
random meal. It is built with Next.js 16, React 19, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API key or environment
variables are required; recipe data comes from TheMealDB's public API.

## Features

- Search meals by name at `/search?q=pasta`; the header offers live suggestions.
- Save and remove meals with the heart button. Favourites are stored as a
  validated JSON array of up to 50 meal IDs in the `recipe-favourites` httpOnly
  cookie, so they are private to the current browser and are not shared across
  devices.
- Visit `/favourites` to load saved meal details in parallel.
- Choose **Surprise me** to look up a fresh meal through
  `https://www.themealdb.com/api/json/v1/1/random.php`. The random lookup is not
  cached.

## Data access

- `src/lib/meals.ts` validates TheMealDB responses and contains the server-side
  meal lookup helpers.
- `src/app/api/search/route.ts` supports the header autocomplete.
- `src/app/api/random/route.ts` returns an uncached random meal.
- Search results and `/favourites` fetch data directly from Server Components.
- `src/app/favourites/actions.ts` validates IDs and updates the httpOnly cookie.
  The heart button uses `useOptimistic` so its state responds immediately.

## Rendering

The app enables Next.js Cache Components and Partial Prerendering. The home
page has a static shell; `/search` and `/favourites` place request-specific
content behind Suspense boundaries. The favourites page reads a request cookie,
and search reads query parameters, so those results are rendered at request
time while their fallback shells can be prerendered. `next build` reports the
actual route markers for this Next.js version.

## Validate and build

```bash
npm run lint
npm run build
```

## Deploy to Vercel

Connect this repository to a Vercel project or use the Vercel CLI:

```bash
vercel
vercel --prod
```

No secrets or environment variables need to be configured for the public
TheMealDB API.
