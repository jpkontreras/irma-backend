import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { __ } from 'laravel-translator';
import { useEffect, useRef, useState } from 'react';

interface Suggestion {
  value: string;
  position: number;
}

interface SuggestionBoxProps {
  query: string;
  onSelect: (value: string) => void;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 0) {
        try {
          const response = await fetch(
            `/suggestions?q=${encodeURIComponent(debouncedQuery)}`,
          );
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleFocus = () => {
    setIsFocused(true);
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSelect(newValue);
    if (newValue.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full"
      />
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border bg-white shadow-md">
          <Command className="w-full">
            <CommandList className="max-h-[300px] overflow-y-auto p-2">
              {suggestions.length === 0 ? (
                <CommandEmpty>
                  {__('messages.no_suggestions_found')}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.position}
                      value={suggestion.value}
                      onSelect={() => {
                        onSelect(suggestion.value);
                        inputRef.current?.focus();
                      }}
                      className="cursor-pointer px-2 py-1.5 hover:bg-gray-100"
                    >
                      {suggestion.value}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default SuggestionBox;
