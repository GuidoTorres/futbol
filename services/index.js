import api from './api';

export * from './matches';
export * from './teams';
export * from './players';
export * from './leagues';
export * from './events';
export * from './search';
export * from './favorites';
export * from './comparison';
export * from './predictions';

// Funciones generales
/**
 * Obtiene la lista de países disponibles en SofaScore
 * @returns {Promise<Array>} - Lista de países
 */
export const getSofaScoreCountries = async () => {
  try {
    const response = await api.get('/api/sofascore/countries');
    return response.data;
  } catch (error) {
    console.error('Error al obtener países de SofaScore:', error);
    throw error;
  }
};

/**
 * Obtiene la estructura de datos de SofaScore
 * @returns {Promise<Object>} - Estructura de datos
 */
export const getSofaScoreStructure = async () => {
  try {
    const response = await api.get('/api/sofascore/structure');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estructura de SofaScore:', error);
    throw error;
  }
};

/**
 * Realiza una búsqueda general en la base de datos
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Object>} - Resultados de la búsqueda
 */
export const searchData = async (query) => {
  try {
    const response = await api.get(`/api/search/data?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error al realizar búsqueda con término "${query}":`, error);
    throw error;
  }
};

export default api;
