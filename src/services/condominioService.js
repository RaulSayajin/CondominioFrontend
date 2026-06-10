import api from './api';

export const condominioService = {
  // ==========================================
  // GESTÃO DE CONDOMÍNIOS
  // ==========================================

  /** Lista todos os condomínios */
  getAll: async () => {
    const response = await api.get('/condominios');
    console.log('Resposta completa:', response.data);
    return response.data;
  },

  /** Busca um condomínio específico por ID */
  getById: async (id) => {
    const response = await api.get(`/condominios/${id}`);
    console.log('Resposta completa:', response.data);
    return response.data;
  },

  /** Cadastra um novo condomínio */
  create: async (data) => {
    const response = await api.post('/condominios', data);
    console.log('Resposta completa:', response.data);
    return response.data;
  },

  /** Atualiza os dados de um condomínio */
  update: async (id, data) => {
    const response = await api.put(`/condominios/${id}`, data);
    console.log('Resposta completa:', response.data);
    return response.data;
  },

  /** Exclui um condomínio */
  delete: async (id) => {
    const response = await api.delete(`/condominios/${id}`);
    console.log('Resposta completa:', response.data);
    return response.data;
  },

  // ==========================================
  // GESTÃO DE UNIDADES
  // ==========================================

  /** Lista as unidades de um condomínio específico */
  getUnidades: async (condominioId) => {
    const response = await api.get(`/condominios/${condominioId}/unidades`);
    return response.data;
  },

  /** Adiciona uma nova unidade a um condomínio */
  addUnidade: async (condominioId, data) => {
    const response = await api.post(`/condominios/${condominioId}/unidades`, data);
    return response.data;
  },

  /** Atualiza os dados de uma unidade */
  updateUnidade: async (id, data) => {
    const response = await api.put(`/unidades/${id}`, data);
    return response.data;
  },

  /** Remove uma unidade */
  deleteUnidade: async (id) => {
    const response = await api.delete(`/unidades/${id}`);
    return response.data;
  },

  // ==========================================
  // DASHBOARD CONTEXTUAL
  // ==========================================

  /** Retorna o dashboard financeiro de um condomínio */
  getDashboard: async (id) => {
    const response = await api.get(`/condominios/${id}/dashboard`);
    return response.data;
  },
};