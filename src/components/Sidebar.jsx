import React from 'react';
import { 
  CheckSquare, 
  Layers, 
  CircleDashed, 
  CheckCircle2, 
  Plus, 
  User 
} from 'lucide-react';

export default function Sidebar({ currentFilter, onSelectFilter, counts, onOpenAddModal }) {
  const navItems = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: Layers,
      count: counts.total,
    },
    {
      id: 'open',
      label: 'Open Tasks',
      icon: CircleDashed,
      count: counts.open,
    },
    {
      id: 'done',
      label: 'Completed Tasks',
      icon: CheckCircle2,
      count: counts.completed,
    },
  ];

  return (
    <aside className="desktop-sidebar" aria-label="TaskFlow Navigation">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-badge">
          <div className="brand-icon-wrapper">
            <CheckSquare size={18} strokeWidth={2.5} />
          </div>
          <span className="brand-text">TaskFlow</span>
          <span className="brand-tag">v1.0</span>
        </div>
      </div>

      {/* Primary Add Task Action */}
      <div className="sidebar-action-container">
        <button 
          type="button" 
          className="btn-sidebar-add"
          onClick={onOpenAddModal}
          id="sidebar-add-task-btn"
          aria-label="Create new task"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="sidebar-nav">
        <span className="nav-section-title">Views</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFilter(item.id)}
              aria-current={isActive ? 'page' : undefined}
              id={`nav-filter-${item.id}`}
            >
              <div className="nav-item-left">
                <Icon size={16} className="nav-icon" />
                <span>{item.label}</span>
              </div>
              <span className="nav-count-badge" aria-label={`${item.count} tasks`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Profile / Workspace Footer */}
      <div className="sidebar-footer">
        <div className="profile-card">
          <div className="profile-avatar">
            <User size={16} />
          </div>
          <div className="profile-meta">
            <span className="profile-name">Vijay Raj</span>
            <span className="profile-role">Personal Workspace</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
