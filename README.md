This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Recipe search

Visit `/search?q=pasta` to open a shareable recipe search. The page reads its
query on the server, and its search box replaces the URL after a 300 ms pause
while showing a pending indicator during navigation. The header autocomplete
uses `GET /api/search?q=...`; it requires at least two characters and caches
successful responses briefly.

The recipes in this starter are a small in-memory sample in `src/lib/recipes.ts`.
Replace that catalog and its search function with your own data source as the
app grows.

### Choosing a data access pattern

- **Route Handler** (`src/app/api/search/route.ts`): use one when clients need
  an HTTP endpoint, such as the header autocomplete, or when external consumers
  need a stable API contract. It can validate requests and set response headers.
- **Server Component**: query data directly from the server component when it
  is only needed to render that page. It avoids an unnecessary browser-to-your-
  own-API-to-data-source round trip; the search results page uses this pattern.
- **Server Action**: use for mutations initiated by the UI, such as saving a
  recipe or submitting a form. Actions provide a server-side call path for
  writes and can revalidate affected UI; they are not a replacement for a
  reusable, cacheable GET API.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
