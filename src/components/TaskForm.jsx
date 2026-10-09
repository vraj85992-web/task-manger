import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function TaskForm({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleClose = () => {
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setError('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError('Task title is required.');
      inputRef.current?.focus();
      return;
    }

    try {
      onAddTask({
        title: trimmed,
        priority,
        due_date: dueDate || null,
      });
    } catch (err) {
      console.error('Failed to add task:', err);
    } finally {
      handleClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-task-title"
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-add-task-title" className="modal-title">New Task</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close dialog"
            id="modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title field */}
            <div className="form-group">
              <label htmlFor="task-title-input" className="form-label">
                Task Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="task-title-input"
                ref={inputRef}
                type="text"
                className={`form-input ${error ? 'error' : ''}`}
                placeholder="e.g., Prepare quarterly roadmap presentation"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
              />
              {error && (
                <span className="form-error-msg" role="alert">
                  {error}
                </span>
              )}
            </div>

            {/* Priority field */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="priority-selector" role="radiogroup" aria-label="Task Priority">
                {['low', 'medium', 'high'].map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`priority-option-btn ${isSelected ? `selected-${p}` : ''}`}
                      onClick={() => setPriority(p)}
                      id={`priority-btn-${p}`}
                    >
                      <span className={`priority-dot`} style={{
                        backgroundColor: p === 'high' ? 'var(--priority-high-dot)' : p === 'medium' ? 'var(--priority-medium-dot)' : 'var(--priority-low-dot)'
                      }} />
                      <span style={{ textTransform: 'capitalize' }}>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date field */}
            <div className="form-group">
              <label htmlFor="task-due-date-input" className="form-label">
                Due Date <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="task-due-date-input"
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              id="cancel-add-task-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              id="submit-add-task-btn"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
