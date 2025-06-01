const motivasyonSozleri = [
    { quote: "You can do it", author: "Anonim" },
];

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeButtons();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeButtons();
    }

    updateThemeButtons() {
        const lightBtn = document.getElementById('lightThemeBtn');
        const darkBtn = document.getElementById('darkThemeBtn');
        
        if (lightBtn && darkBtn) {
            lightBtn.classList.toggle('active', this.theme === 'light');
            darkBtn.classList.toggle('active', this.theme === 'dark');
        }
    }

    setupThemeButtons() {
        const lightBtn = document.getElementById('lightThemeBtn');
        const darkBtn = document.getElementById('darkThemeBtn');
        
        if (lightBtn) {
            lightBtn.addEventListener('click', () => {
                this.setTheme('light');
            });
        }
        
        if (darkBtn) {
            darkBtn.addEventListener('click', () => {
                this.setTheme('dark');
            });
        }
    }

    setTheme(theme) {
        this.theme = theme;
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        
        if (window.backgroundManager) {
            window.backgroundManager.updateForTheme();
        }
    }
}

class SettingsManager {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupToggle();
        this.setupClickOutside();
    }

    setupToggle() {
        const settingsToggle = document.getElementById('settingsToggle');
        const settingsPanel = document.getElementById('settingsPanel');
        
        if (settingsToggle) {
            settingsToggle.addEventListener('click', () => {
                this.togglePanel();
            });
        }
    }

    setupClickOutside() {
        document.addEventListener('click', (e) => {
            const settingsPanel = document.getElementById('settingsPanel');
            const settingsToggle = document.getElementById('settingsToggle');
            
            if (this.isOpen && settingsPanel && settingsToggle) {
                if (!settingsPanel.contains(e.target) && !settingsToggle.contains(e.target)) {
                    this.closePanel();
                }
            }
        });
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.add('show');
            this.isOpen = true;
        }
    }

    closePanel() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.classList.remove('show');
            this.isOpen = false;
        }
    }
}

class SearchManager {
    constructor() {
        this.init();
    }

    init() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key.match(/[a-zA-Z0-9\s]/) && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
                if (document.activeElement !== searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    performSearch(query) {
        if (query.trim()) {
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(googleUrl, '_blank');
        }
    }
}

class TimeManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const timeString = now.toLocaleTimeString('tr-TR', timeOptions);
        const dateString = now.toLocaleDateString('tr-TR', dateOptions);
        
        let timeContainer = document.querySelector('.time-container');
        if (!timeContainer) {
            timeContainer = document.createElement('div');
            timeContainer.className = 'time-container';
            
            const searchSection = document.querySelector('.search-section');
            searchSection.parentNode.insertBefore(timeContainer, searchSection);
        }
        
        timeContainer.innerHTML = `
            <div class="current-time">${timeString}</div>
            <div class="current-date">${dateString}</div>
        `;
    }
}

class ShortcutManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if ((e.shiftKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('searchInput').focus();
            }
            
            if ((e.shiftKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                window.settingsManager?.togglePanel();
            }
            
            if (e.key === 'Escape') {
                window.settingsManager?.closePanel();
            }
        });
    }
}

class AnalyticsManager {
    constructor() {
        this.clicks = JSON.parse(localStorage.getItem('linkClicks')) || {};
        this.init();
    }

    init() {
        const linkCards = document.querySelectorAll('.link-card');
        linkCards.forEach(link => {
            link.addEventListener('click', (e) => {
                const title = link.querySelector('.link-title').textContent;
                this.trackClick(title);
            });
        });
    }

    trackClick(linkTitle) {
        this.clicks[linkTitle] = (this.clicks[linkTitle] || 0) + 1;
        localStorage.setItem('linkClicks', JSON.stringify(this.clicks));
    }

    getMostUsedLinks() {
        return Object.entries(this.clicks)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);
    }
}

class MotivationManager {
    constructor() {
        this.quotes = motivasyonSozleri;
        this.showQuote();
    }

    showQuote() {
        const quoteDiv = document.getElementById('motivationQuote');
        if (!quoteDiv || this.quotes.length === 0) return;
        const today = new Date();
        const idx = (today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()) % this.quotes.length;
        const q = this.quotes[idx];
        quoteDiv.innerHTML = `<span>\"${q.quote}\"</span><br><small>- ${q.author}</small>`;
    }
}

