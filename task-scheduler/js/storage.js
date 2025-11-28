/**
 * Storage Manager - LocalStorage management for Task Scheduler
 * Handles all data persistence operations
 */

class StorageManager {
    constructor() {
        this.storageKey = 'taskScheduler_tasks';
        this.settingsKey = 'taskScheduler_settings';
    }

    /**
     * Get all tasks from LocalStorage
     * @returns {Array} Array of task objects
     */
    getTasks() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading tasks from storage:', error);
            return [];
        }
    }

    /**
     * Save all tasks to LocalStorage
     * @param {Array} tasks - Array of task objects
     * @returns {boolean} Success status
     */
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error saving tasks to storage:', error);
            return false;
        }
    }

    /**
     * Add a new task
     * @param {Object} task - Task object to add
     * @returns {Object} The created task with ID
     */
    addTask(task) {
        const tasks = this.getTasks();
        const newTask = {
            ...task,
            id: this.generateId(),
            createdAt: Date.now(),
            completed: false,
            completedAt: null
        };
        tasks.push(newTask);
        this.saveTasks(tasks);
        return newTask;
    }

    /**
     * Update an existing task
     * @param {string} id - Task ID
     * @param {Object} updates - Object with properties to update
     * @returns {Object|null} Updated task or null if not found
     */
    updateTask(id, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === id);
        
        if (index === -1) {
            return null;
        }

        tasks[index] = { ...tasks[index], ...updates };
        this.saveTasks(tasks);
        return tasks[index];
    }

    /**
     * Delete a task
     * @param {string} id - Task ID to delete
     * @returns {boolean} Success status
     */
    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        
        if (filteredTasks.length === tasks.length) {
            return false;
        }

        this.saveTasks(filteredTasks);
        return true;
    }

    /**
     * Get a single task by ID
     * @param {string} id - Task ID
     * @returns {Object|null} Task object or null
     */
    getTask(id) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id) || null;
    }

    /**
     * Toggle task completion status
     * @param {string} id - Task ID
     * @returns {Object|null} Updated task or null
     */
    toggleComplete(id) {
        const task = this.getTask(id);
        if (!task) return null;

        const updates = {
            completed: !task.completed,
            completedAt: !task.completed ? Date.now() : null
        };

        return this.updateTask(id, updates);
    }

    /**
     * Duplicate a task
     * @param {string} id - Task ID to duplicate
     * @returns {Object|null} New duplicated task or null
     */
    duplicateTask(id) {
        const task = this.getTask(id);
        if (!task) return null;

        const duplicatedTask = {
            title: `${task.title} (cópia)`,
            description: task.description,
            date: task.date,
            time: task.time,
            priority: task.priority,
            category: task.category
        };

        return this.addTask(duplicatedTask);
    }

    /**
     * Generate a unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get app settings
     * @returns {Object} Settings object
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.settingsKey);
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (error) {
            console.error('Error reading settings:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Save app settings
     * @param {Object} settings - Settings to save
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    /**
     * Get default settings
     * @returns {Object} Default settings
     */
    getDefaultSettings() {
        return {
            theme: 'light',
            viewMode: 'list',
            notificationsEnabled: true
        };
    }

    /**
     * Export tasks to JSON
     * @returns {string} JSON string of all tasks
     */
    exportTasks() {
        const tasks = this.getTasks();
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            tasks: tasks
        };
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * Import tasks from JSON
     * @param {string} jsonString - JSON string with tasks
     * @param {boolean} replace - Whether to replace existing tasks
     * @returns {Object} Result object with success status and message
     */
    importTasks(jsonString, replace = false) {
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.tasks || !Array.isArray(data.tasks)) {
                return { 
                    success: false, 
                    message: 'Formato de arquivo inválido. O arquivo deve conter um array de tarefas.' 
                };
            }

            // Validate each task
            const validTasks = data.tasks.filter(task => 
                task.title && typeof task.title === 'string'
            );

            if (validTasks.length === 0) {
                return { 
                    success: false, 
                    message: 'Nenhuma tarefa válida encontrada no arquivo.' 
                };
            }

            // Regenerate IDs and timestamps for imported tasks
            const importedTasks = validTasks.map(task => ({
                id: this.generateId(),
                title: task.title,
                description: task.description || '',
                date: task.date || '',
                time: task.time || '',
                priority: task.priority || 'medium',
                category: task.category || 'other',
                completed: task.completed || false,
                createdAt: Date.now(),
                completedAt: task.completed ? Date.now() : null
            }));

            if (replace) {
                this.saveTasks(importedTasks);
            } else {
                const existingTasks = this.getTasks();
                this.saveTasks([...existingTasks, ...importedTasks]);
            }

            return { 
                success: true, 
                message: `${importedTasks.length} tarefa(s) importada(s) com sucesso!`,
                count: importedTasks.length
            };
        } catch (error) {
            console.error('Error importing tasks:', error);
            return { 
                success: false, 
                message: 'Erro ao processar o arquivo. Verifique se é um JSON válido.' 
            };
        }
    }

    /**
     * Get statistics about tasks
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const tasks = this.getTasks();
        const now = new Date();
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.filter(t => !t.completed).length;
        const overdue = tasks.filter(t => {
            if (t.completed) return false;
            if (!t.date) return false;
            const taskDate = new Date(`${t.date}T${t.time || '23:59'}`);
            return taskDate < now;
        }).length;
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            pending,
            overdue,
            completionRate
        };
    }

    /**
     * Clear all data
     */
    clearAll() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.settingsKey);
    }
}

// Export as global for use in other scripts
window.StorageManager = StorageManager;
