// components/GenericFilter.tsx
interface GenericFilterProps<T extends string> {
    currentFilter: T;
    filters: { value: T; label: string; color: string }[];
    onFilterChange: (filter: T) => void;
}

export function GenericFilter<T extends string>({
    currentFilter,
    filters,
    onFilterChange
}: GenericFilterProps<T>) {
    return (
        <>
            {/* Select para móvil */}
            <select
                onChange={(e) => onFilterChange(e.target.value as T)}
                value={currentFilter}
                className="md:hidden w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white text-gray-800"
            >
                {filters.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Botones para desktop */}
            {filters.map(option => (
                <button
                    key={option.value}
                    onClick={() => onFilterChange(option.value)}
                    className={`hidden md:inline-block px-4 py-2 rounded-lg transition-all ${currentFilter === option.value
                        ? `${option.color} text-white`
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </>
    );
}