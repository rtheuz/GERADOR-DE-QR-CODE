/**
 * Push Notifications for PWA
 * Service Worker integration for push notifications
 */

class PushNotificationManager {
    constructor() {
        this.registration = null;
        this.subscription = null;
    }
    
    async init() {
        if (! ('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.warn('Push notifications not supported');
            return false;
        }
        
        try {
            // Wait for service worker to be ready
            this.registration = await navigator.serviceWorker.ready;
            await this.checkSubscription();
            return true;
        } catch (error) {
            console.error('Error initializing push notifications:', error);
            return false;
        }
    }
    
    async checkSubscription() {
        try {
            this.subscription = await this.registration. pushManager.getSubscription();
            return this.subscription !== null;
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    }
    
    async subscribe() {
        if (!this. registration) {
            console.error('Service worker not registered');
            return false;
        }
        
        try {
            const permission = await Notification.requestPermission();
            
            if (permission !== 'granted') {
                console.log('Notification permission denied');
                return false;
            }
            
            // Create subscription
            const vapidPublicKey = this.getVapidPublicKey();
            
            this.subscription = await this. registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
            });
            
            // Save subscription to server (if you have a backend)
            await this.saveSubscription(this.subscription);
            
            console.log('Push notification subscription successful');
            return true;
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            return false;
        }
    }
    
    async unsubscribe() {
        if (! this.subscription) {
            return true;
        }
        
        try {
            await this.subscription.unsubscribe();
            this.subscription = null;
            console.log('Unsubscribed from push notifications');
            return true;
        } catch (error) {
            console.error('Error unsubscribing:', error);
            return false;
        }
    }
    
    getVapidPublicKey() {
        // Replace with your actual VAPID public key
        // Generate at: https://vapidkeys.com/
        return 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrLEmGO5BPqL8BqhHNPkRfRbuUBcMxdGU6M-FQjCi6Z_rvTnXGg';
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    async saveSubscription(subscription) {
        // If you have a backend, send subscription there
        // For now, just save locally
        localStorage.setItem('pushSubscription', JSON.stringify(subscription));
        
        // Example: send to your server
        /*
        try {
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscription)
            });
        } catch (error) {
            console.error('Error saving subscription to server:', error);
        }
        */
    }
    
    async sendTestNotification() {
        if (! this.subscription) {
            console.log('No active subscription');
            return;
        }
        
        // This would normally come from your server
        // For testing, we'll trigger a local notification
        if (this.registration) {
            this.registration.showNotification('Teste de Notificação', {
                body: 'As notificações estão funcionando perfeitamente!  🎉',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-96x96.png',
                vibrate: [200, 100, 200],
                tag: 'test-notification',
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                }
            });
        }
    }
}

// Initialize
const pushManager = new PushNotificationManager();

// Auto-initialize when service worker is ready
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(() => {
        pushManager.init();
    });
}

// Expose globally
window.PushNotificationManager = pushManager;