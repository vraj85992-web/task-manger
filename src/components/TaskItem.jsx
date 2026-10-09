import React from 'react';
import { 
  Check, 
  Trash2, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';

/**
 * Format a YYYY-MM-DD date into friendly readable text and detect overdue status
 */
function getDueStatus(dateStr, isCompleted) {
  if (!dateStr || typeof dateStr !== 'string') return null;

  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [year, month, day] = parts.map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    const targetDate = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const isOverdue = !isCompleted && diffDays < 0;
    
    let label = '';
    if (diffDays === 0) {
      label = 'Today';
    } else if (diffDays === 1) {
      label = 'Tomorrow';
    } else if (diffDays === -1) {
      label = 'Yesterday';
    } else {
      label = targetDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: targetDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }

    return {
      label,
      isOverdue,
      isToday: diffDays === 0,
    };
  } catch {
    return null;
  }
}

export default function TaskItem({ task, onToggle, onRequestDelete }) {
  const { id, title, is_completed, priority = 'medium', due_date } = task;
  const dueStatus = getDueStatus(due_date, is_completed);

  return (
    <article 
      className={`task-item ${is_completed ? 'completed' : ''}`}
      id={`task-item-${id}`}
    >
      <div className="task-item-left">
        {/* Checkbox Button */}
        <button
          type="button"
          role="checkbox"
          aria-checked={is_completed}
          className={`task-checkbox-btn ${is_completed ? 'checked' : ''}`}
          onClick={() => onToggle(id)}
          aria-label={is_completed ? `Mark "${title}" as open` : `Mark "${title}" as done`}
          id={`task-check-${id}`}
        >
          {is_completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Task Details */}
        <div className="task-content-details">
          <span className="task-title">{title}</span>

          <div className="task-meta-row">
            {/* Priority Indicator */}
            <span className={`priority-badge ${priority.toLowerCase()}`}>
              <span className="priority-dot" aria-hidden="true" />
              <span>{priority}</span>
            </span>

            {/* Due Date Indicator */}
            {dueStatus && (
              <span 
                className={`due-date-badge ${dueStatus.isOverdue ? 'overdue' : ''} ${dueStatus.isToday ? 'today' : ''}`}
                title={dueStatus.isOverdue ? 'Task is overdue' : `Due ${dueStatus.label}`}
              >
                {dueStatus.isOverdue ? (
                  <AlertCircle size={12} strokeWidth={2.5} />
                ) : (
                  <Calendar size={12} strokeWidth={2} />
                )}
                <span>
                  {dueStatus.isOverdue ? `Overdue (${dueStatus.label})` : dueStatus.label}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Task Actions */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-task-action"
          onClick={() => onRequestDelete(task)}
          aria-label={`Delete task: ${title}`}
          title="Delete task"
          id={`task-delete-${id}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
