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
        // In a real application, this would make actual API calls
        // For now, we simulate with mock data
        
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
                
                // Sort by date (newest first)
                results.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                resolve({
                    results: results,
                    total: results.length,
                    query: query,
                    filters: filters
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
