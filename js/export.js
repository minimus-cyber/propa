// export.js - Export functionality for PDF, Excel, and Word

class ExportManager {
    constructor() {
        this.currentResults = [];
    }

    setResults(results) {
        this.currentResults = results;
    }

    // Export to PDF using jsPDF
    exportToPDF() {
        if (this.currentResults.length === 0) {
            this.showError('Nessun risultato da esportare');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.setTextColor(0, 102, 204);
            doc.text('Pro PA - Risultati della Ricerca', 14, 20);
            
            // Add export date
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Esportato il: ${new Date().toLocaleDateString('it-IT')}`, 14, 28);
            
            // Prepare table data
            const tableData = this.currentResults.map((result, index) => [
                index + 1,
                result.title,
                this.getSourceName(result.source),
                result.category,
                new Date(result.date).toLocaleDateString('it-IT')
            ]);
            
            // Add table
            doc.autoTable({
                startY: 35,
                head: [['#', 'Titolo', 'Fonte', 'Categoria', 'Data']],
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [0, 102, 204],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 80 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 30 }
                }
            });
            
            // Add details page
            let yPos = doc.lastAutoTable.finalY + 15;
            
            this.currentResults.forEach((result, index) => {
                // Check if we need a new page
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                // Result number and title
                doc.setFontSize(12);
                doc.setTextColor(0, 102, 204);
                doc.text(`${index + 1}. ${result.title}`, 14, yPos);
                yPos += 7;
                
                // Description
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                const descLines = doc.splitTextToSize(result.description, 180);
                doc.text(descLines, 14, yPos);
                yPos += (descLines.length * 5) + 3;
                
                // Metadata
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(`Fonte: ${this.getSourceName(result.source)} | Categoria: ${result.category} | Data: ${new Date(result.date).toLocaleDateString('it-IT')}`, 14, yPos);
                yPos += 5;
                
                // URL
                doc.setTextColor(0, 102, 204);
                doc.text(`URL: ${result.url}`, 14, yPos);
                yPos += 10;
            });
            
            // Save the PDF
            doc.save('propa-risultati.pdf');
            this.showSuccess('PDF esportato con successo!');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            this.showError('Errore durante l\'esportazione del PDF');
        }
    }

    // Export to Excel using SheetJS
    exportToExcel() {
        if (this.currentResults.length === 0) {
            this.showError('Nessun risultato da esportare');
            return;
        }

        try {
            // Prepare data for Excel
            const data = this.currentResults.map((result, index) => ({
                '#': index + 1,
                'Titolo': result.title,
                'Descrizione': result.description,
                'Fonte': this.getSourceName(result.source),
                'Categoria': result.category,
                'Data': new Date(result.date).toLocaleDateString('it-IT'),
                'URL': result.url,
                'Tags': result.tags.join(', ')
            }));
            
            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(data);
            
            // Set column widths
            ws['!cols'] = [
                { wch: 5 },   // #
                { wch: 40 },  // Titolo
                { wch: 60 },  // Descrizione
                { wch: 20 },  // Fonte
                { wch: 15 },  // Categoria
                { wch: 12 },  // Data
                { wch: 50 },  // URL
                { wch: 30 }   // Tags
            ];
            
            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Risultati');
            
            // Save file
            XLSX.writeFile(wb, 'propa-risultati.xlsx');
            this.showSuccess('Excel esportato con successo!');
        } catch (error) {
            console.error('Error exporting Excel:', error);
            this.showError('Errore durante l\'esportazione di Excel');
        }
    }

    // Export to Word (simplified HTML-based approach)
    exportToWord() {
        if (this.currentResults.length === 0) {
            this.showError('Nessun risultato da esportare');
            return;
        }

        try {
            // Create HTML content for Word
            let htmlContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <title>Pro PA - Risultati della Ricerca</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h1 { color: #0066CC; }
                        .result { margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
                        .result-title { color: #0066CC; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
                        .result-meta { color: #666; font-size: 12px; margin-bottom: 10px; }
                        .result-description { margin-bottom: 10px; line-height: 1.6; }
                        .result-url { color: #0066CC; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <h1>Pro PA - Risultati della Ricerca</h1>
                    <p>Esportato il: ${new Date().toLocaleDateString('it-IT')}</p>
                    <p>Numero di risultati: ${this.currentResults.length}</p>
                    <hr>
            `;
            
            this.currentResults.forEach((result, index) => {
                htmlContent += `
                    <div class="result">
                        <div class="result-title">${index + 1}. ${result.title}</div>
                        <div class="result-meta">
                            Fonte: ${this.getSourceName(result.source)} | 
                            Categoria: ${result.category} | 
                            Data: ${new Date(result.date).toLocaleDateString('it-IT')}
                        </div>
                        <div class="result-description">${result.description}</div>
                        <div class="result-url">URL: ${result.url}</div>
                        <div class="result-meta">Tags: ${result.tags.join(', ')}</div>
                    </div>
                `;
            });
            
            htmlContent += '</body></html>';
            
            // Create Blob and download
            const blob = new Blob(['\ufeff', htmlContent], {
                type: 'application/msword'
            });
            
            saveAs(blob, 'propa-risultati.doc');
            this.showSuccess('Word esportato con successo!');
        } catch (error) {
            console.error('Error exporting Word:', error);
            this.showError('Errore durante l\'esportazione di Word');
        }
    }

    // Helper method to get source name
    getSourceName(sourceId) {
        const sources = {
            'datigov': 'dati.gov.it',
            'normattiva': 'Normattiva',
            'gazzetta': 'Gazzetta Ufficiale',
            'innovazione': 'Innovazione.gov.it'
        };
        return sources[sourceId] || sourceId;
    }

    // Show success message
    showSuccess(message) {
        if (window.showToast) {
            window.showToast(message, 'success');
        }
    }

    // Show error message
    showError(message) {
        if (window.showToast) {
            window.showToast(message, 'error');
        }
    }
}

// Export singleton instance
const exportManager = new ExportManager();
