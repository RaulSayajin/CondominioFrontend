import api from './api';

export const financeiroService = {
  // ==========================================
  // FLUXO DE DESPESAS E BALANCETE
  // ==========================================

  /** 
   * Gera o balancete analítico mensal de um condomínio.
   */
  getBalancete: async (condominioId) => {
    const response = await api.get(`/financeiro/${condominioId}/balancete`);
    return response.data;
  },

  /** 
   * Lança uma nova despesa financeira.
   */
  lancarDespesa: async (data) => {
    const response = await api.post('/financeiro/despesas', data);
    return response.data;
  },

  // ==========================================
  // COBRANÇAS E PAGAMENTOS
  // ==========================================

  /** 
   * Lista a composição das cobranças das unidades de um condomínio.
   */
  getCobrancas: async (condominioId) => {
    const response = await api.get(`/cobrancas/${condominioId}`);
    return response.data;
  },

  /** 
   * Registra o pagamento detalhado de uma cobrança (via PATCH).
   */
  registrarPagamento: async (cobrancaId, dadosPagamento) => {
    const response = await api.patch(`/cobrancas/${cobrancaId}/pagamento`, dadosPagamento);
    return response.data;
  },

  // ==========================================
  // PROCESSAMENTO DE RATEIO
  // ==========================================

  /** 
   * Gera ou recalcula as cobranças mensais (rateio) de um condomínio.
   */
  gerarRateioMensal: async (condominioId) => {
    const response = await api.post(`/rateio/${condominioId}/gerar`);
    return response.data;
  },

  /** 
   * Lista o rateio mensal com status por unidade.
   */
  listarStatusRateio: async (condominioId) => {
    const response = await api.get(`/rateio/${condominioId}`);
    return response.data;
  },
  listarCobrancasRecorrentes: async (condominioId) => {
    const response = await api.get(`/condominios/${condominioId}/cobrancas-recorrentes`);
    return response.data;
  },

  criarCobrancaRecorrente: async (condominioId, data) => {
    const response = await api.post(`/condominios/${condominioId}/cobrancas-recorrentes`, data);
    return response.data;
  },

  atualizarCobrancaRecorrente: async (id, data) => {
    const response = await api.put(`/cobrancas-recorrentes/${id}`, data);
    return response.data;
  },

  excluirCobrancaRecorrente: async (id) => {
    const response = await api.delete(`/cobrancas-recorrentes/${id}`);
    return response.data;
  },
};