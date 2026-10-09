import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import TaskSummary from './components/TaskSummary';
import SearchBar from './components/SearchBar';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ConfirmDialog from './components/ConfirmDialog';

export default function App() {
  const {
    tasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    clearSearch,
    filteredTasks,
    counts,
    addTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Keyboard shortcut: Press 'c' or 'n' to open add task modal (when not focused on input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }
      if ((e.key === 'n' || e.key === 'c') && !e.metaKey && !e.ctrlKey && !isAddModalOpen && !taskToDelete) {
        e.preventDefault();
        setIsAddModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, taskToDelete]);

  // Dynamic header titles based on active view
  const headerDetails = {
    all: {
      title: 'All Tasks',
      subtitle: 'Manage and track all your scheduled tasks in one place.',
    },
    open: {
      title: 'Open Tasks',
      subtitle: 'Focus on what needs to be done next.',
    },
    done: {
      title: 'Completed Tasks',
      subtitle: 'Review finished accomplishments and completed milestones.',
    },
  }[filter] || {
    title: 'Tasks',
    subtitle: 'Stay organized and boost your daily workflow.',
  };

  const handleResetFilters = () => {
    setFilter('all');
    clearSearch();
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="app-layout">
      {/* Desktop Sidebar Navigation */}
      <Sidebar
        currentFilter={filter}
        onSelectFilter={setFilter}
        counts={counts}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main App Content Area */}
      <div className="main-content">
        {/* Mobile Top Header (visible on <768px screens) */}
        <MobileHeader
          currentFilter={filter}
          onSelectFilter={setFilter}
          counts={counts}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="content-container">
          {/* Header with Title and Add Button */}
          <header className="main-header">
            <div className="main-header-text">
              <h1 id="main-view-title">{headerDetails.title}</h1>
              <p>{headerDetails.subtitle}</p>
            </div>
            <div className="main-header-actions">
              <button
                type="button"
                className="btn-primary-add"
                onClick={() => setIsAddModalOpen(true)}
                id="main-add-task-btn"
                aria-label="Create new task"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Task</span>
              </button>
            </div>
          </header>

          {/* Metrics / Summary Cards */}
          <TaskSummary counts={counts} />

          {/* Search Bar & Status Filters */}
          <section className="controls-bar" aria-label="Task Search and Filters">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={clearSearch}
            />
            <TaskFilters
              filter={filter}
              onSelectFilter={setFilter}
            />
          </section>

          {/* Task List / Empty States */}
          <TaskList
            tasks={filteredTasks}
            totalSystemTasks={tasks.length}
            searchQuery={searchQuery}
            onToggle={toggleTask}
            onRequestDelete={(task) => setTaskToDelete(task)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>

      {/* Task Creation Modal / Bottom Sheet */}
      <TaskForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={(taskData) => {
          addTask(taskData);
          setIsAddModalOpen(false);
          if (filter === 'done') {
            setFilter('all');
          }
        }}
      />

      {/* Confirmation Dialog for Deletions */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}
