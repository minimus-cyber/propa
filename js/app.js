// app.js - Main application logic

class OmniPAApp {
    constructor() {
        this.currentResults = [];
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.updateUserUI();
        this.renderSourceSearches();
        this.initGuidedSearch();
        this.initInfoPopups();
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
        // Unified search functionality
        document.getElementById('unifiedSearchBtn').addEventListener('click', () => this.performUnifiedSearch());
        document.getElementById('unifiedSearchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performUnifiedSearch();
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
        ['historyModal', 'bookmarksModal', 'loginModal', 'registerModal', 'userModal'].forEach(modalId => {
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

    renderSourceSearches() {
        const container = document.getElementById('sourceSearches');
        const sources = searchEngine.getAllSources();
        
        container.innerHTML = sources.map(source => `
            <div class="source-search-item">
                <div class="source-header">
                    <i class="fas fa-database"></i>
                    <h4>${this.escapeHtml(source.name)}<span class="info-icon" data-info="source-${source.id}">i</span></h4>
                </div>
                <div class="source-search-bar">
                    <input 
                        type="text" 
                        class="source-search-input" 
                        placeholder="Cerca in ${this.escapeHtml(source.name)}..."
                        data-source="${source.id}"
                    >
                    <button class="btn btn-sm btn-primary source-search-btn" data-source="${source.id}">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for source searches
        document.querySelectorAll('.source-search-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sourceId = e.currentTarget.dataset.source;
                this.performSourceSearch(sourceId);
            });
        });

        document.querySelectorAll('.source-search-input').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const sourceId = e.currentTarget.dataset.source;
                    this.performSourceSearch(sourceId);
                }
            });
        });

        // Add info data for source-specific info icons
        this.addSourceInfoData(sources);
    }

    addSourceInfoData(sources) {
        // Create a map of source-specific info that will be used by the info popup
        this.sourceInfoData = {};
        
        const sourceDescriptions = {
            'datigov': 'Catalogo nazionale dei dati aperti della PA. Documenti tipici: dataset CSV, JSON, XML su vari temi (demografia, economia, ambiente, ecc.)',
            'normattiva': 'Banca dati della normativa italiana. Documenti tipici: leggi, decreti legislativi, decreti ministeriali, circolari.',
            'gazzetta': 'Pubblicazioni ufficiali della Repubblica Italiana. Documenti tipici: Gazzetta Ufficiale, bandi di concorso, decreti, avvisi.',
            'ipa': 'Indice delle Pubbliche Amministrazioni italiane. Documenti tipici: anagrafica enti pubblici, contatti, organizzazione.',
            'salute': 'Open Data del Ministero della Salute. Documenti tipici: dati sanitari, strutture ospedaliere, farmaci, prevenzione.',
            'scuola': 'Dati aperti del sistema scolastico italiano. Documenti tipici: anagrafica scuole, iscrizioni, personale docente, risultati.',
            'inps': 'Open Data INPS su previdenza e assistenza. Documenti tipici: dati pensioni, ammortizzatori sociali, prestazioni.',
            'inail': 'Dati aperti su sicurezza e salute sul lavoro. Documenti tipici: infortuni, malattie professionali, prevenzione.',
            'istat': 'Statistiche ufficiali e linked open data. Documenti tipici: dati demografici, economici, sociali, territoriali.',
            'anac': 'Banca Dati Nazionale dei Contratti Pubblici. Documenti tipici: appalti, contratti, gare, anticorruzione.',
            'ispra': 'Annuario dati ambientali ISPRA. Documenti tipici: qualità aria, acqua, biodiversità, clima, inquinamento.',
            'geoportale': 'Repertorio Nazionale dei Dati Territoriali. Documenti tipici: cartografie, ortofoto, dati GIS, mappe.',
            'opencoesione': 'Politiche di coesione in Italia. Documenti tipici: progetti finanziati, fondi europei, sviluppo territoriale.',
            'opencantieri': 'Monitoraggio opere pubbliche. Documenti tipici: infrastrutture, cantieri, stato avanzamento lavori.',
            'soldipubblici': 'Portale della trasparenza dei conti pubblici. Documenti tipici: spesa pubblica, bilanci, trasparenza.',
            'openbdap': 'Banca Dati delle Amministrazioni Pubbliche. Documenti tipici: dati finanziari, bilanci, personale PA.',
            'registroimprese': 'Dati aperti del Registro delle Imprese. Documenti tipici: imprese italiane, bilanci, partecipazioni.',
            'agenziaentrate': 'Statistiche fiscali e dati catastali. Documenti tipici: OMI, catasto, dichiarazioni fiscali.',
            'dogane': 'Open Data su commercio estero e accise. Documenti tipici: import/export, statistiche doganali.',
            'innovazione': 'Innovazione e trasformazione digitale. Documenti tipici: PNRR, strategie digitali, innovazione PA.'
        };

        sources.forEach(source => {
            this.sourceInfoData[`source-${source.id}`] = {
                title: source.name,
                content: `
                    <p><strong>${this.escapeHtml(source.description)}</strong></p>
                    <p style="margin-top: 10px;">${sourceDescriptions[source.id] || 'Fonte ufficiale della Pubblica Amministrazione italiana.'}</p>
                    <p style="margin-top: 10px;"><strong>URL:</strong> <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.url}</a></p>
                `
            };
        });
    }

    async performUnifiedSearch() {
        const query = document.getElementById('unifiedSearchInput').value.trim();
        
        if (!query) {
            this.showToast('Inserisci un termine di ricerca', 'error');
            return;
        }

        // Get filters
        this.currentFilters = {
            source: 'all',
            category: document.getElementById('categoryFilter').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value
        };

        // Show loading
        this.showLoading(true);
        document.getElementById('resultsSection').classList.add('active');

        try {
            // Perform search across all sources
            const searchResult = await searchEngine.search(query, this.currentFilters);
            this.currentResults = searchResult.results;

            // Save to history
            storageManager.addToHistory(query, this.currentFilters);

            // Display results
            this.displayResults(searchResult);

            // Update export manager
            exportManager.setResults(this.currentResults);

        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Errore durante la ricerca', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async performSourceSearch(sourceId) {
        const input = document.querySelector(`.source-search-input[data-source="${sourceId}"]`);
        const query = input.value.trim();
        
        if (!query) {
            this.showToast('Inserisci un termine di ricerca', 'error');
            return;
        }

        // Set filter to specific source
        this.currentFilters = {
            source: sourceId,
            category: document.getElementById('categoryFilter').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value
        };

        // Show loading
        this.showLoading(true);
        document.getElementById('resultsSection').classList.add('active');

        try {
            // Perform search for specific source
            const searchResult = await searchEngine.search(query, this.currentFilters);
            this.currentResults = searchResult.results;

            // Save to history
            storageManager.addToHistory(query, this.currentFilters);

            // Display results
            this.displayResults(searchResult);

            // Update export manager
            exportManager.setResults(this.currentResults);

        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Errore durante la ricerca', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Legacy method - now calls performUnifiedSearch for backward compatibility
    async performSearch() {
        await this.performUnifiedSearch();
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

    handleLogout() {
        if (confirm('Sei sicuro di voler uscire?')) {
            const result = authManager.logout();
            this.showToast(result.message, 'success');
            this.closeModal('userModal');
            this.updateUserUI();
        }
    }

    // Guided Search Methods
    initGuidedSearch() {
        this.guidedSearchState = {
            step: 0,
            answers: {},
            recommendedSource: null
        };
        this.renderGuidedSearchQuestion();
    }

    renderGuidedSearchQuestion() {
        const container = document.getElementById('guidedSearchQuestions');
        const step = this.guidedSearchState.step;

        const questions = [
            {
                question: "Che tipo di informazioni stai cercando?",
                options: [
                    { value: 'normativa', label: 'Leggi e Normative' },
                    { value: 'dati', label: 'Dati e Statistiche' },
                    { value: 'documenti', label: 'Documenti Amministrativi' },
                    { value: 'servizi', label: 'Servizi e Informazioni PA' }
                ]
            },
            {
                question: "Quale settore ti interessa?",
                options: [
                    { value: 'salute', label: 'Salute' },
                    { value: 'economia', label: 'Economia e Finanze' },
                    { value: 'ambiente', label: 'Ambiente' },
                    { value: 'lavoro', label: 'Lavoro e Previdenza' },
                    { value: 'istruzione', label: 'Istruzione' },
                    { value: 'territorio', label: 'Territorio e Infrastrutture' },
                    { value: 'altro', label: 'Altro' }
                ]
            }
        ];

        if (step < questions.length) {
            const q = questions[step];
            container.innerHTML = `
                <div class="guided-search-question">
                    <p><strong>Domanda ${step + 1}:</strong> ${q.question}</p>
                    <div class="guided-search-options">
                        ${q.options.map(opt => `
                            <button class="guided-option-btn" data-value="${opt.value}">
                                ${opt.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;

            // Add event listeners to option buttons
            document.querySelectorAll('.guided-option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const value = e.currentTarget.dataset.value;
                    this.handleGuidedSearchAnswer(step, value);
                });
            });
        } else {
            this.showGuidedSearchResult();
        }
    }

    handleGuidedSearchAnswer(step, value) {
        this.guidedSearchState.answers[step] = value;
        
        // Select the button visually
        document.querySelectorAll('.guided-option-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.value === value) {
                btn.classList.add('selected');
            }
        });

        // Move to next question after a short delay
        setTimeout(() => {
            this.guidedSearchState.step++;
            this.renderGuidedSearchQuestion();
        }, 300);
    }

    showGuidedSearchResult() {
        const container = document.getElementById('guidedSearchQuestions');
        const answers = this.guidedSearchState.answers;
        
        // Determine recommended source based on answers
        let recommendedSource = this.determineRecommendedSource(answers);
        this.guidedSearchState.recommendedSource = recommendedSource;

        const sourceInfo = searchEngine.getSourceInfo(recommendedSource);
        
        container.innerHTML = `
            <div class="guided-search-result active">
                <h5><i class="fas fa-lightbulb"></i> Consiglio:</h5>
                <p>In base alle tue risposte, ti consigliamo di cercare in <strong>${this.escapeHtml(sourceInfo.name)}</strong>.</p>
                <p style="color: var(--text-light); font-size: 0.9rem;">${this.escapeHtml(sourceInfo.description)}</p>
                <div class="guided-search-actions">
                    <input 
                        type="text" 
                        id="guidedSearchInput" 
                        class="source-search-input" 
                        placeholder="Inserisci il termine di ricerca..."
                        style="flex: 1;"
                    >
                    <button class="btn btn-primary" id="startGuidedSearch">
                        <i class="fas fa-search"></i> Avvia Ricerca
                    </button>
                    <button class="btn btn-secondary" id="resetGuidedSearch">
                        <i class="fas fa-redo"></i> Ricomincia
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        document.getElementById('startGuidedSearch').addEventListener('click', () => {
            this.executeGuidedSearch();
        });

        document.getElementById('guidedSearchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeGuidedSearch();
            }
        });

        document.getElementById('resetGuidedSearch').addEventListener('click', () => {
            this.resetGuidedSearch();
        });
    }

    determineRecommendedSource(answers) {
        const type = answers[0];
        const sector = answers[1];

        // Logic to determine source based on answers
        if (type === 'normativa') {
            return 'normattiva';
        } else if (type === 'documenti') {
            return 'gazzetta';
        } else if (type === 'servizi') {
            return 'ipa';
        } else {
            // For 'dati', use sector to determine
            const sectorMap = {
                'salute': 'salute',
                'economia': 'datigov',
                'ambiente': 'ispra',
                'lavoro': 'inps',
                'istruzione': 'scuola',
                'territorio': 'geoportale',
                'altro': 'datigov'
            };
            return sectorMap[sector] || 'datigov';
        }
    }

    async executeGuidedSearch() {
        const query = document.getElementById('guidedSearchInput').value.trim();
        
        if (!query) {
            this.showToast('Inserisci un termine di ricerca', 'error');
            return;
        }

        const sourceId = this.guidedSearchState.recommendedSource;
        
        // Set filter to specific source
        this.currentFilters = {
            source: sourceId,
            category: document.getElementById('categoryFilter').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value
        };

        // Show loading
        this.showLoading(true);
        document.getElementById('resultsSection').classList.add('active');

        try {
            const searchResult = await searchEngine.search(query, this.currentFilters);
            this.currentResults = searchResult.results;

            storageManager.addToHistory(query, this.currentFilters);
            this.displayResults(searchResult);
            exportManager.setResults(this.currentResults);

            // Scroll to results
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Errore durante la ricerca', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    resetGuidedSearch() {
        this.guidedSearchState = {
            step: 0,
            answers: {},
            recommendedSource: null
        };
        this.renderGuidedSearchQuestion();
    }

    // Info Popup Methods
    initInfoPopups() {
        const infoData = {
            'portal-info': {
                title: 'Cos\'è OmniPA?',
                content: `
                    <p><strong>OmniPA</strong> è un motore di ricerca unificato per la Pubblica Amministrazione italiana.</p>
                    <p>Permette di cercare simultaneamente dati e documenti da oltre 20 fonti ufficiali della PA, tra cui:</p>
                    <ul>
                        <li>Portali di Open Data (Dati.gov.it, INPS, ISTAT, ecc.)</li>
                        <li>Banche dati normative (Normattiva, Gazzetta Ufficiale)</li>
                        <li>Portali tematici (Salute, Scuola, Ambiente, ecc.)</li>
                        <li>Sistemi di monitoraggio (OpenCoesione, Open Cantieri)</li>
                    </ul>
                    <p>Il portale semplifica l'accesso alle informazioni pubbliche, risparmiando tempo e migliorando l'efficienza nella ricerca.</p>
                `
            },
            'login-info': {
                title: 'Perché Registrarsi?',
                content: `
                    <p>Registrandoti su OmniPA potrai:</p>
                    <ul>
                        <li><strong>Salvare la cronologia</strong> delle tue ricerche attraverso sessioni diverse</li>
                        <li><strong>Sincronizzare i segnalibri</strong> su tutti i tuoi dispositivi</li>
                        <li><strong>Accedere alla cronologia</strong> anche da altri computer</li>
                        <li><strong>Ricevere notifiche</strong> su nuovi dataset di tuo interesse (in arrivo)</li>
                        <li><strong>Condividere ricerche</strong> con i colleghi (in arrivo)</li>
                    </ul>
                    <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 10px;">
                        <em>Nota: Attualmente cronologia e segnalibri sono salvati solo in locale nel browser. 
                        La registrazione permetterà la sincronizzazione cloud nelle prossime versioni.</em>
                    </p>
                `
            },
            'unified-search-info': {
                title: 'Ricerca Unificata',
                content: `
                    <p>La <strong>ricerca unificata</strong> cerca simultaneamente in tutte le fonti disponibili.</p>
                    <p><strong>Come funziona:</strong></p>
                    <ul>
                        <li>Inserisci un termine di ricerca generico</li>
                        <li>Il sistema interroga tutte le fonti PA disponibili</li>
                        <li>I risultati vengono aggregati e mostrati insieme</li>
                        <li>Ogni risultato mostra la fonte di provenienza</li>
                    </ul>
                    <p><strong>Ideale per:</strong> Ricerche esplorative, quando non si sa esattamente in quale fonte cercare, o quando si vogliono confrontare dati da fonti diverse.</p>
                `
            }
        };

        // Add click listeners to all info icons
        document.addEventListener('click', (e) => {
            const infoIcon = e.target.closest('.info-icon');
            if (infoIcon) {
                e.preventDefault();
                e.stopPropagation();
                const infoType = infoIcon.dataset.info;
                this.showInfoPopup(infoType, infoData[infoType]);
            }
        });

        // Close info popup
        document.getElementById('closeInfoPopup').addEventListener('click', () => {
            this.closeInfoPopup();
        });

        document.getElementById('infoPopup').addEventListener('click', (e) => {
            if (e.target.id === 'infoPopup') {
                this.closeInfoPopup();
            }
        });
    }

    showInfoPopup(type, data) {
        // Check sourceInfoData if data not provided
        if (!data && this.sourceInfoData && this.sourceInfoData[type]) {
            data = this.sourceInfoData[type];
        }
        
        if (!data) return;
        
        const popup = document.getElementById('infoPopup');
        const title = document.getElementById('infoPopupTitle');
        const body = document.getElementById('infoPopupBody');

        title.textContent = data.title;
        body.innerHTML = data.content;

        popup.classList.add('active');
    }

    closeInfoPopup() {
        document.getElementById('infoPopup').classList.remove('active');
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize instances
    window.storageManager = new StorageManager();
    window.authManager = new AuthManager();
    window.exportManager = new ExportManager();
    
    // Ensure searchEngine is globally available
    // (it's already instantiated in search.js, but we make sure it's accessible)
    if (typeof searchEngine !== 'undefined') {
        window.searchEngine = searchEngine;
    }
    
    window.app = new OmniPAApp();
});
