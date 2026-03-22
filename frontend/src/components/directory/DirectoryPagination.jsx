// components/directory/DirectoryPagination.jsx
import React from "react";

const DirectoryPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
        pages.push(i);
      } else if (Math.abs(i - currentPage) === 3) {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="mt-12 flex justify-center">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Précédent
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-3 py-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg ${
                page === currentPage
                  ? "bg-asm-green-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant →
        </button>
      </nav>
    </div>
  );
};

export default DirectoryPagination;
