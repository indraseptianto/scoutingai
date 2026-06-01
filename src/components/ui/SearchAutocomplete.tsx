"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface SearchAutocompleteProps {
  className?: string;
}

export function SearchAutocomplete({ className = "" }: SearchAutocompleteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: number; display_name: string; position?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `/api/players/search?query=${encodeURIComponent(searchQuery)}&page=1`
          );
          const data = await res.json();
          setResults((data.data || []).slice(0, 5));
        } catch {
          setResults([]);
        }
        setLoading(false);
      }, 300);
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    performSearch(value);
  };

  const handleSelect = (id: number) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/players/${id}`);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-text-dim)" }}
        />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search players, teams, leagues..."
          className="w-full rounded-full border py-2 pl-10 pr-4 text-sm outline-none"
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        />
        {loading && (
          <Loader2
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
            style={{ color: "var(--color-text-dim)" }}
          />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute top-full mt-2 left-0 right-0 rounded-xl border p-2 shadow-xl z-20"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {results.map((player) => (
              <button
                key={player.id}
                onClick={() => handleSelect(player.id)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors hover:bg-black/5"
                style={{ color: "var(--color-text)" }}
              >
                <span className="flex-1 truncate">{player.display_name}</span>
                {player.position && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {player.position}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/players?query=${encodeURIComponent(query)}`);
              }}
              className="w-full text-center text-xs font-medium py-2 mt-1 rounded-lg"
              style={{ color: "var(--color-primary-dark)" }}
            >
              View all results →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
