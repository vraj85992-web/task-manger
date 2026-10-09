import React, { useState } from 'react';
import { 
  CheckSquare, 
  Menu, 
  X, 
  Plus, 
  Layers, 
  CircleDashed, 
  CheckCircle2, 
  User 
} from 'lucide-react';

export default function MobileHeader({ currentFilter, onSelectFilter, counts, onOpenAddModal }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: Layers, count: counts.total },
    { id: 'open', label: 'Open Tasks', icon: CircleDashed, count: counts.open },
    { id: 'done', label: 'Completed Tasks', icon: CheckCircle2, count: counts.completed },
  ];

  const handleSelectFilter = (filterId) => {
    onSelectFilter(filterId);
    setDrawerOpen(false);
  };

  return (
    <>
      <header className="mobile-header" aria-label="Mobile Navigation Bar">
        <button
          type="button"
          className="btn-task-action"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          id="mobile-menu-trigger"
        >
          <Menu size={22} />
        </button>

        <div className="brand-badge">
          <div className="brand-icon-wrapper" style={{ width: 28, height: 28 }}>
            <CheckSquare size={16} strokeWidth={2.5} />
          </div>
          <span className="brand-text" style={{ fontSize: '1rem' }}>TaskFlow</span>
        </div>

        <button
          type="button"
          className="btn-primary-add"
          onClick={onOpenAddModal}
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.8125rem' }}
          aria-label="Add task"
          id="mobile-add-task-btn"
        >
          <Plus size={16} />
          <span>New</span>
        </button>
      </header>

      {/* Backdrop */}
      <div 
        className={`mobile-drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} aria-label="Mobile navigation drawer">
        <div className="drawer-header">
          <div className="brand-badge">
            <div className="brand-icon-wrapper">
              <CheckSquare size={18} strokeWidth={2.5} />
            </div>
            <span className="brand-text">TaskFlow</span>
          </div>
          <button 
            type="button" 
            className="btn-task-action" 
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1rem' }}>
          <button
            type="button"
            className="btn-sidebar-add"
            onClick={() => {
              setDrawerOpen(false);
              onOpenAddModal();
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Task</span>
          </button>
        </div>

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
                onClick={() => handleSelectFilter(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="nav-item-left">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                <span className="nav-count-badge">{item.count}</span>
              </button>
            );
          })}
        </nav>

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
    </>
  );
}
