import axios from 'axios';
import { API_SETTINGS } from '../config/api.js';

// Crear instancia de axios con configuración mejorada
const api = axios.create({
  baseURL: API_SETTINGS.baseURL,
  timeout: API_SETTINGS.timeout,
  headers: API_SETTINGS.headers,
});

// Función para implementar reintentos
const axiosRetry = async (config, retries = API_SETTINGS.retries) => {
  try {
    return await api(config);
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      console.log(`🔄 Retrying request... (${API_SETTINGS.retries - retries + 1}/${API_SETTINGS.retries})`);
      await new Promise(resolve => setTimeout(resolve, API_SETTINGS.retryDelay));
      return axiosRetry(config, retries - 1);
    }
    throw error;
  }
};

// Determinar si se debe reintentar la petición
const shouldRetry = (error) => {
  return (
    !error.response || // Error de red
    error.response.status >= 500 || // Error del servidor
    error.response.status === 408 || // Timeout
    error.code === 'ECONNABORTED' // Timeout de axios
  );
};

// Interceptores para logging y manejo de errores
api.interceptors.request.use(
  config => {
    const method = config.method?.toUpperCase() || 'GET';
    const url = `${config.baseURL}${config.url}`;
    console.log(`🚀 API Request: ${method} ${url}`);
    
    // Agregar timestamp para debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  error => {
    console.error('❌ Request Setup Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    const duration = new Date() - response.config.metadata.startTime;
    console.log(`✅ API Response: ${response.status} (${duration}ms) from ${response.config.url}`);
    return response;
  },
  error => {
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
    
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(`❌ API Error: ${error.response.status} (${duration}ms)`, {
        url: error.config?.url,
        data: error.response.data,
        status: error.response.status
      });
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error(`❌ Network Error (${duration}ms):`, {
        url: error.config?.url,
        message: error.message,
        code: error.code
      });
    } else {
      // Error en la configuración de la petición
      console.error('❌ Request Configuration Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funciones helper para peticiones comunes
export const apiHelpers = {
  // GET con reintentos automáticos
  get: (url, config = {}) => axiosRetry({ ...config, method: 'get', url }),
  
  // POST con reintentos automáticos
  post: (url, data, config = {}) => axiosRetry({ ...config, method: 'post', url, data }),
  
  // PUT con reintentos automáticos
  put: (url, data, config = {}) => axiosRetry({ ...config, method: 'put', url, data }),
  
  // DELETE con reintentos automáticos
  delete: (url, config = {}) => axiosRetry({ ...config, method: 'delete', url }),
  
  // Verificar conectividad
  checkConnection: async () => {
    try {
      const response = await api.get('/');
      return { connected: true, response };
    } catch (error) {
      return { connected: false, error };
    }
  }
};

export default api;
