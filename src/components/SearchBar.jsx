import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-wrapper" role="search">
      <Search size={16} className="search-icon" aria-hidden="true" />
      <input
        type="text"
        className="search-input"
        placeholder="Search tasks by title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks by title"
        id="task-search-input"
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={onClear}
          aria-label="Clear search input"
          id="clear-search-btn"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