class PaletteManager {
    constructor() {
        this.palettes = [
            { name: 'Mavi', color: '#3b82f6', accent: '#2563eb' },
            { name: 'Yeşil', color: '#10b981', accent: '#059669' },
            { name: 'Kırmızı', color: '#ef4444', accent: '#b91c1c' },
            { name: 'Mor', color: '#8b5cf6', accent: '#7c3aed' },
            { name: 'Turuncu', color: '#f59e42', accent: '#ea580c' }
        ];
        this.selected = localStorage.getItem('palette') || 'Mavi';
        this.renderPalettes();
        this.applyPalette();
    }
    renderPalettes() {
        const container = document.getElementById('paletteOptions');
        if (!container) return;
        container.innerHTML = '';
        this.palettes.forEach(palette => {
            const swatch = document.createElement('div');
            swatch.className = 'palette-swatch' + (palette.name === this.selected ? ' selected' : '');
            swatch.title = palette.name;
            swatch.style.background = palette.color;
            swatch.addEventListener('click', () => {
                this.selected = palette.name;
                localStorage.setItem('palette', palette.name);
                this.applyPalette();
                this.renderPalettes();
            });
            container.appendChild(swatch);
        });
    }
    applyPalette() {
        const palette = this.palettes.find(p => p.name === this.selected);
        if (!palette) return;
        document.documentElement.style.setProperty('--accent-color', palette.color);
        document.documentElement.style.setProperty('--accent-hover', palette.accent);
    }
}

class LinkManager {
    constructor() {
        this.linksKey = 'customLinks';
        this.defaultLinks = [
            { title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'logos/chatgpt.png', type: 'img', class: 'chatgpt' },
            { title: 'Google Drive', url: 'https://drive.google.com', icon: 'fab fa-google-drive', type: 'icon', class: 'drive' },
            { title: 'Gemini', url: 'https://gemini.google.com', icon: 'logos/geminilogo.png', type: 'img', class: 'gemini' },
            { title: 'WhatsApp', url: 'https://web.whatsapp.com', icon: 'fab fa-whatsapp', type: 'icon', class: 'whatsapp' },
            { title: 'NinitArch', url: 'https://ninitarch.com', icon: 'fas fa-code', type: 'icon', class: 'ninit' },
            { title: 'YouTube', url: 'https://youtube.com', icon: 'fab fa-youtube', type: 'icon', class: 'youtube' },
            { title: 'Notion', url: 'https://notion.so', icon: 'logos/notionlogo.png', type: 'img', class: 'notion' }
        ];
        this.links = this.loadLinks();
        this.renderLinks();
        this.setupAddLink();
        this.setupDragDrop();
    }
    loadLinks() {
        const saved = localStorage.getItem(this.linksKey);
        if (saved) {
            try { return JSON.parse(saved); } catch { return this.defaultLinks; }
        }
        return this.defaultLinks;
    }
    saveLinks() {
        localStorage.setItem(this.linksKey, JSON.stringify(this.links));
    }
    renderLinks() {
        const grid = document.getElementById('linksGrid');
        if (!grid) return;
        grid.innerHTML = '';
        this.links.forEach((link, idx) => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'link-card ' + (link.class || '');
            a.draggable = true;
            a.dataset.idx = idx;
            a.target = '_blank';
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'link-actions';
            const editBtn = document.createElement('button');
            editBtn.className = 'link-edit';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Linki Düzenle';
            editBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.editLink(idx);
            };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'link-delete';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.title = 'Linki Sil';
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deleteLink(idx);
            };
            
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'link-icon ' + (link.class || '');
            if (link.type === 'img') {
                const img = document.createElement('img');
                img.src = link.icon;
                img.alt = link.title + ' Logo';
                img.className = 'link-logo';
                iconDiv.appendChild(img);
            } else {
                const i = document.createElement('i');
                i.className = link.icon;
                iconDiv.appendChild(i);
            }
            
            const span = document.createElement('span');
            span.className = 'link-title';
            span.textContent = link.title;
            
