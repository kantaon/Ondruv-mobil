// i18n Engine
const i18n = {
    currentLang: 'cs',
    translations: {},

    async init() {
        // Load saved preference or default to Czech
        const savedLang = localStorage.getItem('lang') || 'cs';
        await this.loadLanguage(savedLang);
        this.setupSwitcher();
    },

    async loadLanguage(lang) {
        try {
            const response = await fetch(`/lang/${lang}.json`);
            this.translations = await response.json();
            this.currentLang = lang;
            this.applyTranslations();
            this.updateSwitcher();
            localStorage.setItem('lang', lang);
        } catch (error) {
            console.error(`Failed to load language: ${lang}`, error);
        }
    },

    applyTranslations() {
        // Find all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                el.textContent = translation;
            }
        });
    },

    getTranslation(key) {
        // Navigate nested object using dot notation (e.g., "hero.title")
        return key.split('.').reduce((obj, k) => obj?.[k], this.translations);
    },

    setupSwitcher() {
        const csBtn = document.getElementById('lang-cs');
        const enBtn = document.getElementById('lang-en');

        if (csBtn && enBtn) {
            csBtn.addEventListener('click', () => this.loadLanguage('cs'));
            enBtn.addEventListener('click', () => this.loadLanguage('en'));
        }
    },

    updateSwitcher() {
        const csBtn = document.getElementById('lang-cs');
        const enBtn = document.getElementById('lang-en');

        if (csBtn && enBtn) {
            csBtn.classList.toggle('active', this.currentLang === 'cs');
            enBtn.classList.toggle('active', this.currentLang === 'en');
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});
