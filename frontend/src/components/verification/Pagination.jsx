import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, setPagination }) => {
  const { page, pages } = pagination;

  if (pages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() =>
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
        }
        disabled={page === 1}
        className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: Math.min(5, pages) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: pageNum }))
            }
            className={`w-10 h-10 rounded-lg transition-colors ${
              page === pageNum
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-50"
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={page === pageNum ? "page" : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {pages > 5 && page < pages - 2 && (
        <>
          <span className="px-2 text-gray-500">...</span>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: pages,
              }))
            }
            className={`w-10 h-10 rounded-lg transition-colors ${
              page === pages
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-50"
            }`}
            aria-label={`Page ${pages}`}
          >
            {pages}
          </button>
        </>
      )}

      <button
        onClick={() =>
          setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
        }
        disabled={page === pages}
        className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
