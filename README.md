# OmniPA - Motore di Ricerca Unificato per la Pubblica Amministrazione

[![Deploy to GitHub Pages](https://github.com/minimus-cyber/propa/actions/workflows/deploy.yml/badge.svg)](https://github.com/minimus-cyber/propa/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://minimus-cyber.github.io/propa/)

**OmniPA** è un'applicazione web completa progettata per funzionari e dipendenti della Pubblica Amministrazione italiana, che permette di cercare dati e documenti da fonti multiple in modo efficiente e unificato.

## 🌐 Demo Live

**Visita l'applicazione**: [https://minimus-cyber.github.io/propa/](https://minimus-cyber.github.io/propa/)

## 🎯 Caratteristiche Principali

### 🔍 Ricerca Unificata e Multi-Fonte
- **Ricerca Unificata**: Una barra di ricerca principale per cercare simultaneamente in tutte le fonti PA
- **Ricerca Specifica per Fonte**: Motori di ricerca individuali per ciascuna delle 20+ fonti disponibili
- **Integrazione con fonti ufficiali PA**: Accesso diretto a tutti i principali portali dati della PA italiana
- **Filtri avanzati espandibili**: Filtra per fonte, categoria, intervallo di date
- **Risultati dettagliati**: Visualizzazione completa con metadati, descrizioni e tag

### 📁 Export Multi-Formato
- **Export PDF**: Documenti professionali con tabelle e dettagli completi
- **Export Excel (.xlsx)**: Fogli di calcolo strutturati per analisi
- **Export Word (.doc)**: Documenti formattati pronti per la condivisione

### 💾 Gestione Cronologia e Preferiti
- **Cronologia ricerche**: Salvata automaticamente in localStorage (ultimi 50 termini)
- **Segnalibri**: Sistema di favoriti per salvare i risultati più importanti
- **Persistenza locale**: Tutti i dati rimangono sul dispositivo dell'utente
- **Possibilità futura di registrazione utente**: Architettura predisposta per sync cloud

### 🎨 Interfaccia Moderna
- **Design responsive**: Ottimizzato per desktop, tablet e mobile
- **UI intuitiva**: Interfaccia pulita e professionale
- **Icone Font Awesome**: Visual design moderno e coerente
- **Animazioni fluide**: Transizioni e feedback visivi eleganti

## 📂 Struttura del Progetto

```
propa/
├── index.html              # Pagina principale dell'applicazione
├── css/
│   └── styles.css         # Stili completi dell'applicazione
├── js/
│   ├── app.js            # Logica principale dell'applicazione
│   ├── storage.js        # Gestione localStorage (cronologia e segnalibri)
│   ├── search.js         # Motore di ricerca e integrazione fonti
│   └── export.js         # Funzionalità di export (PDF, Excel, Word)
└── README.md             # Questo file
```

## 🚀 Installazione e Utilizzo

### Installazione Locale

1. **Clona il repository**:
   ```bash
   git clone https://github.com/minimus-cyber/propa.git
   cd propa
   ```

2. **Apri l'applicazione**:
   - Apri il file `index.html` direttamente nel browser
   - Oppure usa un server locale:
     ```bash
     # Con Python 3
     python -m http.server 8000
     
     # Con Node.js
     npx serve
     ```

3. **Accedi all'applicazione**:
   - Apri il browser e vai su `http://localhost:8000`

### Utilizzo dell'Applicazione

#### Ricerca Unificata
1. Utilizza la barra di ricerca principale in alto per cercare in tutte le fonti simultaneamente
2. Inserisci il termine di ricerca
3. Premi "Cerca in tutte le fonti" o Invio
4. Visualizza i risultati aggregati da tutte le fonti

#### Ricerca per Singola Fonte
1. Scorri alla sezione "Ricerca per singola fonte"
2. Scegli la fonte specifica di tuo interesse (es. INPS, ANAC, Istat)
3. Inserisci il termine di ricerca nella barra dedicata
4. Premi il pulsante di ricerca per quella fonte specifica
5. Visualizza i risultati solo da quella fonte

#### Ricerca Base (deprecata - usa Ricerca Unificata)
1. Inserisci il termine di ricerca nella barra principale
2. Premi "Cerca" o Invio
3. Visualizza i risultati con tutti i dettagli

#### Filtri Avanzati
1. Clicca su "Filtri avanzati" sotto la barra di ricerca
2. Seleziona:
   - **Fonte dati**: Scegli una fonte specifica o tutte
   - **Categoria**: Filtra per area tematica
   - **Intervallo date**: Imposta data inizio e fine
3. Clicca "Applica filtri"

#### Gestione Segnalibri
1. Clicca sull'icona bookmark (🔖) su un risultato per salvarlo
2. Accedi ai segnalibri cliccando l'icona bookmark nell'header
3. Gestisci, apri o elimina i segnalibri salvati

#### Cronologia
1. Clicca sull'icona cronologia (🕒) nell'header
2. Visualizza tutte le ricerche precedenti
3. Clicca su una ricerca per ripeterla
4. Cancella la cronologia se necessario

#### Export Risultati
1. Dopo aver effettuato una ricerca, usa i pulsanti nella sezione risultati:
   - **PDF**: Per documenti professionali
   - **Excel**: Per analisi dati
   - **Word**: Per documenti editabili
2. Il file verrà scaricato automaticamente

## 🔧 Tecnologie Utilizzate

### Frontend
- **HTML5**: Struttura semantica moderna
- **CSS3**: Stili avanzati con variabili CSS e animazioni
- **JavaScript ES6+**: Logica applicativa moderna

### Librerie Esterne (via CDN)
- **Font Awesome 6.4.0**: Icone
- **jsPDF 2.5.1**: Generazione PDF
- **jsPDF-AutoTable 3.5.31**: Tabelle nei PDF
- **SheetJS (xlsx) 0.18.5**: Export Excel
- **FileSaver.js 2.0.5**: Download file
- **Docxtemplater 3.37.7**: Export Word
- **PizZip 3.1.4**: Supporto ZIP per Word

### Fonti Dati Integrate (20+)
1. **Dati.gov.it** - Catalogo nazionale open data PA
2. **Geoportale Nazionale (RNDT)** - Dati territoriali e cartografici
3. **Indice PA (IPA)** - Anagrafica pubbliche amministrazioni
4. **Dati.salute.gov.it** - Open data sanitari
5. **Portale Unico Dati Scuola** - Dati sistema scolastico
6. **OpenBDAP** - Banca dati amministrazioni pubbliche
7. **ANAC / BDNCP** - Contratti pubblici e anticorruzione
8. **Open Cantieri** - Monitoraggio opere pubbliche
9. **Open Coesione** - Politiche di coesione europea
10. **SoldiPubblici** - Trasparenza conti pubblici
11. **Registro Imprese (InfoCamere)** - Dati imprese italiane
12. **INPS Open Data** - Previdenza e assistenza
13. **INAIL Open Data** - Sicurezza sul lavoro
14. **ISPRA** - Dati ambientali
15. **Agenzia delle Entrate** - Statistiche fiscali e catasto
16. **Agenzia Dogane e Monopoli** - Commercio estero
17. **Istat (I.Stat / LOD)** - Statistiche ufficiali
18. **Normattiva** - Normativa italiana
19. **Gazzetta Ufficiale** - Pubblicazioni ufficiali
20. **Innovazione.gov.it** - Innovazione e digitale

## 🎨 Personalizzazione

### Colori e Temi
Modifica le variabili CSS in `css/styles.css`:

```css
:root {
    --primary-color: #0066CC;
    --secondary-color: #004C99;
    --accent-color: #FF9900;
    /* ... altri colori ... */
}
```

### Aggiungere Nuove Fonti
In `js/search.js`, aggiungi nuove fonti nell'oggetto `dataSources`:

```javascript
this.dataSources = {
    // ... fonti esistenti ...
    nuovaFonte: {
        name: 'Nome Fonte',
        url: 'https://api.fonte.it',
        color: '#hexcolor'
    }
};
```

## 📱 Compatibilità Browser

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 🔐 Privacy e Sicurezza

- **Dati locali**: Tutta la cronologia e i segnalibri sono salvati in localStorage
- **Nessun tracking**: L'applicazione non invia dati a server esterni
- **Open Source**: Codice completamente ispezionabile
- **HTTPS ready**: Compatibile con deployment sicuro

## 🚀 Deployment

### GitHub Pages (Automatico)

Il progetto è configurato per il deployment automatico su GitHub Pages:

1. **Il deployment è già attivo**: Ogni push al branch `main` attiva automaticamente il workflow di deployment
2. **URL di produzione**: [https://minimus-cyber.github.io/propa/](https://minimus-cyber.github.io/propa/)
3. **Workflow GitHub Actions**: Il file `.github/workflows/deploy.yml` gestisce il deployment automatico

#### Come funziona il deployment automatico

1. Ogni volta che viene fatto un push al branch `main`, GitHub Actions:
   - Effettua il checkout del codice
   - Configura GitHub Pages
   - Carica tutti i file statici
   - Deploya l'applicazione

2. Il deployment richiede circa 1-2 minuti
3. Puoi monitorare lo stato del deployment nella tab "Actions" del repository

#### Configurazione GitHub Pages (già attiva)

Il repository è già configurato per utilizzare GitHub Pages con:
- **Source**: GitHub Actions workflow
- **Branch**: main
- **Directory**: root (/)
- **Custom domain**: Opzionale (vedi sotto)

#### Aggiungere un dominio personalizzato (Opzionale)

Se desideri utilizzare un dominio personalizzato:

1. Vai su Settings > Pages nel repository GitHub
2. In "Custom domain" inserisci il tuo dominio (es. `propa.example.com`)
3. Configura i record DNS presso il tuo provider:
   ```
   Type: CNAME
   Name: propa (o il sottodominio desiderato)
   Value: minimus-cyber.github.io
   ```
4. GitHub creerà automaticamente un file CNAME nel repository

### Server Web
1. Carica tutti i file su un server web
2. Assicurati che il server supporti file statici
3. Configura HTTPS per la sicurezza

### Docker (opzionale)
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

## 🛣️ Roadmap Futura

### Versione 2.0
- [ ] Autenticazione utente
- [ ] Sincronizzazione cloud di cronologia e segnalibri
- [ ] API reali integrate (al posto dei dati mock)
- [ ] Notifiche per nuovi dataset
- [ ] Collaborazione e condivisione ricerche
- [ ] Dashboard analytics
- [ ] Temi personalizzabili
- [ ] Supporto multilingua

### Integrazioni Pianificate
- [ ] SPID/CIE per autenticazione PA
- [ ] API ANPR (Anagrafe Nazionale)
- [ ] API INPS
- [ ] API Agenzia delle Entrate
- [ ] API Ministeri

## 📖 Documentazione API

### StorageManager
```javascript
// Cronologia
storageManager.addToHistory(query, filters);
storageManager.getHistory();
storageManager.clearHistory();

// Segnalibri
storageManager.addBookmark(result);
storageManager.removeBookmark(id);
storageManager.toggleBookmark(result);
storageManager.getBookmarks();
```

### SearchEngine
```javascript
// Ricerca
const results = await searchEngine.search(query, filters);
const sourceInfo = searchEngine.getSourceInfo(sourceId);
```

### ExportManager
```javascript
// Export
exportManager.setResults(results);
exportManager.exportToPDF();
exportManager.exportToExcel();
exportManager.exportToWord();
```

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fork il repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

## 👥 Autori

- **Pro PA Team** - Sviluppo iniziale

## 🙏 Ringraziamenti

- Tutti i maintainer delle librerie open source utilizzate
- La community italiana degli sviluppatori PA
- Gli utenti che forniscono feedback e suggerimenti

## 📞 Supporto

Per supporto, bug report o richieste di feature:
- Apri un issue su GitHub
- Contatta il team di sviluppo

---

**OmniPA** - Semplificare l'accesso unificato ai dati della Pubblica Amministrazione 🇮🇹
