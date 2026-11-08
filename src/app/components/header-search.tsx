"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import type { Meal } from "@/lib/meals";

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Meal[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setError("");
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`);
        }

        const data: { results: Meal[] } = await response.json();
        setResults(data.results);
        setActiveIndex(-1);
        setIsOpen(true);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === "AbortError") {
          return;
        }
        setError("Suggestions are temporarily unavailable.");
      }
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function navigateToSearch(searchQuery = query) {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      return;
    }
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      navigateToSearch(
        activeIndex >= 0 ? results[activeIndex].strMeal : query,
      );
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <form
      className="relative w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        navigateToSearch(
          activeIndex >= 0 ? results[activeIndex].strMeal : query,
        );
      }}
    >
      <label className="sr-only" htmlFor="header-recipe-search">
        Search recipes
      </label>
      <input
        aria-activedescendant={
          activeIndex >= 0
            ? `recipe-suggestion-${results[activeIndex].idMeal}`
            : undefined
        }
        aria-autocomplete="list"
        aria-controls="recipe-suggestions"
        aria-expanded={isOpen && results.length > 0}
        autoComplete="off"
        className="h-11 w-full rounded-full border border-zinc-300 bg-zinc-50 py-2 pl-4 pr-11 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
        id="header-recipe-search"
        onBlur={(event) => {
          if (!event.currentTarget.form?.contains(event.relatedTarget as Node)) {
            setIsOpen(false);
          }
        }}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          if (nextQuery.trim().length < 2) {
            setResults([]);
            setActiveIndex(-1);
            setError("");
          }
          setIsOpen(true);
        }}
        onFocus={() => {
          if (results.length > 0) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search recipes"
        ref={inputRef}
        role="combobox"
        value={query}
      />
      <button
        aria-label="Search"
        className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-emerald-50 hover:text-emerald-800"
        type="submit"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="18"
          viewBox="0 0 24 24"
          width="18"
        >
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </button>
      {isOpen && (results.length > 0 || error) && (
        <ul
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white py-2 shadow-xl"
          id="recipe-suggestions"
          role="listbox"
        >
          {error ? (
            <li className="px-4 py-3 text-sm text-red-700">{error}</li>
          ) : (
            results.map((meal, index) => (
                <li
                  key={meal.idMeal}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <button
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-800 ${
                        index === activeIndex
                          ? "bg-emerald-50"
                          : "hover:bg-zinc-50"
                      }`}
                      id={`recipe-suggestion-${meal.idMeal}`}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => navigateToSearch(meal.strMeal)}
                      type="button"
                    >
                      <Image
                        alt=""
                        className="h-10 w-12 rounded-lg object-cover"
                        height={80}
                        src={meal.strMealThumb}
                        unoptimized
                        width={96}
                      />
                      <span>{meal.strMeal}</span>
                    </button>
                </li>
            ))
          )}
        </ul>
      )}
    </form>
  );
}
