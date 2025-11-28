/**
 * Task Scheduler - Main Application
 * Complete task management web application
 */

class TaskScheduler {
    constructor() {
        // Initialize managers
        this.storage = new StorageManager();
        this.notifications = new NotificationManager();
        
        // Application state
        this.tasks = [];
        this.currentView = 'list';
        this.filters = {
            status: 'all',
            priority: 'all',
            category: 'all',
            date: 'all',
            search: ''
        };
        this.editingTaskId = null;
        this.deletingTaskId = null;

        // Category labels
        this.categoryLabels = {
            work: { emoji: '🔵', name: 'Trabalho' },
            personal: { emoji: '🟣', name: 'Pessoal' },
            study: { emoji: '🟢', name: 'Estudos' },
            health: { emoji: '🔴', name: 'Saúde' },
            shopping: { emoji: '🟡', name: 'Compras' },
            other: { emoji: '⚪', name: 'Outros' }
        };

        // Priority labels
        this.priorityLabels = {
            high: { emoji: '🔴', name: 'Alta' },
            medium: { emoji: '🟡', name: 'Média' },
            low: { emoji: '🟢', name: 'Baixa' }
        };

        // Initialize the app
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        // Load tasks and settings
        this.tasks = this.storage.getTasks();
        const settings = this.storage.getSettings();
        
        // Cache DOM elements first
        this.cacheElements();
        
        // Apply theme after elements are cached
        this.setTheme(settings.theme);
        this.currentView = settings.viewMode || 'list';
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize notifications
        await this.notifications.init();
        this.notifications.startDeadlineChecker(() => this.tasks);
        
        // Initial render
        this.render();
        this.updateStatistics();
        this.updateBadge();

        // Set default date for new tasks
        this.setDefaultDate();
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        // Main containers
        this.tasksContainer = document.getElementById('tasksContainer');
        this.emptyState = document.getElementById('emptyState');
        
        // Modal elements
        this.taskModal = document.getElementById('taskModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.taskForm = document.getElementById('taskForm');
        this.modalTitle = document.getElementById('modalTitle');
        
        // Form fields
        this.taskIdField = document.getElementById('taskId');
        this.titleField = document.getElementById('taskTitle');
        this.descriptionField = document.getElementById('taskDescription');
        this.dateField = document.getElementById('taskDate');
        this.timeField = document.getElementById('taskTime');
        this.priorityField = document.getElementById('taskPriority');
        this.categoryField = document.getElementById('taskCategory');
        
        // Filter elements
        this.searchInput = document.getElementById('searchInput');
        this.statusFilter = document.getElementById('statusFilter');
        this.priorityFilter = document.getElementById('priorityFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.dateFilter = document.getElementById('dateFilter');
        
        // View toggle buttons
        this.listViewBtn = document.getElementById('listViewBtn');
        this.cardViewBtn = document.getElementById('cardViewBtn');
        
        // Statistics elements
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
        this.overdueTasksEl = document.getElementById('overdueTasks');
        this.completionRateEl = document.getElementById('completionRate');
        this.progressFillEl = document.getElementById('progressFill');
        this.badgeCountEl = document.getElementById('badgeCount');
        
        // Toast container
        this.toastContainer = document.getElementById('toastContainer');
        
        // Buttons
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.toggleDarkModeBtn = document.getElementById('toggleDarkMode');
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Add task button
        this.addTaskBtn.addEventListener('click', () => this.openTaskModal());
        
        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeTaskModal());
        document.getElementById('closeDeleteModal').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
        
        // Form submission
        this.taskForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Filters
        this.searchInput.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.render();
        });
        
