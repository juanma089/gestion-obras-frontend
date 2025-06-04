import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface GenericSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  placeholder?: string;
  className?: string;
  onSearchResults: (results: T[]) => void;
  debounceTime?: number;
}

export function GenericSearch<T>({
  data,
  searchFields,
  placeholder = "Buscar...",
  className = "",
  onSearchResults,
  debounceTime = 300,
}: GenericSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        onSearchResults(data);
        return;
      }

      const results = data.filter((item) =>
        searchFields.some((field) => {
          const fieldValue = item[field];
          if (
            typeof fieldValue === "string" ||
            typeof fieldValue === "number"
          ) {
            return String(fieldValue)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
          return false;
        })
      );

      onSearchResults(results);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, data, searchFields, debounceTime, onSearchResults]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}