            a.appendChild(actionsDiv);
            a.appendChild(iconDiv);
            a.appendChild(span);
            grid.appendChild(a);
        });
    }

    deleteLink(index) {
        const link = this.links[index];
        if (confirm(`"${link.title}" linkini silmek istediğinizden emin misiniz?`)) {
            this.links.splice(index, 1);
            this.saveLinks();
            this.renderLinks();
        }
    }

    editLink(index) {
        const link = this.links[index];
        const newTitle = prompt('Yeni başlık:', link.title);
        if (newTitle === null) return; 
        const newUrl = prompt('Yeni URL:', link.url);
        if (newUrl === null) return;
        
        if (newUrl && !/^https?:\/\//.test(newUrl)) {
            alert('Geçerli bir URL girin (https:// ile başlamalı)!');
            return;
        }
        
        if (newTitle.trim()) {
            this.links[index].title = newTitle.trim();
        }
        if (newUrl.trim()) {
            this.links[index].url = newUrl.trim();
        }
        
        this.saveLinks();
        this.renderLinks();
    }
    setupAddLink() {
        const btn = document.getElementById('addLinkBtn');
        if (!btn) return;
        btn.onclick = () => {
            const title = prompt('Link başlığı:');
            if (!title || !title.trim()) return;
            
            const url = prompt('Link adresi (https:// ile):');
            if (!url || !/^https?:\/\//.test(url)) {
                alert('Geçerli bir URL girin (https:// ile başlamalı)!');
                return;
            }
            
            const iconChoice = prompt('İkon türü seçin:\n1 - Font Awesome ikonu (örn: fas fa-star)\n2 - Resim URL\'si\n\nSeçiminizi yapın (1 veya 2):');
            
            let icon = 'fas fa-link';
            let iconType = 'icon';
            
            if (iconChoice === '1') {
                const iconInput = prompt('Font Awesome ikon sınıfı (örn: fas fa-star):', 'fas fa-link');
                if (iconInput && iconInput.trim()) {
                    icon = iconInput.trim();
                }
            } else if (iconChoice === '2') {
                const iconInput = prompt('İkon resmi URL\'si (https:// ile):');
                if (iconInput && /^https?:\/\//.test(iconInput)) {
                    icon = iconInput;
                    iconType = 'img';
                }
            }
            
            this.links.push({ 
                title: title.trim(), 
                url: url.trim(), 
                icon: icon, 
                type: iconType, 
                class: '' 
            });
            this.saveLinks();
            this.renderLinks();
        };
    }
    setupDragDrop() {
        const grid = document.getElementById('linksGrid');
        if (!grid) return;
        let dragIdx = null;
        
        grid.addEventListener('dragstart', e => {
            const linkCard = e.target.closest('.link-card');
            if (linkCard) {
                dragIdx = +linkCard.dataset.idx;
                linkCard.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        
        grid.addEventListener('dragend', e => {
            const linkCard = e.target.closest('.link-card');
            if (linkCard) {
                linkCard.classList.remove('dragging');
            }
        });
        
        grid.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            grid.classList.add('drag-over');
            
            const dragging = document.querySelector('.dragging');
            if (!dragging) return;
            
            const afterElement = getDragAfterElement(grid, e.clientY);
            if (afterElement == null) {
                grid.appendChild(dragging);
            } else {
                grid.insertBefore(dragging, afterElement);
            }
        });
        
        grid.addEventListener('dragleave', (e) => {
            if (!grid.contains(e.relatedTarget)) {
                grid.classList.remove('drag-over');
            }
        });
        
        grid.addEventListener('drop', e => {
            e.preventDefault();
            grid.classList.remove('drag-over');
            
            const newOrder = Array.from(grid.children).map(a => {
                const idx = +a.dataset.idx;
                return this.links[idx];
            });
            
            this.links = newOrder;
            this.saveLinks();
            this.renderLinks();
        });
        
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.link-card:not(.dragging)')];
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }
    }
}

