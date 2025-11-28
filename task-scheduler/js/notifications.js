/**
 * Notifications Manager - Browser notifications for Task Scheduler
 * Handles notification permissions and scheduling
 */

class NotificationManager {
    constructor() {
        this.notificationSupported = 'Notification' in window;
        this.notifiedTasks = new Set(); // Track which tasks have been notified
        this.checkInterval = null;
    }

    /**
     * Initialize notifications system
     */
    async init() {
        if (!this.notificationSupported) {
            console.log('Browser notifications not supported');
            return false;
        }

        // Request permission if not already granted
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return Notification.permission === 'granted';
    }

    /**
     * Check if notifications are enabled
     * @returns {boolean}
     */
    isEnabled() {
        return this.notificationSupported && Notification.permission === 'granted';
    }

    /**
     * Request notification permission
     * @returns {Promise<boolean>}
     */
    async requestPermission() {
        if (!this.notificationSupported) {
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    /**
     * Show a browser notification
     * @param {string} title - Notification title
     * @param {Object} options - Notification options
     */
    show(title, options = {}) {
        if (!this.isEnabled()) {
            return null;
        }

        const defaultOptions = {
            icon: '📋',
            badge: '📋',
            tag: options.tag || 'task-scheduler',
            requireInteraction: false,
            silent: false
        };

        try {
            const notification = new Notification(title, { ...defaultOptions, ...options });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
                if (options.onClick) {
                    options.onClick();
                }
            };

            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000);
            
            return notification;
        } catch (error) {
            console.error('Error showing notification:', error);
            return null;
        }
    }

    /**
     * Start checking for upcoming task deadlines
     * @param {Function} getTasksFn - Function to get tasks
     */
    startDeadlineChecker(getTasksFn) {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Check every minute
        this.checkInterval = setInterval(() => {
            this.checkDeadlines(getTasksFn());
        }, 60000);

        // Also check immediately
        this.checkDeadlines(getTasksFn());
    }

    /**
     * Stop the deadline checker
     */
    stopDeadlineChecker() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    /**
     * Check task deadlines and send notifications
     * @param {Array} tasks - Array of tasks to check
     */
    checkDeadlines(tasks) {
        if (!this.isEnabled()) return;

        const now = new Date();
        
        tasks.forEach(task => {
            if (task.completed || !task.date) return;

            const taskDateTime = this.getTaskDateTime(task);
            if (!taskDateTime) return;

            const diffMs = taskDateTime.getTime() - now.getTime();
            const diffMinutes = Math.floor(diffMs / 60000);

            // Generate unique notification keys
            const key60 = `${task.id}_60`;
            const key30 = `${task.id}_30`;
            const key0 = `${task.id}_0`;

            // Notify 1 hour before (55-65 minutes window)
            if (diffMinutes >= 55 && diffMinutes <= 65 && !this.notifiedTasks.has(key60)) {
                this.notifyUpcoming(task, '1 hora');
                this.notifiedTasks.add(key60);
            }

            // Notify 30 minutes before (25-35 minutes window)
            if (diffMinutes >= 25 && diffMinutes <= 35 && !this.notifiedTasks.has(key30)) {
                this.notifyUpcoming(task, '30 minutos');
                this.notifiedTasks.add(key30);
            }

            // Notify at deadline (-5 to 5 minutes window)
            if (diffMinutes >= -5 && diffMinutes <= 5 && !this.notifiedTasks.has(key0)) {
                this.notifyDeadline(task);
                this.notifiedTasks.add(key0);
            }
        });
    }

    /**
     * Get task datetime as Date object
     * @param {Object} task - Task object
     * @returns {Date|null}
     */
    getTaskDateTime(task) {
        if (!task.date) return null;
        
        const timeStr = task.time || '23:59';
        const dateTimeStr = `${task.date}T${timeStr}`;
        
        try {
            const date = new Date(dateTimeStr);
            return isNaN(date.getTime()) ? null : date;
        } catch {
            return null;
        }
    }

    /**
     * Send notification for upcoming task
     * @param {Object} task - Task object
     * @param {string} timeLeft - Human readable time left
     */
    notifyUpcoming(task, timeLeft) {
        const priorityEmoji = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        this.show(`⏰ Tarefa em ${timeLeft}`, {
            body: `${priorityEmoji[task.priority] || ''} ${task.title}`,
            tag: `upcoming_${task.id}`,
            requireInteraction: true
        });
    }

    /**
     * Send notification for task at deadline
     * @param {Object} task - Task object
     */
    notifyDeadline(task) {
        this.show('⚠️ Tarefa no prazo!', {
            body: task.title,
            tag: `deadline_${task.id}`,
            requireInteraction: true
        });
    }

    /**
     * Send notification for overdue task
     * @param {Object} task - Task object
     */
    notifyOverdue(task) {
        this.show('❌ Tarefa atrasada!', {
            body: task.title,
            tag: `overdue_${task.id}`
        });
    }

    /**
     * Clear notification tracking for a task
     * @param {string} taskId - Task ID
     */
    clearTaskNotifications(taskId) {
        this.notifiedTasks.delete(`${taskId}_60`);
        this.notifiedTasks.delete(`${taskId}_30`);
        this.notifiedTasks.delete(`${taskId}_0`);
    }

    /**
     * Show a general notification
     * @param {string} message - Message to show
     * @param {string} type - Type: success, error, warning, info
     */
    showGeneral(message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        this.show(`${icons[type] || ''} Task Scheduler`, {
            body: message,
            tag: 'general'
        });
    }
}

// Export as global for use in other scripts
window.NotificationManager = NotificationManager;
