/**
 * PWA Installation Handler
 * Manages app installation prompts
 */

class PWAInstaller {
    constructor() {
        this. deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }
    
    init() {
        this.checkIfInstalled();
        this.setupInstallPrompt();
        this.setupInstallButton();
    }
    
    checkIfInstalled() {
        // Check if running as installed PWA
        if (window.matchMedia('(display-mode: standalone)'). matches) {
            this.isInstalled = true;
            console.log('App is running as PWA');
        }
        
        // Check if already installed
        if (localStorage.getItem('pwaInstalled') === 'true') {
            this.isInstalled = true;
        }
        
        // iOS specific check
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('App is running as PWA on iOS');
        }
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent default install prompt
            e.preventDefault();
            
            // Store the event for later use
            this.deferredPrompt = e;
            
            console.log('Install prompt available');
            
            // Show custom install UI
            this.showInstallBanner();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.isInstalled = true;
            localStorage.setItem('pwaInstalled', 'true');
            this.hideInstallBanner();
            this.showToast('App instalado com sucesso!  🎉', 'success');
        });
    }
    
    setupInstallButton() {
        // If you add an install button in your HTML
        const installBtn = document.getElementById('installAppBtn');
        
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.promptInstall();
            });
        }
    }
    
    async promptInstall() {
        if (! this.deferredPrompt) {
            console.log('Install prompt not available');
            this.showInstallInstructions();
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for user response
        const { outcome } = await this.deferredPrompt. userChoice;
        
        console.log(`User response: ${outcome}`);
        
        if (outcome === 'accepted') {
            this.showToast('Instalando aplicativo...', 'info');
        } else {
            this.showToast('Instalação cancelada', 'info');
        }
        
        // Clear the prompt
        this.deferredPrompt = null;
        this.hideInstallBanner();
    }
    
    showInstallBanner() {
        if (this.isInstalled) return;
        
        // Check if user dismissed banner before
        if (localStorage.getItem('installBannerDismissed') === 'true') {
            return;
        }
        
        // Create banner
        const banner = document. createElement('div');
        banner. id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-icon">📱</div>
                <div class="pwa-banner-text">
                    <strong>Instalar Aplicativo</strong>
                    <p>Instale para acesso rápido e notificações</p>
                </div>
                <div class="pwa-banner-actions">
                    <button class="btn btn-primary btn-sm" id="pwa-install-btn">Instalar</button>
                    <button class="btn btn-icon btn-sm" id="pwa-close-btn">✕</button>
                </div>
            </div>
        `;
        
        document. body.appendChild(banner);
        
        // Add styles
        this.addBannerStyles();
        
        // Setup event listeners
        document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
            this.promptInstall();
        });
        
        document.getElementById('pwa-close-btn')?.addEventListener('click', () => {
            this.hideInstallBanner();
            localStorage.setItem('installBannerDismissed', 'true');
        });
        
        // Animate in
        setTimeout(() => {
            banner.classList.add('visible');
        }, 100);
    }
    
    hideInstallBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 300);
        }
    }
    
    addBannerStyles() {
        if (document.getElementById('pwa-banner-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'pwa-banner-styles';
        style.textContent = `
            .pwa-install-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--bg-primary);
                border-top: 1px solid var(--border-color);
                box-shadow: var(--shadow-xl);
                padding: var(--spacing-lg);
                z-index: var(--z-fixed);
                transform: translateY(100%);
                transition: transform var(--transition-base);
            }
            
            .pwa-install-banner. visible {
                transform: translateY(0);
            }
            
            .pwa-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
            }
            
            . pwa-banner-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }
            
            .pwa-banner-text {
                flex: 1;
            }
            
            .pwa-banner-text strong {
                display: block;
                margin-bottom: 0.25rem;
            }
            
            .pwa-banner-text p {
                margin: 0;
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
            
            .pwa-banner-actions {
                display: flex;
                gap: var(--spacing-sm);
                align-items: center;
            }
            
            .btn-sm {
                padding: var(--spacing-xs) var(--spacing-md);
                font-size: var(--font-size-sm);
            }
            
            @media (max-width: 768px) {
                .pwa-banner-content {
                    flex-wrap: wrap;
                }
                
                .pwa-banner-actions {
                    width: 100%;
                    justify-content: stretch;
                }
                
                .pwa-banner-actions button {
                    flex: 1;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    showInstallInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <p><strong>Para instalar no iOS:</strong></p>
                <ol>
                    <li>Toque no botão "Compartilhar" 📤</li>
                    <li>Role e toque em "Adicionar à Tela Inicial" ➕</li>
                    <li>Toque em "Adicionar"</li>
                </ol>
            `;
        } else if (isAndroid) {
            instructions = `
                <p><strong>Para instalar no Android:</strong></p>
                <ol>
                    <li>Toque no menu (⋮) no navegador</li>
                    <li>Toque em "Instalar aplicativo" ou "Adicionar à tela inicial"</li>
                    <li>Confirme a instalação</li>
                </ol>
            `;
        } else {
            instructions = `
                <p><strong>Para instalar no Desktop:</strong></p>
                <ol>
                    <li>Clique no ícone de instalação na barra de endereço</li>
                    <li>Ou use o menu do navegador e selecione "Instalar"</li>
                </ol>
            `;
        }
        
        this.showModal('Como Instalar o App', instructions);
    }
    
    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal modal-sm">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this. closest('.modal-overlay').remove()">Entendi</button>
                </div>
            </div>
        `;
        
        document. body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    showToast(message, type = 'info') {
        if (window.app) {
            window.app. showToast(message, type);
        } else {
            console.log(message);
        }
    }
}

// Initialize
const pwaInstaller = new PWAInstaller();
window.PWAInstaller = pwaInstaller;