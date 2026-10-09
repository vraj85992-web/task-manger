import { useState, useMemo, useCallback } from 'react';
import { taskStorage } from '../services/taskStorage';

/**
 * Custom hook to manage TaskFlow task state, filters, search, and persistence.
 */
export function useTasks() {
  const [tasks, setTasks] = useState(() => taskStorage.getTasks());
  const [filter, setFilter] = useState('all'); // 'all' | 'open' | 'done'
  const [searchQuery, setSearchQuery] = useState('');

  // Keep state synchronized with LocalStorage
  const refreshTasks = useCallback(() => {
    setTasks(taskStorage.getTasks());
  }, []);

  // Calculate task counts dynamically from state
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.is_completed).length;
    const open = total - completed;
    return { total, open, completed };
  }, [tasks]);

  // Derived filtered & searched tasks list
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply status filter
    if (filter === 'open') {
      result = result.filter((task) => !task.is_completed);
    } else if (filter === 'done') {
      result = result.filter((task) => task.is_completed);
    }

    // Apply search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tasks, filter, searchQuery]);

  // Actions
  const addTask = useCallback((taskData) => {
    try {
      const newTask = taskStorage.createTask(taskData);
      setTasks((prev) => [newTask, ...(Array.isArray(prev) ? prev : [])]);
      // Clear search query and switch filter if on 'done' so the new task is always visible!
      setSearchQuery('');
      setFilter((prevFilter) => (prevFilter === 'done' ? 'all' : prevFilter));
      return newTask;
    } catch (err) {
      console.error('Error in addTask hook:', err);
      return null;
    }
  }, []);

  const toggleTask = useCallback((id) => {
    const updated = taskStorage.toggleTask(id);
    setTasks(updated);
  }, []);

  const deleteTask = useCallback((id) => {
    const updated = taskStorage.deleteTask(id);
    setTasks(updated);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
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
    refreshTasks,
  };
}
