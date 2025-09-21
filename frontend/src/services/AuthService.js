import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/auth';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.token = token;

      return { success: true, token, user };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  }

  async register(name, email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password
      });

      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      this.token = token;

      return { success: true, token, user };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrarse' 
      };
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.token = null;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.token && !!this.getCurrentUser();
  }

  getToken() {
    return this.token;
  }

  // OAuth methods for future implementation
  async loginWithGoogle() {
    // TO DO: Implement Google OAuth
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  }

  async loginWithGitHub() {
    // TO DO: Implement GitHub OAuth
    window.location.href = `${API_BASE_URL}/oauth2/authorization/github`;
  }
}

export default new AuthService();