        this.statusFilter.addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.render();
        });
        
        this.priorityFilter.addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.render();
        });
        
        this.categoryFilter.addEventListener('change', (e) => {
            this.filters.category = e.target.value;
            this.render();
        });
        
        this.dateFilter.addEventListener('change', (e) => {
            this.filters.date = e.target.value;
            this.render();
        });
        
        // View toggle
        this.listViewBtn.addEventListener('click', () => this.setView('list'));
        this.cardViewBtn.addEventListener('click', () => this.setView('card'));
        
        // Theme toggle
        this.toggleDarkModeBtn.addEventListener('click', () => this.toggleTheme());
        
        // Export/Import
        this.exportBtn.addEventListener('click', () => this.exportTasks());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.handleImport(e));
        
        // Task actions delegation
        this.tasksContainer.addEventListener('click', (e) => this.handleTaskAction(e));
        
        // Close modals on overlay click
        this.taskModal.addEventListener('click', (e) => {
            if (e.target === this.taskModal) this.closeTaskModal();
        });
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.closeDeleteModal();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Set default date to today
     */
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.dateField.value = today;
        this.dateField.min = today;
    }

    /**
     * Render tasks based on current filters
     */
    render() {
        const filteredTasks = this.filterTasks();
        
        // Sort tasks
        const sortedTasks = this.sortTasks(filteredTasks);
        
        // Show/hide empty state
        if (sortedTasks.length === 0) {
            this.emptyState.classList.remove('hidden');
            this.renderEmptyState();
        } else {
            this.emptyState.classList.add('hidden');
        }
        
        // Clear existing tasks (except empty state)
        const existingTasks = this.tasksContainer.querySelectorAll('.task-item');
        existingTasks.forEach(el => el.remove());
        
        // Render tasks
        sortedTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.tasksContainer.appendChild(taskElement);
        });
        
        // Update view class
        this.tasksContainer.classList.remove('list-view', 'card-view');
        this.tasksContainer.classList.add(`${this.currentView}-view`);
    }

    /**
     * Render empty state with appropriate message
     */
    renderEmptyState() {
        const hasFilters = Object.values(this.filters).some(v => v !== 'all' && v !== '');
        
        if (hasFilters) {
            this.emptyState.innerHTML = `
                <span class="empty-icon">🔍</span>
                <h3>Nenhuma tarefa encontrada</h3>
                <p>Tente ajustar os filtros para ver mais resultados</p>
            `;
        } else if (this.tasks.length === 0) {
            this.emptyState.innerHTML = `
                <span class="empty-icon">📝</span>
                <h3>Nenhuma tarefa encontrada</h3>
                <p>Clique no botão + para adicionar sua primeira tarefa</p>
            `;
        }
    }

    /**
     * Filter tasks based on current filters
     */
    filterTasks() {
        return this.tasks.filter(task => {
            // Status filter
            if (this.filters.status === 'active' && task.completed) return false;
            if (this.filters.status === 'completed' && !task.completed) return false;
            
            // Priority filter
            if (this.filters.priority !== 'all' && task.priority !== this.filters.priority) return false;
            
            // Category filter
            if (this.filters.category !== 'all' && task.category !== this.filters.category) return false;
            
            // Date filter
            if (!this.passesDateFilter(task)) return false;
            
            // Search filter
            if (this.filters.search) {
                const searchLower = this.filters.search;
                const titleMatch = task.title.toLowerCase().includes(searchLower);
                const descMatch = (task.description || '').toLowerCase().includes(searchLower);
                if (!titleMatch && !descMatch) return false;
            }
            
            return true;
        });
    }

    /**
     * Check if task passes date filter
     */
    passesDateFilter(task) {
        if (this.filters.date === 'all') return true;
        if (!task.date) return false;
        
        const taskDate = new Date(task.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const taskDateOnly = new Date(taskDate);
        taskDateOnly.setHours(0, 0, 0, 0);
        
        switch (this.filters.date) {
            case 'today':
                return taskDateOnly.getTime() === today.getTime();
            
            case 'week': {
                const weekEnd = new Date(today);
                weekEnd.setDate(weekEnd.getDate() + 7);
                return taskDateOnly >= today && taskDateOnly <= weekEnd;
            }
            
            case 'month': {
                const monthEnd = new Date(today);
                monthEnd.setMonth(monthEnd.getMonth() + 1);
                return taskDateOnly >= today && taskDateOnly <= monthEnd;
            }
            
            default:
                return true;
        }
    }

    /**
     * Sort tasks by priority and date
     */
    sortTasks(tasks) {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        
        return [...tasks].sort((a, b) => {
            // Completed tasks go to the end
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            // Then by priority
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            // Then by date
            if (a.date && b.date) {
                return new Date(a.date) - new Date(b.date);
            }
            
            // Tasks with dates come before tasks without
            if (a.date && !b.date) return -1;
            if (!a.date && b.date) return 1;
            
            // Finally by creation date
            return a.createdAt - b.createdAt;
        });
    }

    /**
     * Create task DOM element
     */
    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item ${task.completed ? 'completed' : ''} ${this.isOverdue(task) ? 'overdue' : ''}`;
        div.dataset.taskId = task.id;
        
        const category = this.categoryLabels[task.category] || this.categoryLabels.other;
        const priority = this.priorityLabels[task.priority] || this.priorityLabels.medium;
        
        const dateFormatted = task.date ? this.formatDate(task.date) : '';
        const timeFormatted = task.time || '';
        
        div.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 data-action="toggle" 
                 role="checkbox" 
                 aria-checked="${task.completed}"
                 tabindex="0"
                 aria-label="Marcar como ${task.completed ? 'pendente' : 'concluída'}">
            </div>
            <div class="task-content">
                <div class="task-header">
                    <span class="task-title">${this.escapeHtml(task.title)}</span>
                    <span class="priority-badge ${task.priority}">${priority.name}</span>
                </div>
                ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                    <span class="category-tag ${task.category}">${category.emoji} ${category.name}</span>
                    ${dateFormatted ? `
                        <span class="task-meta-item date">
                            📅 ${dateFormatted}${timeFormatted ? ` às ${timeFormatted}` : ''}
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn" data-action="edit" aria-label="Editar tarefa" title="Editar">✏️</button>
                <button class="task-action-btn" data-action="duplicate" aria-label="Duplicar tarefa" title="Duplicar">📋</button>
                <button class="task-action-btn delete" data-action="delete" aria-label="Excluir tarefa" title="Excluir">🗑️</button>
            </div>
        `;
        
        return div;
    }

    /**
     * Handle task action clicks
     */
    handleTaskAction(e) {
        const actionElement = e.target.closest('[data-action]');
        if (!actionElement) return;
        
        const taskElement = e.target.closest('.task-item');
        if (!taskElement) return;
        
        const taskId = taskElement.dataset.taskId;
        const action = actionElement.dataset.action;
        
        switch (action) {
            case 'toggle':
                this.toggleTaskComplete(taskId);
                break;
            case 'edit':
                this.openTaskModal(taskId);
                break;
            case 'duplicate':
                this.duplicateTask(taskId);
                break;
            case 'delete':
                this.openDeleteModal(taskId);
                break;
        }
    }

    /**
     * Open task modal for create/edit
     */
    openTaskModal(taskId = null) {
        this.editingTaskId = taskId;
        
        if (taskId) {
            // Edit mode
            const task = this.storage.getTask(taskId);
            if (!task) return;
            
            this.modalTitle.textContent = 'Editar Tarefa';
            this.taskIdField.value = task.id;
            this.titleField.value = task.title;
            this.descriptionField.value = task.description || '';
            this.dateField.value = task.date || '';
            this.timeField.value = task.time || '';
            this.priorityField.value = task.priority;
            this.categoryField.value = task.category;
        } else {
            // Create mode
            this.modalTitle.textContent = 'Nova Tarefa';
            this.taskForm.reset();
            this.setDefaultDate();
        }
        
        this.taskModal.classList.add('active');
        this.titleField.focus();
    }

    /**
     * Close task modal
     */
    closeTaskModal() {
        this.taskModal.classList.remove('active');
        this.editingTaskId = null;
        this.taskForm.reset();
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        e.preventDefault();
        
        const title = this.titleField.value.trim();
        if (!title) {
            this.showToast('Por favor, insira um título para a tarefa', 'error');
            this.titleField.focus();
            return;
        }
        
        const taskData = {
            title,
            description: this.descriptionField.value.trim(),
            date: this.dateField.value,
            time: this.timeField.value,
            priority: this.priorityField.value,
            category: this.categoryField.value
        };
        
        if (this.editingTaskId) {
            // Update existing task
            this.storage.updateTask(this.editingTaskId, taskData);
            this.showToast('Tarefa atualizada com sucesso!', 'success');
        } else {
            // Create new task
            this.storage.addTask(taskData);
            this.showToast('Tarefa criada com sucesso!', 'success');
        }
        
        this.tasks = this.storage.getTasks();
        this.render();
        this.updateStatistics();
        this.updateBadge();
        this.closeTaskModal();
    }

    /**
     * Toggle task completion
     */
    toggleTaskComplete(taskId) {
        const task = this.storage.toggleComplete(taskId);
        if (!task) return;
        
        this.tasks = this.storage.getTasks();
        this.render();
        this.updateStatistics();
        this.updateBadge();
        
        if (task.completed) {
            this.showToast('Tarefa concluída! 🎉', 'success');
            this.notifications.clearTaskNotifications(taskId);
        } else {
            this.showToast('Tarefa reaberta', 'info');
        }
    }

    /**
     * Duplicate a task
     */
    duplicateTask(taskId) {
        const newTask = this.storage.duplicateTask(taskId);
        if (!newTask) return;
        
        this.tasks = this.storage.getTasks();
        this.render();
        this.updateStatistics();
        this.updateBadge();
        this.showToast('Tarefa duplicada com sucesso!', 'success');
    }

    /**
     * Open delete confirmation modal
     */
    openDeleteModal(taskId) {
        this.deletingTaskId = taskId;
        this.deleteModal.classList.add('active');
    }

    /**
     * Close delete modal
     */
    closeDeleteModal() {
        this.deleteModal.classList.remove('active');
        this.deletingTaskId = null;
    }

    /**
     * Confirm and execute delete
     */
    confirmDelete() {
        if (!this.deletingTaskId) return;
        
        this.storage.deleteTask(this.deletingTaskId);
        this.notifications.clearTaskNotifications(this.deletingTaskId);
        this.tasks = this.storage.getTasks();
        this.render();
        this.updateStatistics();
        this.updateBadge();
        this.closeDeleteModal();
        this.showToast('Tarefa excluída', 'success');
    }

    /**
     * Set view mode
     */
    setView(view) {
        this.currentView = view;
        
        this.listViewBtn.classList.toggle('active', view === 'list');
        this.cardViewBtn.classList.toggle('active', view === 'card');
        
        this.tasksContainer.classList.remove('list-view', 'card-view');
        this.tasksContainer.classList.add(`${view}-view`);
        
        // Save preference
        const settings = this.storage.getSettings();
        settings.viewMode = view;
        this.storage.saveSettings(settings);
    }

    /**
     * Update statistics display
     */
    updateStatistics() {
        const stats = this.storage.getStatistics();
        
        this.totalTasksEl.textContent = stats.total;
        this.completedTasksEl.textContent = stats.completed;
        this.pendingTasksEl.textContent = stats.pending;
        this.overdueTasksEl.textContent = stats.overdue;
        this.completionRateEl.textContent = `${stats.completionRate}%`;
        this.progressFillEl.style.width = `${stats.completionRate}%`;
    }

    /**
     * Update pending badge
     */
    updateBadge() {
        const pending = this.tasks.filter(t => !t.completed).length;
        this.badgeCountEl.textContent = pending;
        this.badgeCountEl.style.display = pending > 0 ? 'block' : 'none';
    }

    /**
     * Toggle dark/light theme
     */
    toggleTheme() {
        const settings = this.storage.getSettings();
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        settings.theme = newTheme;
        this.storage.saveSettings(settings);
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        this.toggleDarkModeBtn.querySelector('.icon').textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    /**
     * Export tasks to JSON file
     */
    exportTasks() {
        const jsonData = this.storage.exportTasks();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Tarefas exportadas com sucesso!', 'success');
    }

    /**
     * Handle import file selection
     */
    handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = this.storage.importTasks(event.target.result);
            
            if (result.success) {
                this.tasks = this.storage.getTasks();
                this.render();
                this.updateStatistics();
                this.updateBadge();
                this.showToast(result.message, 'success');
            } else {
                this.showToast(result.message, 'error');
            }
        };
        
        reader.onerror = () => {
            this.showToast('Erro ao ler o arquivo', 'error');
        };
        
        reader.readAsText(file);
        
        // Reset file input
        e.target.value = '';
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Escape to close modals
        if (e.key === 'Escape') {
            if (this.taskModal.classList.contains('active')) {
                this.closeTaskModal();
            } else if (this.deleteModal.classList.contains('active')) {
                this.closeDeleteModal();
            }
        }
        
        // N to create new task (when not in modal)
        if (e.key === 'n' && !this.isModalOpen() && !this.isInputFocused()) {
            e.preventDefault();
            this.openTaskModal();
        }
        
        // / to focus search
        if (e.key === '/' && !this.isModalOpen() && !this.isInputFocused()) {
            e.preventDefault();
            this.searchInput.focus();
        }
    }

    /**
     * Check if any modal is open
     */
    isModalOpen() {
        return this.taskModal.classList.contains('active') || 
               this.deleteModal.classList.contains('active');
    }

    /**
     * Check if an input is focused
     */
    isInputFocused() {
        const activeEl = document.activeElement;
        return activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
    }

    /**
     * Check if task is overdue
     */
    isOverdue(task) {
        if (task.completed || !task.date) return false;
        
        const taskDateTime = new Date(`${task.date}T${task.time || '23:59'}`);
        return taskDateTime < new Date();
    }

    /**
     * Format date for display
     */
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);
        
        if (dateOnly.getTime() === today.getTime()) {
            return 'Hoje';
        } else if (dateOnly.getTime() === tomorrow.getTime()) {
            return 'Amanhã';
        } else {
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
            });
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
        this.toastContainer.appendChild(toast);
        
        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.taskApp = new TaskScheduler();
});
