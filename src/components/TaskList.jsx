import React from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

export default function TaskList({
  tasks,
  totalSystemTasks,
  searchQuery,
  onToggle,
  onRequestDelete,
  onOpenAddModal,
  onResetFilters,
}) {
  // Completely empty list (no tasks in database/localStorage)
  if (totalSystemTasks === 0) {
    return (
      <EmptyState
        type="no-tasks"
        onOpenAddModal={onOpenAddModal}
      />
    );
  }

  // Filter or search returned 0 items
  if (tasks.length === 0) {
    return (
      <EmptyState
        type="no-results"
        searchQuery={searchQuery}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <div className="task-list" role="list" aria-label="Tasks list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  );
}
