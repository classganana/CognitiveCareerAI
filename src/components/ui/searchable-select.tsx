"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchableSelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  options: SearchableSelectOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
};

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search...",
  emptyLabel = "No options found",
  disabled = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setQuery("");
    setIsOpen(false);
  }

  function handleClear() {
    onChange(undefined);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div className="relative space-y-2">
      <div className="flex gap-2">
        <Input
          value={isOpen ? query : selectedOption?.label ?? ""}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {value ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear selection"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      {isOpen && !disabled ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Close options"
            onClick={() => setIsOpen(false)}
          />
          <ul
            className={cn(
              "absolute z-50 max-h-48 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md",
            )}
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">{emptyLabel}</li>
            ) : (
              filteredOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent",
                      option.value === value && "bg-accent",
                    )}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      ) : null}
    </div>
  );
}
