// auth.js - User authentication management

class AuthManager {
    constructor() {
        this.USERS_KEY = 'propa_users';
        this.CURRENT_USER_KEY = 'propa_current_user';
        this.currentUser = this.getCurrentUser();
    }

    // Hash password (simple implementation for demo - in production use proper hashing)
    hashPassword(password) {
        // Simple hash for demo purposes
        // In production, use bcrypt or similar on the server side
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Register new user
    register(name, email, password) {
        // Validate inputs
        if (!name || name.trim().length < 2) {
            return { success: false, message: 'Il nome deve contenere almeno 2 caratteri' };
        }

        if (!this.validateEmail(email)) {
            return { success: false, message: 'Email non valida' };
        }

        if (password.length < 6) {
            return { success: false, message: 'La password deve contenere almeno 6 caratteri' };
        }

        // Get existing users
        const users = this.getUsers();

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email già registrata' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            passwordHash: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        this.saveUsers(users);

        // Auto-login after registration
        this.setCurrentUser(newUser);

        return { success: true, message: 'Registrazione completata con successo', user: newUser };
    }

    // Login user
    login(email, password) {
        if (!this.validateEmail(email)) {
            return { success: false, message: 'Email non valida' };
        }

        const users = this.getUsers();
        const user = users.find(u => u.email === email.toLowerCase().trim());

        if (!user) {
            return { success: false, message: 'Credenziali non valide' };
        }

        const passwordHash = this.hashPassword(password);
        if (user.passwordHash !== passwordHash) {
            return { success: false, message: 'Credenziali non valide' };
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        this.saveUsers(users);

        // Set current user
        this.setCurrentUser(user);

        return { success: true, message: 'Accesso effettuato con successo', user: user };
    }

    // Logout current user
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        this.currentUser = null;
        return { success: true, message: 'Disconnessione effettuata' };
    }

    // Get current logged in user
    getCurrentUser() {
        try {
            const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
            if (!userStr) return null;
            
            const user = JSON.parse(userStr);
            this.currentUser = user;
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Set current user
    setCurrentUser(user) {
        try {
            // Don't store password hash in current user session
            const userSession = {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            };
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userSession));
            this.currentUser = userSession;
        } catch (error) {
            console.error('Error setting current user:', error);
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get all users (for internal use only)
    getUsers() {
        try {
            const users = localStorage.getItem(this.USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            console.error('Error reading users:', error);
            return [];
        }
    }

    // Save users
    saveUsers(users) {
        try {
            localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        } catch (error) {
            console.error('Error saving users:', error);
        }
    }

    // Update user profile
    updateProfile(name, email) {
        if (!this.isLoggedIn()) {
            return { success: false, message: 'Devi essere autenticato' };
        }

        if (!name || name.trim().length < 2) {
            return { success: false, message: 'Il nome deve contenere almeno 2 caratteri' };
        }

        if (!this.validateEmail(email)) {
            return { success: false, message: 'Email non valida' };
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);

        if (userIndex === -1) {
            return { success: false, message: 'Utente non trovato' };
        }

        // Check if new email is already taken by another user
        const emailExists = users.find(u => u.email === email.toLowerCase().trim() && u.id !== this.currentUser.id);
        if (emailExists) {
            return { success: false, message: 'Email già utilizzata da un altro utente' };
        }

        // Update user
        users[userIndex].name = name.trim();
        users[userIndex].email = email.toLowerCase().trim();
        this.saveUsers(users);

        // Update current user session
        this.setCurrentUser(users[userIndex]);

        return { success: true, message: 'Profilo aggiornato con successo' };
    }

    // Change password
    changePassword(currentPassword, newPassword) {
        if (!this.isLoggedIn()) {
            return { success: false, message: 'Devi essere autenticato' };
        }

        if (newPassword.length < 6) {
            return { success: false, message: 'La nuova password deve contenere almeno 6 caratteri' };
        }

        const users = this.getUsers();
        const user = users.find(u => u.id === this.currentUser.id);

        if (!user) {
            return { success: false, message: 'Utente non trovato' };
        }

        // Verify current password
        const currentPasswordHash = this.hashPassword(currentPassword);
        if (user.passwordHash !== currentPasswordHash) {
            return { success: false, message: 'Password corrente non corretta' };
        }

        // Update password
        user.passwordHash = this.hashPassword(newPassword);
        this.saveUsers(users);

        return { success: true, message: 'Password modificata con successo' };
    }
}

// Export singleton instance
const authManager = new AuthManager();
