// js/utils.js
// الدوال المساعدة لنظام البنك - مع تحديث ديزاين التنبيهات

const BankUtils = {
    // إظهار رسالة تحميل
    showLoading: function(show, message = 'جاري التحميل...') {
        let loadingEl = document.getElementById('global-loading');
        
        if (show) {
            if (!loadingEl) {
                loadingEl = document.createElement('div');
                loadingEl.id = 'global-loading';
                loadingEl.className = 'loading-overlay';
                loadingEl.innerHTML = `
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <div class="loading-text">${message}</div>
                    </div>
                `;
                document.body.appendChild(loadingEl);
            } else {
                const loadingText = loadingEl.querySelector('.loading-text');
                if (loadingText) loadingText.textContent = message;
                loadingEl.style.display = 'flex';
            }
        } else {
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
        }
    },
    
    // إظهار تنبيه بنفس ديزاين الصفحة
    showAlert: function(message, type = 'info', duration = 5000) {
        // إزالة أي تنبيهات سابقة
        const existingAlert = document.querySelector('.custom-alert-message');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // إنشاء عنصر التنبيه
        const alert = document.createElement('div');
        alert.className = `custom-alert-message custom-alert-${type}`;
        
        // تحديد الأيقونة بناءً على نوع التنبيه
        let icon = 'info-circle';
        let iconColor = '#4fc3f7'; // اللون الأساسي للـ info
        
        if (type === 'success') {
            icon = 'check-circle';
            iconColor = '#10b981'; // أخضر
        } else if (type === 'error') {
            icon = 'exclamation-circle';
            iconColor = '#ef4444'; // أحمر
        } else if (type === 'warning') {
            icon = 'exclamation-triangle';
            iconColor = '#f59e0b'; // برتقالي
        }
        
        alert.innerHTML = `
            <div class="custom-alert-content">
                <div class="custom-alert-icon" style="color: ${iconColor};">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="custom-alert-text">${message}</div>
                <button class="custom-alert-close" onclick="this.closest('.custom-alert-message').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // إضافة التنسيقات المدمجة (style مباشر لضمان التطبيق)
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, rgba(10, 36, 56, 0.98) 0%, rgba(8, 27, 41, 0.99) 100%);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(79, 195, 247, 0.2);
            padding: 0;
            z-index: 10000;
            animation: customAlertSlideDown 0.3s ease;
            min-width: 300px;
            max-width: 500px;
            border-right: 4px solid ${iconColor};
            font-family: 'Cairo', sans-serif;
        `;
        
        const contentDiv = alert.querySelector('.custom-alert-content');
        contentDiv.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
        `;
        
        const iconDiv = alert.querySelector('.custom-alert-icon');
        iconDiv.style.cssText = `
            font-size: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const textDiv = alert.querySelector('.custom-alert-text');
        textDiv.style.cssText = `
            flex: 1;
            font-weight: 500;
            color: #a0d2db;
            font-size: 14px;
            line-height: 1.5;
        `;
        
        const closeBtn = alert.querySelector('.custom-alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #a0d2db;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            transition: all 0.3s ease;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        closeBtn.onmouseover = () => {
            closeBtn.style.backgroundColor = 'rgba(79, 195, 247, 0.1)';
            closeBtn.style.color = '#4fc3f7';
        };
        closeBtn.onmouseout = () => {
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.color = '#a0d2db';
        };
        
        document.body.appendChild(alert);
        
        // إضافة حركة السقوط في CSS إذا لم تكن موجودة
        if (!document.querySelector('#customAlertStyles')) {
            const style = document.createElement('style');
            style.id = 'customAlertStyles';
            style.textContent = `
                @keyframes customAlertSlideDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                @keyframes customAlertFadeOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                }
                .custom-alert-message {
                    transition: all 0.3s ease;
                }
                .custom-alert-message.fade-out {
                    animation: customAlertFadeOut 0.3s ease forwards;
                }
            `;
            document.head.appendChild(style);
        }
        
        // إزالة التنبيه تلقائياً بعد المدة المحددة
        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.classList.add('fade-out');
                    setTimeout(() => {
                        if (alert.parentNode) alert.remove();
                    }, 300);
                }
            }, duration);
        }
    },
    
    // تنسيق التاريخ
    formatDate: function(dateStr, format = 'full') {
        const date = new Date(dateStr);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('ar-EG', options);
    },
    
    // تنسيق الوقت النسبي (منذ...)
    timeAgo: function(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        return this.formatDate(dateStr);
    },
    
    // إغلاق جميع النوافذ المنبثقة
    closeAllModals: function() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.remove();
            }
        });
    },
    
    // تبديل اتجاه الصفحة (عربي/إنجليزي)
    toggleLanguage: function() {
        const body = document.body;
        const html = document.documentElement;
        const langBtn = document.getElementById('languageToggle');
        
        if (body.classList.contains('rtl')) {
            body.classList.remove('rtl');
            body.classList.add('ltr');
            html.dir = 'ltr';
            html.lang = 'en';
            if (langBtn) langBtn.innerHTML = '<i class="fas fa-language"></i> العربية';
            BankData.appState.currentLanguage = 'en';
        } else {
            body.classList.remove('ltr');
            body.classList.add('rtl');
            html.dir = 'rtl';
            html.lang = 'ar';
            if (langBtn) langBtn.innerHTML = '<i class="fas fa-language"></i> English';
            BankData.appState.currentLanguage = 'ar';
        }
        
        // حفظ التفضيل
        localStorage.setItem('bankLanguage', BankData.appState.currentLanguage);
    },
    
    // تهيئة اللغة المحفوظة
    initLanguage: function() {
        const savedLang = localStorage.getItem('bankLanguage');
        const body = document.body;
        const html = document.documentElement;
        
        if (savedLang === 'en') {
            body.classList.remove('rtl');
            body.classList.add('ltr');
            html.dir = 'ltr';
            html.lang = 'en';
            BankData.appState.currentLanguage = 'en';
        } else {
            body.classList.remove('ltr');
            body.classList.add('rtl');
            html.dir = 'rtl';
            html.lang = 'ar';
            BankData.appState.currentLanguage = 'ar';
        }
    }
};

// جعل الدوال متاحة عالمياً
window.BankUtils = BankUtils;