/**
 * Task Scheduler - Main Application
 * Modern, intuitive task management
 */

class TaskScheduler {
    constructor() {
        this.tasks = [];
        this.currentFilter = {
            tab: 'today',
            status: 'all',
            priority: 'all',
            category: 'all',
            date: 'all',
            search: ''
        };
        this.currentView = 'list';
        this. editingTaskId = null;
        
        this.init();
    }
    
    init() {
        this.loadTasks();
        this.setupEventListeners();
        this. setupDarkMode();
        this.setupPullToRefresh();
        this.renderTasks();
        this.updateStats();
        this.setDefaultDate();
        
        if (window.NotificationManager) {
            window.NotificationManager.init();
        }
        
        setInterval(() => this.checkOverdueTasks(), 60000);
    }
    
    setupEventListeners() {
        // FAB
        document.getElementById('addTaskBtn')?.addEventListener('click', () => this.openTaskModal());
        
        // Modal
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeTaskModal());
        document.getElementById('cancelBtn')?.addEventListener('click', () => this.closeTaskModal());
        document.getElementById('taskModal')?.addEventListener('click', (e) => {
            if (e. target.id === 'taskModal') this.closeTaskModal();
        });
        
        // Form
        document.getElementById('taskForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });
        
        // Quick Date Buttons
        document.querySelectorAll('.quick-date-btn').forEach(btn => {
            btn. addEventListener('click', () => {
                document.querySelectorAll('.quick-date-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const dateType = btn.dataset.date;
                const dateInput = document. getElementById('taskDate');
                const today = new Date();
                let targetDate = new Date();
                
                if (dateType === 'today') targetDate = today;
                else if (dateType === 'tomorrow') targetDate. setDate(today.getDate() + 1);
                else if (dateType === 'nextweek') targetDate.setDate(today.getDate() + 7);
                
                dateInput.value = this.formatDateInput(targetDate);
            });
        });
        
        // Advanced Toggle
        document.getElementById('toggleAdvancedBtn')?.addEventListener('click', () => {
            const btn = document.getElementById('toggleAdvancedBtn');
            const options = document.getElementById('advancedOptions');
            btn.classList.toggle('active');
            options.classList.toggle('hidden');
        });
        
        // Priority & Category Selectors
        document.querySelectorAll('.priority-option input').forEach(input => {
            input.addEventListener('change', () => {
                document.getElementById('taskPriority').value = input.value;
            });
        });
        
        document. querySelectorAll('.category-option input').forEach(input => {
            input.addEventListener('change', () => {
                document.getElementById('taskCategory').value = input.value;
            });
        });
        
        // Tabs
        document.querySelectorAll('. tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b. classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter.tab = btn. dataset.tab;
                this. renderTasks();
            });
        });
        
        // Search
        ['searchInput', 'mobileSearchInput']. forEach(id => {
            document.getElementById(id)?.addEventListener('input', (e) => {
                this. currentFilter.search = e.target.value. toLowerCase();
                this.renderTasks();
            });
        });
        
        // Filters
        ['statusFilter', 'mobileStatusFilter'].forEach(id => {
            document.getElementById(id)?. addEventListener('change', (e) => {
                this.currentFilter. status = e.target.value;
                this.renderTasks();
            });
        });
        
        ['priorityFilter', 'mobilePriorityFilter']. forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                this.currentFilter.priority = e.target.value;
                this.renderTasks();
            });
        });
        
        ['categoryFilter', 'mobileCategoryFilter'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', (e) => {
                this.currentFilter.category = e.target.value;
                this.renderTasks();
            });
        });
        
        document.getElementById('dateFilter')?.addEventListener('change', (e) => {
            this. currentFilter.date = e.target.value;
            this.renderTasks();
        });
        
        // View Toggle
        document.getElementById('listViewBtn')?.addEventListener('click', () => this.setView('list'));
        document.getElementById('cardViewBtn')?.addEventListener('click', () => this.setView('card'));
        
        // Menu
        document.getElementById('menuBtn')?.addEventListener('click', () => {
            document.getElementById('menuOverlay')?.classList.add('active');
        });
        document.getElementById('menuClose')?.addEventListener('click', () => {
            document.getElementById('menuOverlay')?.classList.remove('active');
        });
        document.getElementById('menuOverlay')?. addEventListener('click', (e) => {
            if (e.target.id === 'menuOverlay') {
                document.getElementById('menuOverlay')?.classList.remove('active');
            }
        });
        
        // Export/Import
        ['exportBtn', 'mobileExportBtn'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => this.exportTasks());
        });
        ['importBtn', 'mobileImportBtn'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => {
                document.getElementById('importFile')?.click();
            });
        });
        document.getElementById('importFile')?.addEventListener('change', (e) => {
            this.importTasks(e.target.files[0]);
        });
        
        // Notifications
        document.getElementById('enableNotificationsBtn')?.addEventListener('click', () => {
            if (window.NotificationManager) window.NotificationManager.requestPermission();
        });
        
        // Delete Modal
        document.getElementById('closeDeleteModal')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('cancelDeleteBtn')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => this.confirmDelete());
    }
    
    setupDarkMode() {
        const toggleBtn = document.getElementById('toggleDarkMode');
        const icon = toggleBtn?. querySelector('. icon');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (icon) icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        
        toggleBtn?. addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document. documentElement.setAttribute('data-theme', newTheme);
            localStorage. setItem('theme', newTheme);
            if (icon) icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
    
    setupPullToRefresh() {
        let touchStartY = 0;
        let touchEndY = 0;
        const pullToRefresh = document.getElementById('pullToRefresh');
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            const scrollTop = window.pageYOffset || document. documentElement.scrollTop;
            if (scrollTop === 0 && touchEndY > touchStartY + 50) {
                pullToRefresh?. classList.add('active');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (pullToRefresh?.classList.contains('active')) {
                this.refreshTasks();
                setTimeout(() => pullToRefresh. classList.remove('active'), 1000);
            }
        }, { passive: true });
    }
    
    loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) {
            try {
                this.tasks = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading tasks:', e);
                this. tasks = [];
            }
        }
    }
    
    saveTasks() {
        localStorage. setItem('tasks', JSON.stringify(this.tasks));
    }
    
    refreshTasks() {
        this. loadTasks();
        this. renderTasks();
        this. updateStats();
        this.showToast('Tarefas atualizadas! ', 'success');
    }
    
    openTaskModal(taskId = null) {
        this.editingTaskId = taskId;
        const modal = document. getElementById('taskModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');
        
        form?. reset();
        document.getElementById('advancedOptions')?.classList.add('hidden');
        document.getElementById('toggleAdvancedBtn')?.classList.remove('active');
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Editar Tarefa';
                document.getElementById('taskId').value = task.id;
                document.getElementById('taskTitle'). value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskDate').value = task.date;
                document.getElementById('taskTime').value = task.time || '';
                document.getElementById('taskPriority').value = task.priority;
                document.getElementById('taskCategory').value = task.category;
                document.querySelector(`input[name="priority"][value="${task.priority}"]`).checked = true;
                document.querySelector(`input[name="category"][value="${task.category}"]`). checked = true;
                document.getElementById('advancedOptions')?.classList.remove('hidden');
                document.getElementById('toggleAdvancedBtn')?. classList.add('active');
            }
        } else {
            title.textContent = 'Nova Tarefa';
            document. getElementById('taskId').value = '';
            document.querySelector('input[name="priority"][value="medium"]').checked = true;
            document.querySelector('input[name="category"][value="work"]').checked = true;
        }
        
        modal?. classList.add('active');
        document.getElementById('taskTitle')?.focus();
    }
    
    closeTaskModal() {
        document.getElementById('taskModal')?.classList.remove('active');
        this.editingTaskId = null;
    }
    
    setDefaultDate() {
        const today = new Date();
        document.getElementById('taskDate').value = this.formatDateInput(today);
    }
    
    formatDateInput(date) {
        const year = date.getFullYear();
        const month = String(date. getMonth() + 1).padStart(2, '0');
        const day = String(date. getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    saveTask() {
        const title = document.getElementById('taskTitle'). value. trim();
        const description = document.getElementById('taskDescription').value. trim();
        const date = document.getElementById('taskDate').value;
        const time = document.getElementById('taskTime').value;
        const priority = document.querySelector('input[name="priority"]:checked'). value;
        const category = document.querySelector('input[name="category"]:checked').value;
        const taskId = document.getElementById('taskId').value;
        
        if (!title) {
            this.showToast('Por favor, insira um título', 'error');
            return;
        }
        
        if (!date) {
            this.showToast('Por favor, selecione uma data', 'error');
            return;
        }
        
        const task = {
            id: taskId || Date.now(). toString(),
            title,
            description,
            date,
            time,
            priority,
            category,
            completed: false,
            createdAt: taskId ? this.tasks.find(t => t.id === taskId)?.createdAt : new Date(). toISOString()
        };
        
        if (taskId) {
            const index = this.tasks.findIndex(t => t.id === taskId);
            if (index !== -1) {
                task.completed = this.tasks[index].completed;
                this.tasks[index] = task;
                this.showToast('Tarefa atualizada! ', 'success');
            }
        } else {
            this.tasks.push(task);
            this.showToast('Tarefa criada!', 'success');
            if (window.NotificationManager) {
                window.NotificationManager.scheduleNotification(task);
            }
        }
        
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeTaskModal();
    }
    
    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            const message = task.completed ? 'Tarefa concluída!  🎉' : 'Tarefa reativada';
            this.showToast(message, task.completed ? 'success' : 'info');
        }
    }
    
    deleteTaskPrompt(taskId) {
        this.editingTaskId = taskId;
        document.getElementById('deleteModal')?.classList.add('active');
    }
    
    closeDeleteModal() {
        document.getElementById('deleteModal')?.classList.remove('active');
        this.editingTaskId = null;
    }
    
    confirmDelete() {
        if (this.editingTaskId) {
            this.tasks = this.tasks.filter(t => t.id !== this.editingTaskId);
            this. saveTasks();
            this. renderTasks();
            this. updateStats();
            this.closeDeleteModal();
            this.showToast('Tarefa excluída', 'info');
        }
    }
    
    filterTasks() {
        let filtered = [... this.tasks];
        
        // Search
        if (this.currentFilter. search) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(this.currentFilter.search) ||
                task.description?. toLowerCase().includes(this.currentFilter.search)
            );
        }
        
        // Status
        if (this.currentFilter. status === 'active') {
            filtered = filtered. filter(t => ! t.completed);
        } else if (this.currentFilter.status === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }
        
        // Priority
        if (this.currentFilter.priority !== 'all') {
            filtered = filtered.filter(t => t.priority === this.currentFilter. priority);
        }
        
        // Category
        if (this.currentFilter.category !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentFilter.category);
        }
        
        // Tab filter
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (this.currentFilter.tab === 'today') {
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.date);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate. getTime() === today.getTime();
            });
        } else if (this.currentFilter.tab === 'week') {
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate >= today && taskDate <= weekFromNow;
            });
        }
        
        // Date filter
        if (this.currentFilter.date === 'today') {
            filtered = filtered. filter(task => {
                const taskDate = new Date(task.date);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() === today.getTime();
            });
        } else if (this.currentFilter.date === 'week') {
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            filtered = filtered. filter(task => {
                const taskDate = new Date(task. date);
                return taskDate >= today && taskDate <= weekFromNow;
            });
        } else if (this.currentFilter. date === 'month') {
            const monthFromNow = new Date(today);
            monthFromNow. setMonth(today.getMonth() + 1);
            filtered = filtered.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate >= today && taskDate <= monthFromNow;
            });
        }
        
        return filtered;
    }
    
    groupTasksByDate(tasks) {
        const groups = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        tasks.forEach(task => {
            const taskDate = new Date(task.date);
            taskDate.setHours(0, 0, 0, 0);
            
            let groupKey;
            if (taskDate.getTime() === today.getTime()) {
                groupKey = 'Hoje';
            } else if (taskDate.getTime() === today.getTime() + 86400000) {
                groupKey = 'Amanhã';
            } else if (taskDate < today) {
                groupKey = 'Atrasadas';
            } else {
                groupKey = this.formatDate(task.date);
            }
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(task);
        });
        
        // Sort groups
        const sortedGroups = {};
        const order = ['Atrasadas', 'Hoje', 'Amanhã'];
        
        order.forEach(key => {
            if (groups[key]) {
                sortedGroups[key] = groups[key];
            }
        });
        
        Object.keys(groups).sort(). forEach(key => {
            if (! order.includes(key)) {
                sortedGroups[key] = groups[key];
            }
        });
        
        return sortedGroups;
    }
    
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');
        const filtered = this.filterTasks();
        
        // Sort by priority and date
        filtered.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return new Date(a. date) - new Date(b. date);
        });
        
        if (filtered.length === 0) {
            container.innerHTML = '';
            emptyState?. classList.remove('hidden');
            return;
        }
        
        emptyState?.classList.add('hidden');
        
        const grouped = this.groupTasksByDate(filtered);
        let html = '';
        
        Object.entries(grouped).forEach(([groupName, tasks]) => {
            html += `
                <div class="task-group">
                    <div class="task-group-header">
                        <h3 class="task-group-title">
                            ${groupName === 'Hoje' ? '📅' : groupName === 'Amanhã' ? '📆' : groupName === 'Atrasadas' ?  '⚠️' : '📋'}
                            ${groupName}
                        </h3>
                        <span class="task-group-count">${tasks.length}</span>
                    </div>
                    <div class="task-list">
                        ${tasks.map(task => this.renderTaskCard(task)).join('')}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add event listeners
        this.attachTaskListeners();
    }
    
    renderTaskCard(task) {
        const isOverdue = this.isTaskOverdue(task);
        const categoryIcons = {
            work: '💼',
            personal: '👤',
            study: '📚',
            health: '❤️',
            shopping: '🛒',
            other: '📌'
        };
        
        const priorityLabels = {
            high: '🔴 Alta',
            medium: '🟡 Média',
            low: '🟢 Baixa'
        };
        
        return `
            <div class="task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" data-task-id="${task.id}">
                <div class="task-card-header">
                    <div class="task-checkbox-wrapper" onclick="app.toggleTaskComplete('${task.id}')">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                    </div>
                    
                    <div class="task-main">
                        <h4 class="task-title">${this.escapeHtml(task.title)}</h4>
                        ${task.description ?  `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                        
                        <div class="task-meta">
                            <span class="task-badge priority-${task.priority}">
                                ${priorityLabels[task.priority]}
                            </span>
                            <span class="task-badge category">
                                ${categoryIcons[task.category]} ${this.getCategoryName(task.category)}
                            </span>
                            <span class="task-badge date">
                                🕐 ${this.formatDate(task.date)}${task.time ? ` às ${task.time}` : ''}
                            </span>
                            ${isOverdue && ! task.completed ? '<span class="task-badge overdue-badge">⚠️ Atrasada</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="task-actions">
                        <button class="task-action-btn edit" onclick="app.openTaskModal('${task.id}')" title="Editar">
                            ✏️
                        </button>
                        <button class="task-action-btn delete" onclick="app.deleteTaskPrompt('${task.id}')" title="Excluir">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachTaskListeners() {
        // Already handled with inline onclick for simplicity
    }
    
    isTaskOverdue(task) {
        if (task.completed) return false;
        const now = new Date();
        const taskDateTime = new Date(task.date);
        if (task.time) {
            const [hours, minutes] = task.time.split(':');
            taskDateTime.setHours(parseInt(hours), parseInt(minutes));
        } else {
            taskDateTime.setHours(23, 59, 59);
        }
        return taskDateTime < now;
    }
    
    checkOverdueTasks() {
        const overdue = this.tasks.filter(task => this.isTaskOverdue(task));
        if (overdue.length > 0 && window.NotificationManager) {
            overdue.forEach(task => {
                window.NotificationManager.showNotification(
                    'Tarefa Atrasada! ',
                    `${task.title} está atrasada. `
                );
            });
        }
    }
    
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks. filter(t => t.completed).length;
        const pending = this.tasks.filter(t => ! t.completed).length;
        const overdue = this.tasks.filter(t => this.isTaskOverdue(t)).length;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTasks = this.tasks.filter(task => {
            const taskDate = new Date(task.date);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        }). length;
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Update sidebar stats (desktop)
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('overdueTasks').textContent = overdue;
        document.getElementById('completionRate').textContent = `${completionRate}%`;
        document.getElementById('progressFill').style.width = `${completionRate}%`;
        
        // Update mobile stats
        document.getElementById('todayTasksCount').textContent = todayTasks;
        document.getElementById('pendingTasksCount').textContent = pending;
        document.getElementById('completedTasksCount').textContent = completed;
        document.getElementById('overdueTasksCount').textContent = overdue;
        
        // Update badges
        document.getElementById('badgeCount').textContent = pending;
        document.getElementById('todayBadge').textContent = todayTasks;
    }
    
    setView(view) {
        this. currentView = view;
        const container = document.getElementById('tasksContainer');
        const listBtn = document.getElementById('listViewBtn');
        const cardBtn = document.getElementById('cardViewBtn');
        
        if (view === 'list') {
            container?. classList.remove('card-view');
            container?.classList.add('list-view');
            listBtn?.classList. add('active');
            cardBtn?.classList.remove('active');
        } else {
            container?.classList.remove('list-view');
            container?.classList.add('card-view');
            cardBtn?.classList.add('active');
            listBtn?.classList.remove('active');
        }
    }
    
    exportTasks() {
        const dataStr = JSON.stringify(this. tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-backup-${new Date().toISOString(). split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showToast('Tarefas exportadas!', 'success');
    }
    
    importTasks(file) {
        if (! file) return;
        
        const reader = new FileReader();
        reader. onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (Array.isArray(imported)) {
                    this.tasks = imported;
                    this.saveTasks();
                    this. renderTasks();
                    this.updateStats();
                    this.showToast('Tarefas importadas com sucesso!', 'success');
                } else {
                    this.showToast('Arquivo inválido', 'error');
                }
            } catch (error) {
                this.showToast('Erro ao importar arquivo', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }
    
    getCategoryName(category) {
        const names = {
            work: 'Trabalho',
            personal: 'Pessoal',
            study: 'Estudos',
            health: 'Saúde',
            shopping: 'Compras',
            other: 'Outros'
        };
        return names[category] || category;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container. appendChild(toast);
        
        setTimeout(() => {
            toast. style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TaskScheduler();
});