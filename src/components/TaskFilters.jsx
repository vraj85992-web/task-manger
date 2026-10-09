import React from 'react';

export default function TaskFilters({ filter, onSelectFilter }) {
  const options = [
    { id: 'all', label: 'All' },
    { id: 'open', label: 'Open' },
    { id: 'done', label: 'Done' },
  ];

  return (
    <div className="filter-tabs" role="tablist" aria-label="Task Status Filters">
      {options.map((opt) => {
        const isActive = filter === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectFilter(opt.id)}
            id={`filter-tab-${opt.id}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
