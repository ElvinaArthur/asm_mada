import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/library?search=${encodeURIComponent(query)}`);
      setQuery("");
      if (onClose) onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des livres, auteurs..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:border-asm-green-500 focus:ring-2 focus:ring-asm-green-200 focus:outline-none"
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button type="submit" className="sr-only">
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;
