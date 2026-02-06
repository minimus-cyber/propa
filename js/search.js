// search.js - Search functionality with multi-source integration

class SearchEngine {
    constructor() {
        this.dataSources = {
            datigov: {
                name: 'dati.gov.it',
                url: 'https://www.dati.gov.it/api/3/action/package_search',
                color: '#0066CC'
            },
            normattiva: {
                name: 'Normattiva',
                url: 'https://www.normattiva.it/uri-res/N2Ls',
                color: '#004C99'
            },
            gazzetta: {
                name: 'Gazzetta Ufficiale',
                url: 'https://www.gazzettaufficiale.it',
                color: '#FF9900'
            },
            innovazione: {
                name: 'Innovazione.gov.it',
                url: 'https://innovazione.gov.it',
                color: '#28a745'
            }
        };
        
        this.mockResults = this.generateMockResults();
    }

    // Generate mock results for demonstration
    generateMockResults() {
        return [
            {
                id: 1,
                title: 'Dataset Open Data - Anagrafe Popolazione Residente',
                description: 'Dati relativi alla popolazione residente nei comuni italiani, aggiornati trimestralmente. Include informazioni demografiche, fasce d\'età, e distribuzione territoriale.',
                source: 'datigov',
                category: 'demografia',
                date: '2024-01-15',
                url: 'https://www.dati.gov.it/dataset/popolazione-residente',
                tags: ['popolazione', 'demografia', 'anagrafe', 'comuni']
            },
            {
                id: 2,
                title: 'Decreto Legislativo 33/2013 - Trasparenza PA',
                description: 'Riordino della disciplina riguardante il diritto di accesso civico e gli obblighi di pubblicità, trasparenza e diffusione di informazioni da parte delle pubbliche amministrazioni.',
                source: 'normattiva',
                category: 'normativa',
                date: '2013-03-14',
                url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2013-03-14;33',
                tags: ['trasparenza', 'accesso civico', 'pubblicità', 'PA']
            },
            {
                id: 3,
                title: 'Dati sulla Qualità dell\'Aria - ISPRA',
                description: 'Monitoraggio della qualità dell\'aria nelle principali città italiane. Dati su PM10, PM2.5, NO2, O3 e altri inquinanti atmosferici.',
                source: 'datigov',
                category: 'ambiente',
                date: '2024-02-01',
                url: 'https://www.dati.gov.it/dataset/qualita-aria',
                tags: ['ambiente', 'inquinamento', 'aria', 'ISPRA', 'monitoraggio']
            },
            {
                id: 4,
                title: 'Piano Nazionale di Ripresa e Resilienza - Progetti Finanziati',
                description: 'Elenco completo dei progetti finanziati dal PNRR con dettaglio degli importi, settori di intervento e stato di avanzamento.',
                source: 'innovazione',
                category: 'economia',
                date: '2024-01-20',
                url: 'https://innovazione.gov.it/pnrr/progetti',
                tags: ['PNRR', 'finanziamenti', 'progetti', 'economia', 'innovazione']
            },
            {
                id: 5,
                title: 'Codice dell\'Amministrazione Digitale - CAD',
                description: 'Testo aggiornato del Codice dell\'Amministrazione Digitale con le ultime modifiche legislative. Disciplina l\'uso delle tecnologie ICT nella PA.',
                source: 'normattiva',
                category: 'digitale',
                date: '2005-03-07',
                url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2005-03-07;82',
                tags: ['digitale', 'CAD', 'tecnologia', 'ICT', 'amministrazione']
            },
            {
                id: 6,
                title: 'Spesa Pubblica per Regione - Bilancio dello Stato',
                description: 'Analisi della spesa pubblica suddivisa per regione e per categoria di spesa. Dati aggiornati annualmente dal MEF.',
                source: 'datigov',
                category: 'economia',
                date: '2023-12-31',
                url: 'https://www.dati.gov.it/dataset/spesa-pubblica-regioni',
                tags: ['spesa pubblica', 'bilancio', 'MEF', 'regioni', 'finanze']
            },
            {
                id: 7,
                title: 'Gazzetta Ufficiale - Serie Generale n.45 del 2024',
                description: 'Pubblicazione della Gazzetta Ufficiale contenente decreti ministeriali, bandi di concorso e circolari della PA.',
                source: 'gazzetta',
                category: 'normativa',
                date: '2024-02-23',
                url: 'https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.dataPubblicazioneGazzetta=2024-02-23',
                tags: ['gazzetta ufficiale', 'decreti', 'concorsi', 'bandi']
            },
            {
                id: 8,
                title: 'Trasporti Pubblici Locali - Dati di Mobilità',
                description: 'Dataset contenente informazioni su orari, percorsi e utilizzo dei trasporti pubblici locali nelle principali città italiane.',
                source: 'datigov',
                category: 'trasporti',
                date: '2024-01-10',
                url: 'https://www.dati.gov.it/dataset/trasporti-pubblici-locali',
                tags: ['trasporti', 'mobilità', 'TPL', 'orari', 'città']
            },
            {
                id: 9,
                title: 'Strategia Nazionale per le Competenze Digitali',
                description: 'Documento programmatico del Governo per lo sviluppo delle competenze digitali dei cittadini e dei dipendenti pubblici.',
                source: 'innovazione',
                category: 'digitale',
                date: '2023-07-15',
                url: 'https://innovazione.gov.it/strategia-digitale/',
                tags: ['competenze digitali', 'formazione', 'strategia', 'PA digitale']
            },
            {
                id: 10,
                title: 'Scuole Italiane - Anagrafica e Dati Statistici',
                description: 'Elenco completo delle scuole italiane con dati su iscrizioni, personale docente, strutture e risultati scolastici.',
                source: 'datigov',
                category: 'istruzione',
                date: '2023-09-01',
                url: 'https://www.dati.gov.it/dataset/scuole-anagrafica',
                tags: ['scuole', 'istruzione', 'studenti', 'docenti', 'educazione']
            }
        ];
    }

