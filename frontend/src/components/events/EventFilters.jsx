// components/events/EventFilters.jsx
import React from "react";

const EventFilters = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: "all", label: "Tous" },
    { value: "upcoming", label: "À venir" },
    { value: "featured", label: "Mis en avant" },
    { value: "past", label: "Passés" },
  ];

  return (
    <div className="mb-8 flex flex-wrap gap-3 justify-center">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            currentFilter === filter.value
              ? "bg-emerald-600 text-white shadow-lg scale-105"
              : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default EventFilters;
