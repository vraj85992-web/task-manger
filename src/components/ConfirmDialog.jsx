import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, task, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !task) return null;

  return (
    <div 
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
    >
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-subtle)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={18} />
            </div>
            <h2 id="confirm-delete-title" className="modal-title" style={{ fontSize: '1.0625rem' }}>
              Delete Task
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
          <p id="confirm-delete-desc" style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Are you sure you want to permanently delete <strong style={{ color: 'var(--text-primary)' }}>"{task.title}"</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            id="cancel-delete-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            id="confirm-delete-btn"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