    // Perform search with filters
    async search(query, filters = {}) {
        // Try to fetch from real API first, fallback to mock data if it fails
        try {
            const results = await this.searchRealAPI(query, filters);
            if (results && results.length > 0) {
                return {
                    results: results,
                    total: results.length,
                    query: query,
                    filters: filters,
                    source: 'api'
                };
            }
        } catch (error) {
            console.warn('API search failed, using mock data:', error);
        }
        
        // Fallback to mock data
        return this.searchMockData(query, filters);
    }

    // Search real dati.gov.it API
    async searchRealAPI(query, filters = {}) {
        const results = [];
        
        // Search dati.gov.it if not filtered to other sources
        if (!filters.source || filters.source === 'all' || filters.source === 'datigov') {
            try {
                const datigov = await this.searchDatiGovIt(query, filters);
                results.push(...datigov);
            } catch (error) {
                console.warn('dati.gov.it search failed:', error);
            }
        }
        
        return results;
    }

    // Search dati.gov.it CKAN API
    async searchDatiGovIt(query, filters = {}) {
        const baseUrl = 'https://www.dati.gov.it/api/3/action/package_search';
        const params = new URLSearchParams({
            q: query,
            rows: 20
        });

        // Add category filter if specified
        if (filters.category && filters.category !== 'all') {
            params.append('fq', `tags:${filters.category}`);
        }

        const url = `${baseUrl}?${params.toString()}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success || !data.result || !data.result.results) {
            return [];
        }

        // Transform API results to our format
        return data.result.results.map(item => ({
            id: item.id || Math.random().toString(36).substr(2, 9),
            title: item.title || 'Senza titolo',
            description: item.notes || 'Nessuna descrizione disponibile',
            source: 'datigov',
            category: this.extractCategory(item.tags),
            date: item.metadata_modified || item.metadata_created || new Date().toISOString().split('T')[0],
            url: `https://www.dati.gov.it/view-dataset/dataset?id=${item.name}`,
            tags: (item.tags || []).map(tag => tag.display_name || tag.name || tag).slice(0, 5)
        }));
    }

    // Extract category from tags
    extractCategory(tags) {
        if (!tags || tags.length === 0) return 'generale';
        
        const categoryMap = {
            'ambiente': 'ambiente',
            'economia': 'economia',
            'salute': 'salute',
            'trasporti': 'trasporti',
            'istruzione': 'istruzione',
            'lavoro': 'lavoro',
            'demographic': 'demografia',
            'popolazione': 'demografia'
        };

        for (const tag of tags) {
            const tagName = (tag.display_name || tag.name || tag).toLowerCase();
            for (const [key, value] of Object.entries(categoryMap)) {
                if (tagName.includes(key)) {
                    return value;
                }
            }
        }

        return 'generale';
    }

    // Search mock data (fallback)
    searchMockData(query, filters = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let results = [...this.mockResults];
                
                // Filter by query
                if (query) {
                    const lowerQuery = query.toLowerCase();
                    results = results.filter(item => 
                        item.title.toLowerCase().includes(lowerQuery) ||
                        item.description.toLowerCase().includes(lowerQuery) ||
                        item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
                    );
                }
                
                // Filter by source
                if (filters.source && filters.source !== 'all') {
                    results = results.filter(item => item.source === filters.source);
                }
                
                // Filter by category
                if (filters.category && filters.category !== 'all') {
                    results = results.filter(item => 
                        item.category === filters.category ||
                        item.tags.includes(filters.category)
                    );
                }
                
                // Filter by date range
                if (filters.dateFrom) {
                    results = results.filter(item => item.date >= filters.dateFrom);
                }
                
                if (filters.dateTo) {
                    results = results.filter(item => item.date <= filters.dateTo);
                }

                // Apply source-specific filters
                // For dati.gov.it
                if (filters.organization) {
                    results = results.filter(item => 
                        item.source === 'datigov' &&
                        (item.title.toLowerCase().includes(filters.organization.toLowerCase()) ||
                         item.description.toLowerCase().includes(filters.organization.toLowerCase()))
                    );
                }

                // For Normattiva
                if (filters.type || filters.actNumber || filters.year) {
                    results = results.filter(item => {
                        if (item.source !== 'normattiva') return false;
                        
                        let matches = true;
                        if (filters.type) {
                            matches = matches && item.title.toLowerCase().includes(filters.type);
                        }
                        if (filters.actNumber) {
                            matches = matches && item.title.includes(filters.actNumber);
                        }
                        if (filters.year) {
                            matches = matches && (item.title.includes(filters.year) || item.date.includes(filters.year));
                        }
                        return matches;
                    });
                }

                // For Gazzetta Ufficiale
                if (filters.series || filters.gazzettaNumber) {
                    results = results.filter(item => {
                        if (item.source !== 'gazzetta') return false;
                        
                        let matches = true;
                        if (filters.series) {
                            matches = matches && item.title.toLowerCase().includes(filters.series);
                        }
                        if (filters.gazzettaNumber) {
                            matches = matches && item.title.includes(filters.gazzettaNumber);
                        }
                        return matches;
                    });
                }

                // For Innovazione.gov.it
                if (filters.contentType || filters.sector || filters.status) {
                    results = results.filter(item => {
                        if (item.source !== 'innovazione') return false;
                        
                        let matches = true;
                        if (filters.contentType) {
                            matches = matches && (
                                item.title.toLowerCase().includes(filters.contentType) ||
                                item.tags.some(tag => tag.toLowerCase().includes(filters.contentType))
                            );
                        }
                        if (filters.sector) {
                            matches = matches && (
                                item.title.toLowerCase().includes(filters.sector) ||
                                item.description.toLowerCase().includes(filters.sector) ||
                                item.tags.some(tag => tag.toLowerCase().includes(filters.sector))
                            );
                        }
                        if (filters.status) {
                            // For status, we check description or tags
                            matches = matches && (
                                item.description.toLowerCase().includes(filters.status) ||
                                item.tags.some(tag => tag.toLowerCase().includes(filters.status))
                            );
                        }
                        return matches;
                    });
                }
                
                // Sort by date (newest first)
                results.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                resolve({
                    results: results,
                    total: results.length,
                    query: query,
                    filters: filters,
                    source: 'mock'
                });
            }, 800); // Simulate network delay
        });
    }

    // Get data source info
    getSourceInfo(sourceId) {
        return this.dataSources[sourceId] || null;
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

// Export singleton instance
const searchEngine = new SearchEngine();
