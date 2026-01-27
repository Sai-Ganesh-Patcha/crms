/**
 * CRMS UI Utilities
 * Professional toast notifications and UI helpers
 */

const UI = {
    // Toast Container (will be created on first use)
    toastContainer: null,

    /**
     * Initialize toast container
     */
    initToasts() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    },

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - success, error, warning, info
     * @param {string} title - Optional title
     * @param {number} duration - Duration in ms (default 4000)
     */
    toast(message, type = 'info', title = '', duration = 4000) {
        this.initToasts();

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const titles = {
            success: title || 'Success',
            error: title || 'Error',
            warning: title || 'Warning',
            info: title || 'Info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
            <div class="toast-progress"></div>
        `;

        // Close button handler
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismissToast(toast);
        });

        this.toastContainer.appendChild(toast);

        // Auto dismiss
        setTimeout(() => {
            this.dismissToast(toast);
        }, duration);
    },

    /**
     * Dismiss a toast
     */
    dismissToast(toast) {
        if (!toast || !toast.parentNode) return;
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    },

    /**
     * Success toast shorthand
     */
    success(message, title = '') {
        this.toast(message, 'success', title);
    },

    /**
     * Error toast shorthand
     */
    error(message, title = '') {
        this.toast(message, 'error', title);
    },

    /**
     * Warning toast shorthand
     */
    warning(message, title = '') {
        this.toast(message, 'warning', title);
    },

    /**
     * Info toast shorthand
     */
    info(message, title = '') {
        this.toast(message, 'info', title);
    },

    /**
     * Confirm dialog (replacement for window.confirm)
     */
    async confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay active';
            overlay.innerHTML = `
                <div class="modal animate-scaleIn" style="max-width:400px">
                    <div class="modal-header">
                        <h3>${title}</h3>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="confirmNo">Cancel</button>
                        <button class="btn btn-primary" id="confirmYes">Confirm</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('#confirmYes').addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(true);
            });

            overlay.querySelector('#confirmNo').addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            });
        });
    },

    /**
     * Show loading on button
     */
    btnLoading(btn, loading = true) {
        if (loading) {
            btn.classList.add('btn-loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('btn-loading');
            btn.disabled = false;
        }
    },

    /**
     * Start real-time clock
     */
    startClock(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const update = () => {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };
        update();
        setInterval(update, 1000);
    }
};

// Override default alert for better UX (optional)
window.showToast = UI.toast.bind(UI);
window.showSuccess = UI.success.bind(UI);
window.showError = UI.error.bind(UI);
window.showWarning = UI.warning.bind(UI);
window.showInfo = UI.info.bind(UI);
