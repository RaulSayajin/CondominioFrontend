import api from './api';

// Constante para evitar erros de digitação e facilitar manutenção
const TOKEN_KEY = '@CondominioMaster:token';

export const authService = {
  /**
   * Realiza o login do administrador e armazena o token.
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // Salva o token para uso do interceptor no api.js
    if (response.data?.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    
    return response.data;
  },

  /**
   * Retorna os dados do usuário autenticado.
   */
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Remove o token de autenticação e desloga o usuário.
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  }
};