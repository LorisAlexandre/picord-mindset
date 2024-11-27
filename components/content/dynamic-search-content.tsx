"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Button,
  Badge,
} from "@/components/shadcn/ui";
import { Search, Loader2 } from "lucide-react";
import { debounce } from "@/lib/functions";
import { Content } from "@prisma/client";

export function DynamicSearchContent({
  handleResultClick,
}: {
  handleResultClick?: (result: Content) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchContent = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/content/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error("Search request failed");
        }
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Search error:", error);
        // You might want to show an error message to the user here
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchContent(query);
  }, [query, searchContent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const defaultHandleResultClick = (result: Content) => {
    if (handleResultClick === undefined) {
      setIsOpen(false);
      setQuery("");
      return;
    } else {
      handleResultClick(result);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Cherche un contenu...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cherche un contenu</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Recherche..."
            value={query}
            onChange={handleInputChange}
            className="pl-8"
          />
          {isLoading && (
            <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <div className="mt-4 space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="cursor-pointer p-2 hover:bg-accent rounded-md flex items-center"
              onClick={() => defaultHandleResultClick(result)}
            >
              <div className="flex flex-col max-w-full gap-px">
                <h3 className="font-semibold">{result.properties.title}</h3>
                {/* <p className="text-sm text-muted-foreground">
                {result.properties.description}
                </p>  */}
                <p className="text-sm text-muted-foreground truncate">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Aspernatur, distinctio.
                </p>
                <ul className="flex gap-1">
                  {["sport", "cardio", "flexibilité"].map((tag, tagIndex) => (
                    <li key={`${result.id}-tags-${tag}-${tagIndex}`}>
                      <Badge className="rounded-full">{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {query.length > 1 && results.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground">
              Aucun résultat trouvé
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
