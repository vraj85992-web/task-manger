/**
 * TaskFlow Persistence Service
 * 
 * LocalStorage adapter for task storage.
 * Designed with a clean interface so it can be seamlessly replaced or wired
 * to a Python FastAPI backend and Supabase PostgreSQL in the next phase.
 * 
 * Future API Endpoints mapping:
 * - getTasks()   -> GET    /tasks
 * - createTask() -> POST   /tasks
 * - updateTask() -> PATCH  /tasks/{task_id}
 * - deleteTask() -> DELETE /tasks/{task_id}
 */

const STORAGE_KEY = 'taskflow_tasks_v1';

// Seed initial realistic tasks so first-time users see a vibrant, realistic dashboard
const INITIAL_SEED_TASKS = [
  {
    id: 'seed-task-1',
    title: 'Review and approve Q4 engineering roadmap',
    is_completed: false,
    priority: 'high',
    due_date: '2026-10-11',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'seed-task-2',
    title: 'Design database schema for Supabase integration',
    is_completed: false,
    priority: 'medium',
    due_date: '2026-10-15',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'seed-task-3',
    title: 'Submit quarterly budget expense breakdown',
    is_completed: false,
    priority: 'high',
    // Overdue task demonstration
    due_date: '2026-10-06',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'seed-task-4',
    title: 'Update UI component tokens for mobile responsiveness',
    is_completed: false,
    priority: 'low',
    due_date: '2026-10-18',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'seed-task-5',
    title: 'Initialize TaskFlow Vite + React frontend workspace',
    is_completed: true,
    priority: 'medium',
    due_date: '2026-10-09',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

export const taskStorage = {
  /**
   * Fetch all stored tasks. Seeds default tasks if empty on first load.
   * @returns {Array} List of task objects
   */
  getTasks: () => {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (!stored) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_TASKS));
        }
        return INITIAL_SEED_TASKS;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_TASKS));
        }
        return INITIAL_SEED_TASKS;
      }
      return parsed.filter(t => t && typeof t === 'object' && t.id);
    } catch (error) {
      console.error('Failed to read tasks from localStorage:', error);
      return INITIAL_SEED_TASKS;
    }
  },

  /**
   * Save complete list of tasks to storage
   * @param {Array} tasks 
   */
  saveTasks: (tasks) => {
    try {
      if (typeof localStorage !== 'undefined') {
        const safeTasks = Array.isArray(tasks) ? tasks : [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safeTasks));
      }
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  },

  /**
   * Create and persist a new task
   * @param {Object} data - { title, priority, due_date }
   * @returns {Object} Created task
   */
  createTask: (data) => {
    const rawTasks = taskStorage.getTasks();
    const tasks = Array.isArray(rawTasks) ? rawTasks : [];
    
    // Safely generate a unique ID
    let newId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        newId = crypto.randomUUID();
      }
    } catch {
      // Keep fallback ID
    }

    const newTask = {
      id: newId,
      title: (data.title || '').trim(),
      priority: data.priority || 'medium',
      due_date: data.due_date ? data.due_date : null,
      is_completed: false,
      created_at: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    taskStorage.saveTasks(updatedTasks);
    return newTask;
  },

  /**
   * Update task fields by ID
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Array} Updated list of tasks
   */
  updateTask: (id, updates) => {
    const tasks = taskStorage.getTasks();
    const updatedTasks = tasks.map(t => (t.id === id ? { ...t, ...updates } : t));
    taskStorage.saveTasks(updatedTasks);
    return updatedTasks;
  },

  /**
   * Toggle task completion status
   * @param {string} id 
   * @returns {Array} Updated list of tasks
   */
  toggleTask: (id) => {
    const tasks = taskStorage.getTasks();
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, is_completed: !t.is_completed } : t
    );
    taskStorage.saveTasks(updatedTasks);
    return updatedTasks;
  },

  /**
   * Delete task by ID
   * @param {string} id 
   * @returns {Array} Updated list of tasks
   */
  deleteTask: (id) => {
    const tasks = taskStorage.getTasks();
    const updatedTasks = tasks.filter(t => t.id !== id);
    taskStorage.saveTasks(updatedTasks);
    return updatedTasks;
  },

  /**
   * Reset to initial sample tasks
   */
  resetToDefault: () => {
    taskStorage.saveTasks(INITIAL_SEED_TASKS);
    return INITIAL_SEED_TASKS;
  }
};
