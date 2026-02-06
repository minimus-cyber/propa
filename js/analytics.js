// analytics.js - Data analysis and statistics for search results

class AnalyticsManager {
    constructor() {
        this.currentResults = [];
    }

    setResults(results) {
        this.currentResults = results;
    }

    // Analyze current search results
    analyzeResults() {
        if (this.currentResults.length === 0) {
            return null;
        }

        const analysis = {
            total: this.currentResults.length,
            bySource: this.analyzeBySource(),
            byCategory: this.analyzeByCategory(),
            byDate: this.analyzeByDate(),
            timeline: this.createTimeline(),
            tags: this.analyzeTopTags()
        };

        return analysis;
    }

    // Analyze distribution by source
    analyzeBySource() {
        const distribution = {};
        
        this.currentResults.forEach(result => {
            const source = result.source;
            if (!distribution[source]) {
                distribution[source] = {
                    count: 0,
                    name: this.getSourceName(source),
                    percentage: 0
                };
            }
            distribution[source].count++;
        });

        // Calculate percentages
        const total = this.currentResults.length;
        Object.keys(distribution).forEach(source => {
            distribution[source].percentage = ((distribution[source].count / total) * 100).toFixed(1);
        });

        return distribution;
    }

    // Analyze distribution by category
    analyzeByCategory() {
        const distribution = {};
        
        this.currentResults.forEach(result => {
            const category = result.category || 'altro';
            if (!distribution[category]) {
                distribution[category] = {
                    count: 0,
                    percentage: 0
                };
            }
            distribution[category].count++;
        });

        // Calculate percentages
        const total = this.currentResults.length;
        Object.keys(distribution).forEach(category => {
            distribution[category].percentage = ((distribution[category].count / total) * 100).toFixed(1);
        });

        // Sort by count descending
        return Object.fromEntries(
            Object.entries(distribution).sort((a, b) => b[1].count - a[1].count)
        );
    }

    // Analyze distribution by date (year and month)
    analyzeByDate() {
        const yearDistribution = {};
        const monthDistribution = {};
        
        this.currentResults.forEach(result => {
            const date = new Date(result.date);
            
            // Validate date before using
            if (isNaN(date.getTime())) {
                return; // Skip invalid dates
            }
            
            const year = date.getFullYear();
            const month = date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' });
            
            // Year distribution
            if (!yearDistribution[year]) {
                yearDistribution[year] = 0;
            }
            yearDistribution[year]++;
            
            // Month distribution
            if (!monthDistribution[month]) {
                monthDistribution[month] = 0;
            }
            monthDistribution[month]++;
        });

        return {
            byYear: yearDistribution,
            byMonth: monthDistribution
        };
    }

    // Create timeline of results
    createTimeline() {
        const timeline = this.currentResults
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10) // Top 10 most recent
            .map(result => ({
                title: result.title,
                date: result.date,
                source: this.getSourceName(result.source),
                category: result.category
            }));

        return timeline;
    }

    // Analyze top tags
    analyzeTopTags() {
        const tagCounts = {};
        
        this.currentResults.forEach(result => {
            if (result.tags && Array.isArray(result.tags)) {
                result.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        // Sort by count and get top 10
        return Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));
    }

    // Analyze search history patterns
    analyzeHistory() {
        const history = storageManager.getHistory();
        
        if (history.length === 0) {
            return null;
        }

        const analysis = {
            totalSearches: history.length,
            recentActivity: this.analyzeRecentActivity(history),
            topSearchTerms: this.analyzeTopSearchTerms(history),
            searchFrequency: this.analyzeSearchFrequency(history),
            filterUsage: this.analyzeFilterUsage(history)
        };

        return analysis;
    }

    // Analyze recent activity
    analyzeRecentActivity(history) {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        
        const recentSearches = history.filter(item => 
            new Date(item.timestamp) > last7Days
        );

        return {
            count: recentSearches.length,
            averagePerDay: (recentSearches.length / 7).toFixed(1)
        };
    }

    // Analyze top search terms
    analyzeTopSearchTerms(history) {
        const termCounts = {};
        
        history.forEach(item => {
            const term = item.query.toLowerCase();
            termCounts[term] = (termCounts[term] || 0) + 1;
        });

        return Object.entries(termCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([term, count]) => ({ term, count }));
    }

    // Analyze search frequency over time
    analyzeSearchFrequency(history) {
        const frequency = {};
        
        history.forEach(item => {
            const date = new Date(item.timestamp);
            const dayKey = date.toLocaleDateString('it-IT');
            frequency[dayKey] = (frequency[dayKey] || 0) + 1;
        });

        return frequency;
    }

    // Analyze filter usage patterns
    analyzeFilterUsage(history) {
        const filterStats = {
            sourceFilters: {},
            categoryFilters: {},
            dateRangeUsage: 0
        };

        history.forEach(item => {
            if (item.filters) {
                // Source filters
                if (item.filters.source && item.filters.source !== 'all') {
                    const source = item.filters.source;
                    filterStats.sourceFilters[source] = (filterStats.sourceFilters[source] || 0) + 1;
                }

                // Category filters
                if (item.filters.category && item.filters.category !== 'all') {
                    const category = item.filters.category;
                    filterStats.categoryFilters[category] = (filterStats.categoryFilters[category] || 0) + 1;
                }

                // Date range usage
                if (item.filters.dateFrom || item.filters.dateTo) {
                    filterStats.dateRangeUsage++;
                }
            }
        });

        return filterStats;
    }

    // Analyze bookmarks
    analyzeBookmarks() {
        const bookmarks = storageManager.getBookmarks();
        
        if (bookmarks.length === 0) {
            return null;
        }

        const analysis = {
            total: bookmarks.length,
            bySource: {},
            byCategory: {},
            mostRecent: bookmarks.slice(0, 5).map(b => ({
                title: b.title,
                source: this.getSourceName(b.source),
                bookmarkedAt: b.bookmarkedAt
            }))
        };

        // Analyze by source
        bookmarks.forEach(bookmark => {
            const source = bookmark.source;
            if (!analysis.bySource[source]) {
                analysis.bySource[source] = {
                    count: 0,
                    name: this.getSourceName(source)
                };
            }
            analysis.bySource[source].count++;
        });

        // Analyze by category
        bookmarks.forEach(bookmark => {
            const category = bookmark.category || 'altro';
            if (!analysis.byCategory[category]) {
                analysis.byCategory[category] = 0;
            }
            analysis.byCategory[category]++;
        });

        return analysis;
    }

    // Generate comprehensive analytics report
    generateFullReport() {
        return {
            results: this.analyzeResults(),
            history: this.analyzeHistory(),
            bookmarks: this.analyzeBookmarks(),
            generatedAt: new Date().toISOString()
        };
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

    // Export analytics data
    exportAnalytics() {
        const report = this.generateFullReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pro-pa-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    }
}

// Export singleton instance
const analyticsManager = new AnalyticsManager();
