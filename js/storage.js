// storage.js - LocalStorage management for history and bookmarks

class StorageManager {
    constructor() {
        this.HISTORY_KEY = 'propa_search_history';
        this.BOOKMARKS_KEY = 'propa_bookmarks';
        this.MAX_HISTORY = 50;
    }

    // History Management
    addToHistory(searchQuery, filters = {}) {
        const history = this.getHistory();
        const entry = {
            id: Date.now(),
            query: searchQuery,
            filters: filters,
            timestamp: new Date().toISOString()
        };
        
        // Add to beginning of array
        history.unshift(entry);
        
        // Keep only MAX_HISTORY items
        const trimmedHistory = history.slice(0, this.MAX_HISTORY);
        
        this.saveHistory(trimmedHistory);
        return entry;
    }

    getHistory() {
        try {
            const history = localStorage.getItem(this.HISTORY_KEY);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error reading history:', error);
            return [];
        }
    }

    saveHistory(history) {
        try {
            localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    deleteHistoryItem(id) {
        const history = this.getHistory();
        const filtered = history.filter(item => item.id !== id);
        this.saveHistory(filtered);
    }

    clearHistory() {
        localStorage.removeItem(this.HISTORY_KEY);
    }

    // Bookmarks Management
    addBookmark(result) {
        const bookmarks = this.getBookmarks();
        
        // Check if already bookmarked
        if (bookmarks.find(b => b.id === result.id)) {
            return false;
        }
        
        const bookmark = {
            ...result,
            bookmarkedAt: new Date().toISOString()
        };
        
        bookmarks.unshift(bookmark);
        this.saveBookmarks(bookmarks);
        return true;
    }

    removeBookmark(id) {
        const bookmarks = this.getBookmarks();
        const filtered = bookmarks.filter(item => item.id !== id);
        this.saveBookmarks(filtered);
        return true;
    }

    getBookmarks() {
        try {
            const bookmarks = localStorage.getItem(this.BOOKMARKS_KEY);
            return bookmarks ? JSON.parse(bookmarks) : [];
        } catch (error) {
            console.error('Error reading bookmarks:', error);
            return [];
        }
    }

    saveBookmarks(bookmarks) {
        try {
            localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    }

    isBookmarked(id) {
        const bookmarks = this.getBookmarks();
        return bookmarks.some(b => b.id === id);
    }

    toggleBookmark(result) {
        if (this.isBookmarked(result.id)) {
            this.removeBookmark(result.id);
            return false;
        } else {
            this.addBookmark(result);
            return true;
        }
    }

    // Statistics
    getStats() {
        return {
            historyCount: this.getHistory().length,
            bookmarksCount: this.getBookmarks().length
        };
    }

    // Export data for user download
    exportData() {
        return {
            history: this.getHistory(),
            bookmarks: this.getBookmarks(),
            exportedAt: new Date().toISOString()
        };
    }

    // Import data from user upload
    importData(data) {
        try {
            if (data.history) {
                this.saveHistory(data.history);
            }
            if (data.bookmarks) {
                this.saveBookmarks(data.bookmarks);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Export singleton instance
const storageManager = new StorageManager();
