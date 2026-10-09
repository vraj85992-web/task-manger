import React from 'react';
import { ClipboardList, SearchX, Plus } from 'lucide-react';

export default function EmptyState({ 
  type = 'no-tasks', // 'no-tasks' | 'no-results'
  searchQuery = '', 
  onOpenAddModal, 
  onResetFilters 
}) {
  if (type === 'no-results') {
    return (
      <div className="empty-state" role="status">
        <div className="empty-state-icon">
          <SearchX size={28} />
        </div>
        <h3 className="empty-state-title">No matching tasks found</h3>
        <p className="empty-state-desc">
          {searchQuery ? (
            <>No tasks matched "<strong>{searchQuery}</strong>". Try a different search term or clear the current filters.</>
          ) : (
            <>No tasks found for the selected view. Try switching filters or adding a new task.</>
          )}
        </p>
        <button
          type="button"
          className="btn-outline-clear"
          onClick={onResetFilters}
          id="empty-state-reset-btn"
        >
          Clear filters & search
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon">
        <ClipboardList size={28} />
      </div>
      <h3 className="empty-state-title">No tasks yet</h3>
      <p className="empty-state-desc">
        Your task list is clean and clear. Add your first task to plan your day and keep track of your goals.
      </p>
      <button
        type="button"
        className="empty-state-action"
        onClick={onOpenAddModal}
        id="empty-state-add-btn"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>Add your first task</span>
      </button>
    </div>
  );
}
