import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

interface GenericPaginationProps<T> {
  items: T[];
  pageSize?: number;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  currentPage: number; // 🔄 Recibe la página actual desde fuera
  onPageChange: (page: number) => void; // 🔄 Callback para actualizar la página
}

export const GenericPagination = <T,>({
  items,
  pageSize = 4,
  renderItem,
  className = "",
  currentPage, // 🔄 Página controlada desde el padre
  onPageChange, // 🔄 Callback para cambiar la página
}: GenericPaginationProps<T>) => {
  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1); // 🔄 Usa el callback
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1); // 🔄 Usa el callback
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentItems.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className={`px-4 py-2 flex gap-3 items-center rounded-md font-medium border transition ${
              currentPage > 0
                ? "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            <CircleArrowLeft />
          </button>

          <span className="px-4 py-2">
            Página {currentPage + 1} de {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className={`px-4 py-2 flex gap-3 items-center rounded-md font-medium border transition ${
              currentPage < totalPages - 1
                ? "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            <CircleArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};