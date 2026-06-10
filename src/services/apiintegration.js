
// Detectar ambiente e usar URL apropriada
const getApiUrl = () => {
  // Ambiente de desenvolvimento local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // GitHub Codespaces (reconhecer .github.dev)
  if (window.location.hostname.includes('.github.dev')) {
    const baseUrl = window.location.hostname.split('-')[0];
    return `https://${baseUrl}-5000.app.github.dev`;
  }
  
  // Produção (Vercel consumindo Render)
  // Certifique-se de configurar VITE_API_URL no painel da Vercel
  // Exemplo: https://condominios-api.onrender.com
  return import.meta.env.VITE_API_URL || 'https://condominiobackend.onrender.com';
};

const API_URL = getApiUrl();

/**
 * Chamar rota base da API
 * GET /
 */
export async function testarAPIBase() {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API respondendo:', data);
    return data;
  } catch (error) {
    console.error('Erro ao chamar API base:', error);
    throw error;
  }
}

/**
 * Chamar rota v1 da API
 * GET /v1
 */
export async function testarAPIv1() {
  try {
    const response = await fetch(`${API_URL}/v1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API v1 respondendo:', data);
    return data;
  } catch (error) {
    console.error('Erro ao chamar API v1:', error);
    throw error;
  }
}

/**
 * Chamar endpoints da API (requer token JWT)
 */
export async function chamarEndpointAPI(endpoint, opcoes = {}) {
  const token = localStorage.getItem('@CondominioMaster:token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...opcoes.headers,
  };
  
  // Adicionar token se existir
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...opcoes,
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao chamar ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Exemplo de uso em componente React
 */
export function ExemploComponente() {
  const [dados, setDados] = React.useState(null);
  const [carregando, setCarregando] = React.useState(false);
  const [erro, setErro] = React.useState(null);

  const buscarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      // Testar rota base
      const baseData = await testarAPIBase();
      
      // Testar rota v1
      const v1Data = await testarAPIv1();
      
      setDados({
        base: baseData,
        v1: v1Data,
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  React.useEffect(() => {
    buscarDados();
  }, []);

  if (carregando) return <div>Carregando...</div>;
  if (erro) return <div>Erro: {erro}</div>;

  return (
    <div>
      <h1>Status da API</h1>
      {dados && (
        <>
          <div>
            <h2>Rota Base</h2>
            <pre>{JSON.stringify(dados.base, null, 2)}</pre>
          </div>
          <div>
            <h2>Rota v1</h2>
            <pre>{JSON.stringify(dados.v1, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Variáveis de ambiente esperadas no .env
 */
// VITE_API_URL=https://seu-app.onrender.com

export { API_URL };