/**
 * Notification Manager
 * Handles browser notifications and reminders
 */

class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.scheduledNotifications = new Map();
    }
    
    init() {
        this.checkPermission();
        this.loadScheduledNotifications();
        this.startNotificationChecker();
    }
    
    checkPermission() {
        if (! ('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return false;
        }
        
        this.permission = Notification.permission;
        return this.permission === 'granted';
    }
    
    async requestPermission() {
        if (! ('Notification' in window)) {
            this.showAlert('Seu navegador não suporta notificações', 'error');
            return false;
        }
        
        if (this.permission === 'granted') {
            this.showAlert('Notificações já estão ativadas!  ✓', 'success');
            return true;
        }
        
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                this.showAlert('Notificações ativadas com sucesso! 🔔', 'success');
                this.showWelcomeNotification();
                return true;
            } else {
                this.showAlert('Permissão de notificação negada', 'warning');
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            this. showAlert('Erro ao solicitar permissão', 'error');
            return false;
        }
    }
    
    showWelcomeNotification() {
        this.showNotification(
            'Notificações Ativadas! 🎉',
            'Você receberá lembretes sobre suas tarefas.',
            { tag: 'welcome' }
        );
    }
    
    showNotification(title, body, options = {}) {
        if (!this.checkPermission()) {
            console.log('Notification permission not granted');
            return;
        }
        
        const defaultOptions = {
            body: body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-96x96.png',
            vibrate: [200, 100, 200],
            timestamp: Date.now(),
            requireInteraction: false,
            ...options
        };
        
        try {
            const notification = new Notification(title, defaultOptions);
            
            notification.onclick = () => {
                window.focus();
                notification.close();
                
                // If task ID is provided, open it
                if (options.data?. taskId) {
                    this.openTask(options.data.taskId);
                }
            };
            
            // Auto close after 5 seconds
            setTimeout(() => notification.close(), 5000);
            
            return notification;
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }
    
    scheduleNotification(task) {
        if (!task.date) return;
        
        const taskDateTime = this.getTaskDateTime(task);
        const now = new Date();
        
        // Schedule notification 30 minutes before
        const notificationTime = new Date(taskDateTime. getTime() - 30 * 60 * 1000);
        
        if (notificationTime > now) {
            const timeUntilNotification = notificationTime. getTime() - now.getTime();
            
            const timeoutId = setTimeout(() => {
                this.showNotification(
                    '⏰ Lembrete de Tarefa',
                    `${task.title} está programada para daqui a 30 minutos!`,
                    {
                        tag: `task-reminder-${task.id}`,
                        data: { taskId: task.id }
                    }
                );
            }, timeUntilNotification);
            
            this.scheduledNotifications.set(task.id, {
                timeoutId,
                notificationTime: notificationTime. toISOString(),
                taskTitle: task.title
            });
            
            this.saveScheduledNotifications();
        }
        
        // Schedule notification at exact time
        if (taskDateTime > now) {
            const timeUntilTask = taskDateTime.getTime() - now.getTime();
            
            setTimeout(() => {
                this.showNotification(
                    '🔔 Hora da Tarefa! ',
                    `${task. title}`,
                    {
                        tag: `task-due-${task.id}`,
                        data: { taskId: task.id },
                        requireInteraction: true
                    }
                );
            }, timeUntilTask);
        }
    }
    
    cancelNotification(taskId) {
        const scheduled = this.scheduledNotifications. get(taskId);
        if (scheduled) {
            clearTimeout(scheduled.timeoutId);
            this.scheduledNotifications. delete(taskId);
            this.saveScheduledNotifications();
        }
    }
    
    getTaskDateTime(task) {
        const dateTime = new Date(task.date);
        
        if (task.time) {
            const [hours, minutes] = task.time.split(':');
            dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            dateTime. setHours(9, 0, 0, 0); // Default to 9 AM
        }
        
        return dateTime;
    }
    
    startNotificationChecker() {
        // Check every 5 minutes for tasks that need notifications
        setInterval(() => {
            this.checkPendingNotifications();
        }, 5 * 60 * 1000);
        
        // Initial check
        this.checkPendingNotifications();
    }
    
    checkPendingNotifications() {
        if (! this.checkPermission()) return;
        
        const tasks = this.getTasks();
        const now = new Date();
        
        tasks. forEach(task => {
            if (task.completed) return;
            
            const taskDateTime = this.getTaskDateTime(task);
            const timeDiff = taskDateTime.getTime() - now.getTime();
            
            // Notify 1 hour before
            if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
                const minutesUntil = Math.round(timeDiff / 60 / 1000);
                if (minutesUntil === 60 || minutesUntil === 30 || minutesUntil === 15 || minutesUntil === 5) {
                    this. showNotification(
                        '⏰ Lembrete',
                        `${task.title} em ${minutesUntil} minutos`,
                        {
                            tag: `reminder-${task.id}-${minutesUntil}`,
                            data: { taskId: task.id }
                        }
                    );
                }
            }
            
            // Notify if overdue
            if (timeDiff < 0 && timeDiff > -60 * 60 * 1000) {
                const minutesOverdue = Math.abs(Math.round(timeDiff / 60 / 1000));
                if (minutesOverdue % 15 === 0) { // Every 15 minutes
                    this.showNotification(
                        '⚠️ Tarefa Atrasada',
                        `${task.title} está ${minutesOverdue} minutos atrasada`,
                        {
                            tag: `overdue-${task.id}`,
                            data: { taskId: task.id },
                            requireInteraction: true
                        }
                    );
                }
            }
        });
    }
    
    getTasks() {
        try {
            const tasksJson = localStorage.getItem('tasks');
            return tasksJson ? JSON.parse(tasksJson) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }
    
    openTask(taskId) {
        // Trigger opening task modal in main app
        if (window.app) {
            window.app. openTaskModal(taskId);
        }
    }
    
    saveScheduledNotifications() {
        const data = Array.from(this.scheduledNotifications.entries()).map(([id, info]) => ({
            id,
            notificationTime: info.notificationTime,
            taskTitle: info. taskTitle
        }));
        localStorage.setItem('scheduledNotifications', JSON.stringify(data));
    }
    
    loadScheduledNotifications() {
        try {
            const saved = localStorage.getItem('scheduledNotifications');
            if (saved) {
                const data = JSON.parse(saved);
                // Clear old notifications and reschedule active ones
                this.scheduledNotifications.clear();
                // Reschedule would happen when tasks are loaded in main app
            }
        } catch (error) {
            console. error('Error loading scheduled notifications:', error);
        }
    }
    
    showAlert(message, type = 'info') {
        if (window.app) {
            window.app.showToast(message, type);
        } else {
            console.log(`[${type. toUpperCase()}] ${message}`);
        }
    }
    
    // Daily summary notification
    scheduleDailySummary() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0); // 8 AM next day
        
        const timeUntilSummary = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            this.sendDailySummary();
            // Reschedule for next day
            this.scheduleDailySummary();
        }, timeUntilSummary);
    }
    
    sendDailySummary() {
        const tasks = this.getTasks();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate. getTime() === today.getTime();
        });
        
        const pendingToday = todayTasks.filter(t => ! t.completed). length;
        
        if (pendingToday > 0) {
            this. showNotification(
                '📋 Resumo do Dia',
                `Você tem ${pendingToday} tarefa(s) pendente(s) para hoje!`,
                { tag: 'daily-summary' }
            );
        }
    }
}

// Initialize and expose globally
window.NotificationManager = new NotificationManager();