// components/NoResults.tsx
import { Clipboard } from "lucide-react";

interface NoResultsProps {
    title?: string;
    message?: string;
    onResetFilter?: () => void;
    showButton?: boolean;
    buttonText?: string;
}

export const NoResults = ({
    title = "Sin resultados",
    message = "No se encontraron elementos con el filtro seleccionado",
    onResetFilter,
    showButton = true,
    buttonText = "Ver todos"
}: NoResultsProps) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <Clipboard className="m-auto w-11 h-11" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-gray-600">{message}</p>
            {showButton && onResetFilter && (
                <button
                    onClick={onResetFilter}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};