"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { Input } from "../input";

import { Search } from "lucide-react";

export function SearchUsers() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchSearchData = async () => {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: deferredSearch }),
      });
      const data = await res.json();
      setResults(data);
    };

    const debouncedFetchSearchData = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchSearchData, 500); // Adjust the debounce delay as needed
    };

    if (deferredSearch.length > 3) {
      debouncedFetchSearchData();
    }
  }, [deferredSearch]);

  return (
    <div className="relative">
      <label className="relative">
        <Search className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
        <Input
          type="search"
          placeholder="Buscar"
          onChange={(e) => setSearch(e.target.value)}
          className="ring-2 ring-offset-2 pl-9 bg-neutral-300  dark:bg-neutral-800 dark:ring-offset-neutral-900 focus:ring-blue-800"
          onFocus={() => setOpen((prev) => !prev)}
          onBlur={() => setOpen(false)}
        />
      </label>
      {open ? (
        <div className="w-full absolute border -bottom-[6.5rem] backdrop-blur-md rounded-lg border-neutral-700 animate-in fade-in max-h-60 bg-neutral-900  overflow-y-auto">
          <h1>Results for {deferredSearch}</h1>
          <h1>Rwth {search}</h1>
          {search !== deferredSearch && 'please wait'}
          <ul>
            {results.length === 0 ? (
              <div className="flex items-center justify-center">
                <h1>No results</h1>
              </div>
            ):(
              <div>{JSON.stringify(results)}</div>
            )}
          </ul>
        </div>
      ) : null}
     
    </div>
  );
}
