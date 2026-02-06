// app.js - Main application logic

class ProPAApp {
    constructor() {
        this.currentResults = [];
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.updateUserUI();
    }

    // Helper method to escape HTML and prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Helper method to validate and sanitize URLs
    isValidUrl(url) {
        try {
            const urlObj = new URL(url);
            // Only allow http and https protocols
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
            return false;
        }
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.performSearch());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Filter toggle
        document.getElementById('filterToggle').addEventListener('click', () => {
            this.toggleFilters();
        });

        // Filter actions
        document.getElementById('applyFilters').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Export buttons
        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            exportManager.exportToPDF();
        });

        document.getElementById('exportExcelBtn').addEventListener('click', () => {
            exportManager.exportToExcel();
        });

        document.getElementById('exportWordBtn').addEventListener('click', () => {
            exportManager.exportToWord();
        });

        // Analytics modal
        document.getElementById('analyticsBtn').addEventListener('click', () => {
            this.showAnalyticsModal();
        });

        document.getElementById('closeAnalytics').addEventListener('click', () => {
            this.closeModal('analyticsModal');
        });

        document.getElementById('exportAnalytics').addEventListener('click', () => {
            analyticsManager.exportAnalytics();
            this.showToast('Analisi esportate con successo!', 'success');
        });

        // Analytics tabs
        document.querySelectorAll('.analytics-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAnalyticsTab(e.target.dataset.tab);
            });
        });

        // History modal
        document.getElementById('historyBtn').addEventListener('click', () => {
            this.showHistoryModal();
        });

        document.getElementById('closeHistory').addEventListener('click', () => {
            this.closeModal('historyModal');
        });

        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });

        // Bookmarks modal
        document.getElementById('bookmarksBtn').addEventListener('click', () => {
            this.showBookmarksModal();
        });

        document.getElementById('closeBookmarks').addEventListener('click', () => {
            this.closeModal('bookmarksModal');
        });

        // Close modals when clicking outside
        ['historyModal', 'bookmarksModal', 'loginModal', 'registerModal', 'userModal', 'analyticsModal'].forEach(modalId => {
            document.getElementById(modalId).addEventListener('click', (e) => {
                if (e.target.id === modalId) {
                    this.closeModal(modalId);
                }
            });
        });

        // Event delegation for result title clicks
        document.addEventListener('click', (e) => {
            // Handle result title clicks (in results section)
            const resultTitle = e.target.closest('.result-title');
            if (resultTitle && resultTitle.dataset.url) {
                e.preventDefault();
                const url = resultTitle.dataset.url;
                if (this.isValidUrl(url)) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
                return;
            }
        });
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        
        if (!query) {
            this.showToast('Inserisci un termine di ricerca', 'error');
            return;
        }

        // Get filters
        this.currentFilters = {
            source: document.getElementById('sourceFilter').value,
            category: document.getElementById('categoryFilter').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value
        };

        // Show loading
        this.showLoading(true);
        document.getElementById('resultsSection').classList.add('active');

        try {
            // Perform search
            const searchResult = await searchEngine.search(query, this.currentFilters);
            this.currentResults = searchResult.results;

            // Save to history
            storageManager.addToHistory(query, this.currentFilters);

            // Display results
            this.displayResults(searchResult);

            // Update export manager
            exportManager.setResults(this.currentResults);

            // Update analytics manager
            analyticsManager.setResults(this.currentResults);

        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Errore durante la ricerca', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(searchResult) {
        const container = document.getElementById('resultsContainer');
        const title = document.getElementById('resultsTitle');

        title.textContent = `${searchResult.total} risultati trovati`;

        if (searchResult.results.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Nessun risultato trovato</h3>
                    <p>Prova a modificare i termini di ricerca o i filtri</p>
                </div>
            `;
            return;
        }

        container.innerHTML = searchResult.results.map(result => this.createResultCard(result)).join('');

        // Add bookmark listeners
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resultId = parseInt(e.currentTarget.dataset.id);
                const result = this.currentResults.find(r => r.id === resultId);
                this.toggleBookmark(result, e.currentTarget);
            });
        });
    }

    createResultCard(result) {
        const sourceInfo = searchEngine.getSourceInfo(result.source);
        const isBookmarked = storageManager.isBookmarked(result.id);
        
        return `
            <div class="result-item">
                <div class="result-header">
                    <div>
                        <h4 class="result-title" data-url="${this.escapeHtml(result.url)}">${this.escapeHtml(result.title)}</h4>
                        <div class="result-meta">
                            <span><i class="fas fa-database"></i> ${sourceInfo ? this.escapeHtml(sourceInfo.name) : this.escapeHtml(result.source)}</span>
                            <span><i class="fas fa-folder"></i> ${this.escapeHtml(result.category)}</span>
                            <span><i class="fas fa-calendar"></i> ${searchEngine.formatDate(result.date)}</span>
                        </div>
                    </div>
                    <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${result.id}" title="Aggiungi ai segnalibri">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
                <p class="result-description">${this.escapeHtml(result.description)}</p>
                <div class="result-tags">
                    ${result.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        `;
    }

    toggleBookmark(result, button) {
        const isNowBookmarked = storageManager.toggleBookmark(result);
        
        if (isNowBookmarked) {
            button.classList.add('active');
            this.showToast('Aggiunto ai segnalibri', 'success');
        } else {
            button.classList.remove('active');
            this.showToast('Rimosso dai segnalibri', 'success');
        }
    }

    toggleFilters() {
        const panel = document.getElementById('filtersPanel');
        panel.classList.toggle('active');
    }

    resetFilters() {
        document.getElementById('sourceFilter').value = 'all';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('dateFrom').value = '';
        document.getElementById('dateTo').value = '';
        this.currentFilters = {};
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const resultsContainer = document.getElementById('resultsContainer');
        
        if (show) {
            loadingIndicator.style.display = 'block';
            resultsContainer.style.display = 'none';
        } else {
            loadingIndicator.style.display = 'none';
            resultsContainer.style.display = 'block';
        }
    }

    // History Modal
    showHistoryModal() {
        const modal = document.getElementById('historyModal');
        const historyList = document.getElementById('historyList');
        const history = storageManager.getHistory();

        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>Nessuna ricerca nella cronologia</p>
                </div>
            `;
        } else {
            historyList.innerHTML = history.map(item => this.createHistoryItem(item)).join('');
            
            // Add event listeners
            document.querySelectorAll('.history-item .item-title').forEach(el => {
                el.addEventListener('click', (e) => {
                    const query = e.target.dataset.query;
                    document.getElementById('searchInput').value = query;
                    this.closeModal('historyModal');
                    this.performSearch();
                });
            });

            document.querySelectorAll('.history-item .delete-btn').forEach(el => {
                el.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    storageManager.deleteHistoryItem(id);
                    this.showHistoryModal();
                });
            });
        }

        modal.classList.add('active');
    }

    createHistoryItem(item) {
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleString('it-IT');
        
        return `
            <div class="history-item">
                <div class="item-content">
                    <div class="item-title" data-query="${this.escapeHtml(item.query)}">${this.escapeHtml(item.query)}</div>
                    <div class="item-date">${formattedDate}</div>
                </div>
                <div class="item-actions">
                    <button class="delete-btn" data-id="${item.id}" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    clearHistory() {
        if (confirm('Sei sicuro di voler cancellare tutta la cronologia?')) {
            storageManager.clearHistory();
            this.showHistoryModal();
            this.showToast('Cronologia cancellata', 'success');
        }
    }

    // Bookmarks Modal
    showBookmarksModal() {
        const modal = document.getElementById('bookmarksModal');
        const bookmarksList = document.getElementById('bookmarksList');
        const bookmarks = storageManager.getBookmarks();

        if (bookmarks.length === 0) {
            bookmarksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark"></i>
                    <p>Nessun segnalibro salvato</p>
                </div>
            `;
        } else {
            bookmarksList.innerHTML = bookmarks.map(item => this.createBookmarkItem(item)).join('');
            
            // Add event listeners
            document.querySelectorAll('.bookmark-item .item-title').forEach(el => {
                el.addEventListener('click', (e) => {
                    const url = e.currentTarget.dataset.url;
                    if (url && this.isValidUrl(url)) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                });
            });

            document.querySelectorAll('.bookmark-item .view-btn').forEach(el => {
                el.addEventListener('click', (e) => {
                    const url = e.currentTarget.dataset.url;
                    if (url && this.isValidUrl(url)) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }
                });
            });

            document.querySelectorAll('.bookmark-item .delete-btn').forEach(el => {
                el.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.dataset.id);
                    storageManager.removeBookmark(id);
                    this.showBookmarksModal();
                    this.showToast('Segnalibro rimosso', 'success');
                    
                    // Update bookmark buttons in results
                    const btn = document.querySelector(`.bookmark-btn[data-id="${id}"]`);
                    if (btn) {
                        btn.classList.remove('active');
                    }
                });
            });
        }

        modal.classList.add('active');
    }

    createBookmarkItem(item) {
        const date = new Date(item.bookmarkedAt);
        const formattedDate = date.toLocaleString('it-IT');
        const sourceInfo = searchEngine.getSourceInfo(item.source);
        
        return `
            <div class="bookmark-item">
                <div class="item-content">
                    <div class="item-title" data-url="${this.escapeHtml(item.url)}">${this.escapeHtml(item.title)}</div>
                    <div class="item-date">
                        ${sourceInfo ? this.escapeHtml(sourceInfo.name) : this.escapeHtml(item.source)} - Salvato il ${formattedDate}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="view-btn" data-url="${this.escapeHtml(item.url)}" title="Apri">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="delete-btn" data-id="${item.id}" title="Elimina">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    loadSavedData() {
        // Any initialization with saved data can go here
        const stats = storageManager.getStats();
        console.log(`Loaded: ${stats.historyCount} history items, ${stats.bookmarksCount} bookmarks`);
    }

    // Authentication methods
    updateUserUI() {
        const userBtn = document.getElementById('userBtn');
        if (authManager.isLoggedIn()) {
            const user = authManager.getCurrentUser();
            userBtn.innerHTML = `<i class="fas fa-user-circle"></i> <span class="user-name">${this.escapeHtml(user.name)}</span>`;
            userBtn.title = `Ciao, ${user.name}`;
        } else {
            userBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> <span class="user-name">Accedi</span>`;
            userBtn.title = 'Accedi o Registrati';
        }
    }

    handleUserButtonClick() {
        if (authManager.isLoggedIn()) {
            this.showUserModal();
        } else {
            this.showLoginModal();
        }
    }

    showLoginModal() {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginModal').classList.add('active');
    }

    showRegisterModal() {
        document.getElementById('registerName').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerPasswordConfirm').value = '';
        document.getElementById('registerModal').classList.add('active');
    }

    showUserModal() {
        const user = authManager.getCurrentUser();
        if (!user) return;

        const userProfile = document.getElementById('userProfile');
        userProfile.innerHTML = `
            <div class="profile-info">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h4>${this.escapeHtml(user.name)}</h4>
                <p class="profile-email">${this.escapeHtml(user.email)}</p>
                <p class="profile-date">Membro dal ${new Date(user.createdAt).toLocaleDateString('it-IT')}</p>
            </div>
        `;
        document.getElementById('userModal').classList.add('active');
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = authManager.login(email, password);
        
        if (result.success) {
            this.showToast(result.message, 'success');
            this.closeModal('loginModal');
            this.updateUserUI();
        } else {
            this.showToast(result.message, 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        if (password !== passwordConfirm) {
            this.showToast('Le password non coincidono', 'error');
            return;
        }

        const result = authManager.register(name, email, password);
        
        if (result.success) {
            this.showToast(result.message, 'success');
            this.closeModal('registerModal');
            this.updateUserUI();
        } else {
            this.showToast(result.message, 'error');
        }
    }

    // Analytics Modal
    showAnalyticsModal() {
        const modal = document.getElementById('analyticsModal');
        
        // Show modal
        modal.classList.add('active');
        
        // Load data for the active tab
        this.switchAnalyticsTab('results');
    }

    switchAnalyticsTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.analytics-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.analytics-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        const contentId = tabName + 'Analytics';
        document.getElementById(contentId).classList.add('active');

        // Load data for the selected tab
        switch(tabName) {
            case 'results':
                this.loadResultsAnalytics();
                break;
            case 'history':
                this.loadHistoryAnalytics();
                break;
            case 'bookmarks':
                this.loadBookmarksAnalytics();
                break;
        }
    }

    loadResultsAnalytics() {
        const container = document.getElementById('resultsAnalyticsContent');
        const analysis = analyticsManager.analyzeResults();

        if (!analysis) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-bar"></i>
                    <p>Effettua una ricerca per visualizzare le statistiche</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-card-icon"><i class="fas fa-database"></i></div>
                    <div class="analytics-card-value">${analysis.total}</div>
                    <div class="analytics-card-label">Risultati Totali</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-card-icon"><i class="fas fa-tags"></i></div>
                    <div class="analytics-card-value">${analysis.tags.length}</div>
                    <div class="analytics-card-label">Tag Unici</div>
                </div>
            </div>
        `;

        // Source distribution
        html += `
            <div class="analytics-section">
                <h4><i class="fas fa-chart-pie"></i> Distribuzione per Fonte</h4>
                <div class="chart-container">
                    <canvas id="sourceChart"></canvas>
                </div>
        `;
        
        Object.entries(analysis.bySource).forEach(([source, data]) => {
            html += `
                <div class="analytics-stat">
                    <span class="stat-label">${this.escapeHtml(data.name)}</span>
                    <span class="stat-value">
                        ${data.count}
                        <span class="stat-percentage">(${data.percentage}%)</span>
                    </span>
                </div>
            `;
        });
        html += '</div>';

        // Category distribution
        html += `
            <div class="analytics-section">
                <h4><i class="fas fa-folder"></i> Distribuzione per Categoria</h4>
                <div class="chart-container">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>
        `;

        // Top tags
        if (analysis.tags.length > 0) {
            html += `
                <div class="analytics-section">
                    <h4><i class="fas fa-tags"></i> Tag Più Utilizzati</h4>
                    <div class="tag-cloud">
            `;
            
            analysis.tags.forEach(tagData => {
                html += `
                    <div class="tag-cloud-item">
                        <span>${this.escapeHtml(tagData.tag)}</span>
                        <span class="tag-cloud-count">${tagData.count}</span>
                    </div>
                `;
            });
            
            html += '</div></div>';
        }

        container.innerHTML = html;

        // Create charts
        this.createSourceChart(analysis.bySource);
        this.createCategoryChart(analysis.byCategory);
    }

    loadHistoryAnalytics() {
        const container = document.getElementById('historyAnalyticsContent');
        const analysis = analyticsManager.analyzeHistory();

        if (!analysis) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>Nessuna cronologia disponibile</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-card-icon"><i class="fas fa-search"></i></div>
                    <div class="analytics-card-value">${analysis.totalSearches}</div>
                    <div class="analytics-card-label">Ricerche Totali</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-card-icon"><i class="fas fa-calendar-week"></i></div>
                    <div class="analytics-card-value">${analysis.recentActivity.count}</div>
                    <div class="analytics-card-label">Ultimi 7 Giorni</div>
                </div>
                <div class="analytics-card">
                    <div class="analytics-card-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="analytics-card-value">${analysis.recentActivity.averagePerDay}</div>
                    <div class="analytics-card-label">Media Giornaliera</div>
                </div>
            </div>
        `;

        // Top search terms
        if (analysis.topSearchTerms.length > 0) {
            html += `
                <div class="analytics-section">
                    <h4><i class="fas fa-trophy"></i> Termini Più Cercati</h4>
            `;
            
            analysis.topSearchTerms.forEach(item => {
                html += `
                    <div class="analytics-stat">
                        <span class="stat-label">${this.escapeHtml(item.term)}</span>
                        <span class="stat-value">${item.count}</span>
                    </div>
                `;
            });
            
            html += '</div>';
        }

        // Filter usage
        html += `
            <div class="analytics-section">
                <h4><i class="fas fa-filter"></i> Utilizzo Filtri</h4>
                <div class="analytics-stat">
                    <span class="stat-label">Ricerche con intervallo date</span>
                    <span class="stat-value">${analysis.filterUsage.dateRangeUsage}</span>
                </div>
        `;
        
        if (Object.keys(analysis.filterUsage.sourceFilters).length > 0) {
            html += '<div style="margin-top: 15px;"><strong>Filtri fonte:</strong><br>';
            Object.entries(analysis.filterUsage.sourceFilters).forEach(([source, count]) => {
                html += `
                    <div class="analytics-stat">
                        <span class="stat-label">${this.escapeHtml(source)}</span>
                        <span class="stat-value">${count}</span>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';

        container.innerHTML = html;
    }

    loadBookmarksAnalytics() {
        const container = document.getElementById('bookmarksAnalyticsContent');
        const analysis = analyticsManager.analyzeBookmarks();

        if (!analysis) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark"></i>
                    <p>Nessun segnalibro salvato</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="analytics-card-icon"><i class="fas fa-bookmark"></i></div>
                    <div class="analytics-card-value">${analysis.total}</div>
                    <div class="analytics-card-label">Segnalibri Totali</div>
                </div>
            </div>
        `;

        // By source
        html += `
            <div class="analytics-section">
                <h4><i class="fas fa-database"></i> Segnalibri per Fonte</h4>
        `;
        
        Object.entries(analysis.bySource).forEach(([source, data]) => {
            html += `
                <div class="analytics-stat">
                    <span class="stat-label">${this.escapeHtml(data.name)}</span>
                    <span class="stat-value">${data.count}</span>
                </div>
            `;
        });
        
        html += '</div>';

        // By category
        html += `
            <div class="analytics-section">
                <h4><i class="fas fa-folder"></i> Segnalibri per Categoria</h4>
        `;
        
        Object.entries(analysis.byCategory).forEach(([category, count]) => {
            html += `
                <div class="analytics-stat">
                    <span class="stat-label">${this.escapeHtml(category)}</span>
                    <span class="stat-value">${count}</span>
                </div>
            `;
        });
        
        html += '</div>';

        // Most recent
        if (analysis.mostRecent.length > 0) {
            html += `
                <div class="analytics-section">
                    <h4><i class="fas fa-clock"></i> Segnalibri Recenti</h4>
            `;
            
            analysis.mostRecent.forEach(item => {
                const date = new Date(item.bookmarkedAt);
                html += `
                    <div class="timeline-item">
                        <div class="timeline-item-title">${this.escapeHtml(item.title)}</div>
                        <div class="timeline-item-meta">
                            ${this.escapeHtml(item.source)} - ${date.toLocaleDateString('it-IT')}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }

        container.innerHTML = html;
    }

    createSourceChart(bySource) {
        const ctx = document.getElementById('sourceChart');
        if (!ctx || !window.Chart) return;

        const labels = Object.values(bySource).map(s => s.name);
        const data = Object.values(bySource).map(s => s.count);
        const colors = ['#0066CC', '#004C99', '#FF9900', '#28a745'];

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createCategoryChart(byCategory) {
        const ctx = document.getElementById('categoryChart');
        if (!ctx || !window.Chart) return;

        const labels = Object.keys(byCategory);
        const data = Object.values(byCategory).map(c => c.count);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Numero di risultati',
                    data: data,
                    backgroundColor: '#0066CC',
                    borderColor: '#004C99',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    handleLogout() {
        if (confirm('Sei sicuro di voler uscire?')) {
            const result = authManager.logout();
            this.showToast(result.message, 'success');
            this.closeModal('userModal');
            this.updateUserUI();
        }
    }
}

// Make showToast available globally for export manager
window.showToast = function(message, type) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ProPAApp();
    console.log('Pro PA Application initialized');
});
