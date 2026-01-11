/**
 * Local storage utility with fallback to memory
 */
const memoryStorage = {};

const storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
    }
  },

  getToken() {
    return this.get('token');
  },

  setToken(token) {
    this.set('token', token);
  },

  getUser() {
    const user = this.get('user');
    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    this.set('user', JSON.stringify(user));
  },

  getTheme() {
    return this.get('theme');
  },

  setTheme(theme) {
    this.set('theme', theme);
  }
};

export { storage };