class PomodoroManager {
    constructor() {
        this.defaultTime = 25 * 60;
        this.time = this.defaultTime;
        this.timer = null;
        this.isRunning = false;
        this.timerDiv = document.getElementById('pomodoroTimer');
        this.startBtn = document.getElementById('pomodoroStart');
        this.pauseBtn = document.getElementById('pomodoroPause');
        this.resetBtn = document.getElementById('pomodoroReset');
        this.statsBtn = document.getElementById('pomodoroStats');
        this.statsPanel = document.getElementById('pomodoroStatsPanel');
        this.closeStatsBtn = document.getElementById('closeStats');
        this.statsKey = 'pomodoroStats';
        this.stats = this.loadStats();
        this.init();
    }

    init() {
        if (!this.timerDiv) return;
        this.updateDisplay();
        this.updateStatsDisplay();
        
        this.startBtn.onclick = () => this.start();
        this.pauseBtn.onclick = () => this.pause();
        this.resetBtn.onclick = () => this.reset();
        this.statsBtn.onclick = () => this.toggleStats();
        this.closeStatsBtn.onclick = () => this.hideStats();
        
        document.addEventListener('click', (e) => {
            if (this.statsPanel && this.statsPanel.classList.contains('show')) {
                if (!this.statsPanel.contains(e.target) && !this.statsBtn.contains(e.target)) {
                    this.hideStats();
                }
            }
        });
    }

    loadStats() {
        const saved = localStorage.getItem(this.statsKey);
        if (saved) {
            try { 
                return JSON.parse(saved); 
            } catch { 
                return this.getDefaultStats(); 
            }
        }
        return this.getDefaultStats();
    }

    getDefaultStats() {
        return {
            total: 0,
            daily: {},
            weekly: {},
            bestDay: { date: null, count: 0 }
        };
    }

    saveStats() {
        localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
    }

