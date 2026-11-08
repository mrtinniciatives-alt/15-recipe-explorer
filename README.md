# Recipe Explorer

Recipe Explorer searches TheMealDB and lets you save up to 50 meals in a
private, browser-stored favourites list.

## Run locally

Use Node.js 20 or later, then install dependencies and start the development
server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app uses the public
TheMealDB API and does not require an API key.

## Features

- Search meals by name at `/search?q=chicken`. Search results and header
  suggestions come from TheMealDB.
- Save or remove a meal with its heart button. A Server Action validates the
  meal ID and updates the `recipe-favourites` httpOnly cookie. The cookie
  contains a JSON array, is limited to 50 unique numeric meal IDs, and is
  unavailable to browser JavaScript.
- Visit `/favourites` to load saved meals. The Server Component reads the
  cookie and looks up meals concurrently.
- Choose **Surprise me** to fetch a random meal from TheMealDB's `random.php`.
  This lookup uses `revalidate: 0` and is not cached.

## Rendering and caching

The production build labels fully static routes with `○`, partially
prerendered routes with `◐`, and request-time routes with `ƒ`.

- `○ /` and `○ /_not-found` are fully prerendered. The homepage's featured
  meals use a one-hour data cache.
- `◐ /search` and `◐ /favourites` have prerendered shells. Search parameters
  and the httpOnly favourites cookie are read in components behind Suspense,
  so that request-specific content streams on demand.
- `ƒ /api/search` is a parameterized route handler. Successful responses have
  short browser/CDN cache headers and MealDB search data is cached for one hour.
- `ƒ /api/random` reads the request cookie and sends `Cache-Control: no-store`;
  its upstream MealDB request uses `revalidate: 0`.

These classifications were verified from `npm run build`. The `◐` routes are
not fully static, even though their shells are prerendered.

## Checks

```bash
npm run lint
npm run build
```

## Deploy to Vercel

With the Vercel CLI installed and authenticated, deploy the production build:

```bash
vercel --prod
```

Alternatively, import the repository at [vercel.com/new](https://vercel.com/new).
Vercel detects the Next.js framework and uses the default build settings.
