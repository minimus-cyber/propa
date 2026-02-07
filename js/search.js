// search.js - Search functionality with multi-source integration

class SearchEngine {
    constructor() {
        this.dataSources = {
            datigov: {
                id: 'datigov',
                name: 'Dati.gov.it',
                url: 'https://www.dati.gov.it/api/3/action/package_search',
                color: '#0066CC',
                description: 'Catalogo nazionale dei dati aperti della PA'
            },
            geoportale: {
                id: 'geoportale',
                name: 'Geoportale Nazionale (RNDT)',
                url: 'https://geodati.gov.it',
                color: '#2E7D32',
                description: 'Repertorio Nazionale dei Dati Territoriali'
            },
            ipa: {
                id: 'ipa',
                name: 'Indice PA (IPA)',
                url: 'https://indicepa.gov.it',
                color: '#1976D2',
                description: 'Indice delle Pubbliche Amministrazioni'
            },
            salute: {
                id: 'salute',
                name: 'Dati.salute.gov.it',
                url: 'https://www.dati.salute.gov.it',
                color: '#C62828',
                description: 'Open Data del Ministero della Salute'
            },
            scuola: {
                id: 'scuola',
                name: 'Portale Unico Dati Scuola',
                url: 'https://dati.istruzione.it',
                color: '#F57C00',
                description: 'Dati aperti del sistema scolastico italiano'
            },
            openbdap: {
                id: 'openbdap',
                name: 'OpenBDAP',
                url: 'https://openbdap.rgs.mef.gov.it',
                color: '#5E35B1',
                description: 'Banca Dati delle Amministrazioni Pubbliche'
            },
            anac: {
                id: 'anac',
                name: 'ANAC / BDNCP',
                url: 'https://dati.anticorruzione.it',
                color: '#00695C',
                description: 'Banca Dati Nazionale dei Contratti Pubblici'
            },
            opencantieri: {
                id: 'opencantieri',
                name: 'Open Cantieri',
                url: 'https://opencantieri.mit.gov.it',
                color: '#F9A825',
                description: 'Monitoraggio opere pubbliche'
            },
            opencoesione: {
                id: 'opencoesione',
                name: 'Open Coesione',
                url: 'https://opencoesione.gov.it',
                color: '#6A1B9A',
                description: 'Politiche di coesione in Italia'
            },
            soldipubblici: {
                id: 'soldipubblici',
                name: 'SoldiPubblici',
                url: 'https://soldipubblici.gov.it',
                color: '#D32F2F',
                description: 'Portale della trasparenza dei conti pubblici'
            },
            registroimprese: {
                id: 'registroimprese',
                name: 'Registro Imprese (InfoCamere)',
                url: 'https://www.registroimprese.it',
                color: '#0277BD',
                description: 'Dati aperti del Registro delle Imprese'
            },
            inps: {
                id: 'inps',
                name: 'INPS Open Data',
                url: 'https://www.inps.it/opendata',
                color: '#1565C0',
                description: 'Open Data INPS su previdenza e assistenza'
            },
            inail: {
                id: 'inail',
                name: 'INAIL Open Data',
                url: 'https://www.inail.it/opendata',
                color: '#283593',
                description: 'Dati aperti su sicurezza e salute sul lavoro'
            },
            ispra: {
                id: 'ispra',
                name: 'ISPRA Ambiente',
                url: 'https://www.isprambiente.gov.it/it/banche-dati',
                color: '#388E3C',
                description: 'Annuario dati ambientali ISPRA'
            },
            agenziaentrate: {
                id: 'agenziaentrate',
                name: 'Agenzia delle Entrate',
                url: 'https://www.agenziaentrate.gov.it/portale/web/guest/schede/fabbricatiterreni/omi/banche-dati',
                color: '#6D4C41',
                description: 'Statistiche fiscali e dati catastali'
            },
            dogane: {
                id: 'dogane',
                name: 'Agenzia Dogane e Monopoli',
                url: 'https://www.adm.gov.it/portale/statistiche',
                color: '#455A64',
                description: 'Open Data su commercio estero e accise'
            },
            istat: {
                id: 'istat',
                name: 'Istat (I.Stat / LOD)',
                url: 'http://dati.istat.it',
                color: '#303F9F',
                description: 'Statistiche ufficiali e linked open data'
            },
            normattiva: {
                id: 'normattiva',
                name: 'Normattiva',
                url: 'https://www.normattiva.it/uri-res/N2Ls',
                color: '#004C99',
                description: 'Banca dati della normativa italiana'
            },
            gazzetta: {
                id: 'gazzetta',
                name: 'Gazzetta Ufficiale',
                url: 'https://www.gazzettaufficiale.it',
                color: '#FF9900',
                description: 'Pubblicazioni ufficiali della Repubblica'
            },
            innovazione: {
                id: 'innovazione',
                name: 'Innovazione.gov.it',
                url: 'https://innovazione.gov.it',
                color: '#28a745',
                description: 'Innovazione e trasformazione digitale'
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
                source: 'scuola',
                category: 'istruzione',
                date: '2023-09-01',
                url: 'https://dati.istruzione.it/opendata/dataset/scuole-anagrafica',
                tags: ['scuole', 'istruzione', 'studenti', 'docenti', 'educazione']
            },
            {
                id: 11,
                title: 'Contratti Pubblici sopra soglia - ANAC',
                description: 'Database dei contratti pubblici sopra soglia europea gestito dall\'Autorità Nazionale Anticorruzione.',
                source: 'anac',
                category: 'appalti',
                date: '2024-02-15',
                url: 'https://dati.anticorruzione.it/superset/dashboard/contratti',
                tags: ['appalti', 'contratti', 'ANAC', 'trasparenza', 'anticorruzione']
            },
            {
                id: 12,
                title: 'Dati ambientali - Annuario ISPRA',
                description: 'Annuario dei dati ambientali ISPRA con informazioni su qualità aria, acqua, biodiversità e clima.',
                source: 'ispra',
                category: 'ambiente',
                date: '2023-12-01',
                url: 'https://www.isprambiente.gov.it/it/pubblicazioni/stato-dellambiente',
                tags: ['ambiente', 'ISPRA', 'clima', 'biodiversità', 'inquinamento']
            },
            {
                id: 13,
                title: 'Open Coesione - Progetti territoriali',
                description: 'Monitoraggio dei progetti finanziati dalle politiche di coesione europea e nazionale sul territorio.',
                source: 'opencoesione',
                category: 'economia',
                date: '2024-01-25',
                url: 'https://opencoesione.gov.it/it/progetti/',
                tags: ['coesione', 'fondi europei', 'progetti', 'territorio', 'sviluppo']
            },
            {
                id: 14,
                title: 'Statistiche Istat - Indicatori demografici',
                description: 'Indicatori demografici nazionali e regionali da I.Stat: popolazione, natalità, mortalità, migrazioni.',
                source: 'istat',
                category: 'demografia',
                date: '2024-02-10',
                url: 'http://dati.istat.it/Index.aspx?DataSetCode=DCIS_POPRES1',
                tags: ['istat', 'demografia', 'statistiche', 'popolazione', 'territorio']
            },
            {
                id: 15,
                title: 'Indice PA - Enti e uffici pubblici',
                description: 'Indice delle pubbliche amministrazioni italiane con informazioni su enti, uffici, contatti e servizi.',
                source: 'ipa',
                category: 'amministrazione',
                date: '2024-02-01',
                url: 'https://indicepa.gov.it/ipa-dati/dataset',
                tags: ['IPA', 'enti pubblici', 'amministrazione', 'anagrafica', 'PA']
            },
            {
                id: 16,
                title: 'Dati sanitari - Ministero della Salute',
                description: 'Dataset aperti su strutture sanitarie, prestazioni, farmaci e indicatori di salute pubblica.',
                source: 'salute',
                category: 'salute',
                date: '2024-01-30',
                url: 'https://www.dati.salute.gov.it/dati/dettaglioDataset/menu',
                tags: ['salute', 'sanità', 'ospedali', 'farmaci', 'prevenzione']
            },
            {
                id: 17,
                title: 'Open Cantieri - Infrastrutture in costruzione',
                description: 'Monitoraggio delle opere pubbliche e infrastrutture in fase di realizzazione sul territorio nazionale.',
                source: 'opencantieri',
                category: 'infrastrutture',
                date: '2024-02-05',
                url: 'https://opencantieri.mit.gov.it/open-data',
                tags: ['infrastrutture', 'cantieri', 'opere pubbliche', 'MIT', 'monitoraggio']
            },
            {
                id: 18,
                title: 'INPS Open Data - Prestazioni previdenziali',
                description: 'Dati aperti INPS su pensioni, ammortizzatori sociali, prestazioni assistenziali e previdenza.',
                source: 'inps',
                category: 'lavoro',
                date: '2024-01-20',
                url: 'https://www.inps.it/opendata',
                tags: ['INPS', 'pensioni', 'previdenza', 'assistenza', 'lavoro']
            },
            {
                id: 19,
                title: 'INAIL - Dati su infortuni e malattie professionali',
                description: 'Open data INAIL su infortuni sul lavoro, malattie professionali e prevenzione nei luoghi di lavoro.',
                source: 'inail',
                category: 'lavoro',
                date: '2024-01-15',
                url: 'https://www.inail.it/opendata',
                tags: ['INAIL', 'infortuni', 'sicurezza', 'lavoro', 'prevenzione']
            },
            {
                id: 20,
                title: 'Geoportale Nazionale - Dati territoriali',
                description: 'Repertorio Nazionale dei Dati Territoriali con cartografie, ortofoto e dati geografici.',
                source: 'geoportale',
                category: 'territorio',
                date: '2024-02-08',
                url: 'https://geodati.gov.it/geoportale/',
                tags: ['cartografia', 'territorio', 'GIS', 'mappe', 'geoportale']
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

    // Get all sources
    getAllSources() {
        // Return sources sorted alphabetically by name
        return Object.values(this.dataSources).sort((a, b) => 
            a.name.localeCompare(b.name, 'it')
        );
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