    updateDisplay() {
        const min = String(Math.floor(this.time / 60)).padStart(2, '0');
        const sec = String(this.time % 60).padStart(2, '0');
        this.timerDiv.textContent = `${min}:${sec}`;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.timer = setInterval(() => {
            if (this.time > 0) {
                this.time--;
                this.updateDisplay();
            } else {
                this.pause();
                this.completedPomodoro();
                alert('Pomodoro tamamlandı!');
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);
    }

    reset() {
        this.pause();
        this.time = this.defaultTime;
        this.updateDisplay();
    }

    completedPomodoro() {
        const today = this.getTodayKey();
        const week = this.getWeekKey();
        
        this.stats.daily[today] = (this.stats.daily[today] || 0) + 1;
        
        this.stats.weekly[week] = (this.stats.weekly[week] || 0) + 1;
        
        this.stats.total += 1;
        
        if (this.stats.daily[today] > this.stats.bestDay.count) {
            this.stats.bestDay = {
                date: today,
                count: this.stats.daily[today]
            };
        }
        
        this.saveStats();
        this.updateStatsDisplay();
        this.reset();
    }

    getTodayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    getWeekKey() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - startOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNumber}`;
    }

    getTodayCount() {
        return this.stats.daily[this.getTodayKey()] || 0;
    }

    getWeekCount() {
        return this.stats.weekly[this.getWeekKey()] || 0;
    }

    getBestDayFormatted() {
        if (!this.stats.bestDay.date) return '-';
        const date = new Date(this.stats.bestDay.date);
        return `${date.toLocaleDateString('tr-TR')} (${this.stats.bestDay.count})`;
    }

    updateStatsDisplay() {
        const todayCountEl = document.getElementById('todayCount');
        const weekCountEl = document.getElementById('weekCount');
        const totalCountEl = document.getElementById('totalCount');
        const bestDayEl = document.getElementById('bestDay');

        if (todayCountEl) todayCountEl.textContent = this.getTodayCount();
        if (weekCountEl) weekCountEl.textContent = this.getWeekCount();
        if (totalCountEl) totalCountEl.textContent = this.stats.total;
        if (bestDayEl) bestDayEl.textContent = this.getBestDayFormatted();
    }

    toggleStats() {
        if (this.statsPanel.classList.contains('show')) {
            this.hideStats();
        } else {
            this.showStats();
        }
    }

    showStats() {
        this.updateStatsDisplay();
        this.statsPanel.classList.add('show');
    }

    hideStats() {
        this.statsPanel.classList.remove('show');
    }
}

class BackgroundManager {
    constructor() {
        this.currentBackground = localStorage.getItem('background') || 'default';
        this.backgrounds = {
            'default': {
                name: 'Varsayılan',
                light: { primary: '#ffffff', secondary: '#f8fafc' },
                dark: { primary: '#0f172a', secondary: '#1e293b' }
            },
            'warm': {
                name: 'Sıcak',
                light: { primary: '#fef7ed', secondary: '#fed7aa' },
                dark: { primary: '#1c1917', secondary: '#292524' }
            },
            'cool': {
                name: 'Soğuk',
                light: { primary: '#f0f9ff', secondary: '#e0f2fe' },
                dark: { primary: '#0c1219', secondary: '#1e293b' }
            },
            'nature': {
                name: 'Doğa',
                light: { primary: '#f0fdf4', secondary: '#dcfce7' },
                dark: { primary: '#14532d', secondary: '#166534' }
            },
            'sunset': {
                name: 'Gün Batımı',
                light: { primary: '#fff7ed', secondary: '#fed7aa' },
                dark: { primary: '#431407', secondary: '#7c2d12' }
            },
            'ocean': {
                name: 'Okyanus',
                light: { primary: '#f0f9ff', secondary: '#bae6fd' },
                dark: { primary: '#0c4a6e', secondary: '#0284c7' }
            }
        };
        this.init();
    }

    init() {
        this.setupBackgroundOptions();
        this.applyBackground();
    }

    setupBackgroundOptions() {
        const container = document.getElementById('backgroundOptions');
        if (!container) return;

        container.innerHTML = '';
        
        Object.entries(this.backgrounds).forEach(([key, bg]) => {
            const swatch = document.createElement('div');
            swatch.className = `background-swatch ${key === this.currentBackground ? 'selected' : ''}`;
            swatch.title = bg.name;
            swatch.dataset.background = key;
            
            if (key === 'default') {
                swatch.style.background = 'linear-gradient(135deg, #ffffff, #f8fafc)';
            } else {
                const colors = bg.light;
                swatch.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
            }
            
            swatch.addEventListener('click', () => {
                this.setBackground(key);
            });
            
            container.appendChild(swatch);
        });
    }

    setBackground(backgroundKey) {
        if (!this.backgrounds[backgroundKey]) return;
        
        this.currentBackground = backgroundKey;
        localStorage.setItem('background', backgroundKey);
        this.applyBackground();
        this.updateSelection();
    }

    applyBackground() {
        const background = this.backgrounds[this.currentBackground];
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const colors = isDark ? background.dark : background.light;
        
        document.documentElement.style.setProperty('--custom-bg-primary', colors.primary);
        document.documentElement.style.setProperty('--custom-bg-secondary', colors.secondary);
    }

    updateSelection() {
        const swatches = document.querySelectorAll('.background-swatch');
        swatches.forEach(swatch => {
            swatch.classList.toggle('selected', swatch.dataset.background === this.currentBackground);
        });
    }

    updateForTheme() {
        this.applyBackground();
    }
}


console.log('Script loading started...');

function initializeApp() {
    console.log('Initializing app...');
    try {
        console.log('Creating managers...');
        window.themeManager = new ThemeManager();
        window.settingsManager = new SettingsManager();
        window.searchManager = new SearchManager();
        window.timeManager = new TimeManager();
        window.shortcutManager = new ShortcutManager();
        window.analyticsManager = new AnalyticsManager();
        window.motivationManager = new MotivationManager();
        window.paletteManager = new PaletteManager();
        window.backgroundManager = new BackgroundManager();
        window.linkManager = new LinkManager();
        window.pomodoroManager = new PomodoroManager();
        
        addSmoothScrolling();
        showWelcomeMessage();
        
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        document.body.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('App initialization failed:', error);
        // Basic fallback
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
        alert('Sayfa yüklenirken bir hata oluştu. Konsolu kontrol edin.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function addSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

function showWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
        greeting = 'Günaydın! ☀️';
    } else if (hour < 18) {
        greeting = 'İyi günler! 🌤️';
    } else {
        greeting = 'İyi akşamlar! 🌙';
    }
    
    const welcomeDiv = document.createElement('div');
    welcomeDiv.textContent = greeting;
    welcomeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(welcomeDiv);
    
    setTimeout(() => {
        welcomeDiv.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        welcomeDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(welcomeDiv);
        }, 300);
    }, 3000);
}
