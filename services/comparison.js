import api from './api';

/**
 * Compara múltiples jugadores
 * @param {Array<number>} playerIds - Array de IDs de jugadores (2-4 jugadores)
 * @param {Object} filters - Filtros de comparación
 * @returns {Promise<Object>} - Datos de comparación
 */
export const comparePlayers = async (playerIds, filters = {}) => {
  try {
    if (!playerIds || !Array.isArray(playerIds)) {
      throw new Error('Se requiere un array de IDs de jugadores');
    }

    if (playerIds.length < 2 || playerIds.length > 4) {
      throw new Error('Se pueden comparar entre 2 y 4 jugadores');
    }

    const response = await api.post('/api/statistics/compare/players', {
      playerIds,
      filters
    });

    return response.data;
  } catch (error) {
    console.error('Error al comparar jugadores:', error);
    throw error;
  }
};

/**
 * Genera datos para gráfico radar de comparación
 * @param {Array<number>} playerIds - Array de IDs de jugadores
 * @param {Object} filters - Filtros de comparación
 * @returns {Promise<Object>} - Datos del gráfico radar
 */
export const generateRadarChart = async (playerIds, filters = {}) => {
  try {
    if (!playerIds || !Array.isArray(playerIds)) {
      throw new Error('Se requiere un array de IDs de jugadores');
    }

    if (playerIds.length < 2 || playerIds.length > 4) {
      throw new Error('Se pueden comparar entre 2 y 4 jugadores');
    }

    const response = await api.post('/api/statistics/compare/radar-chart', {
      playerIds,
      filters
    });

    return response.data;
  } catch (error) {
    console.error('Error al generar gráfico radar:', error);
    throw error;
  }
};

/**
 * Genera datos de visualización para diferentes tipos de gráficos
 * @param {Array<number>} playerIds - Array de IDs de jugadores
 * @param {string} chartType - Tipo de gráfico ('radar', 'bar', 'line')
 * @param {Object} filters - Filtros de comparación
 * @returns {Promise<Object>} - Datos de visualización
 */
export const generateVisualization = async (playerIds, chartType = 'radar', filters = {}) => {
  try {
    if (!playerIds || !Array.isArray(playerIds)) {
      throw new Error('Se requiere un array de IDs de jugadores');
    }

    const validChartTypes = ['radar', 'bar', 'line'];
    if (!validChartTypes.includes(chartType)) {
      throw new Error(`Tipo de gráfico debe ser uno de: ${validChartTypes.join(', ')}`);
    }

    const response = await api.post('/api/statistics/compare/visualization', {
      playerIds,
      chartType,
      filters
    });

    return response.data;
  } catch (error) {
    console.error('Error al generar visualización:', error);
    throw error;
  }
};

/**
 * Obtiene jugadores por posición para sugerencias de comparación
 * @param {string} position - Posición del jugador
 * @param {number} limit - Límite de resultados
 * @returns {Promise<Array>} - Lista de jugadores en la misma posición
 */
export const getPlayersByPosition = async (position, limit = 20) => {
  try {
    if (!position) {
      throw new Error('Se requiere especificar una posición');
    }

    const response = await api.get(`/api/statistics/compare/players-by-position/${position}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jugadores por posición ${position}:`, error);
    throw error;
  }
};

/**
 * Obtiene sugerencias de comparación para un jugador
 * @param {number} playerId - ID del jugador
 * @param {number} limit - Límite de sugerencias
 * @returns {Promise<Array>} - Lista de jugadores sugeridos para comparar
 */
export const getComparisonSuggestions = async (playerId, limit = 10) => {
  try {
    if (!playerId) {
      throw new Error('Se requiere el ID del jugador');
    }

    const response = await api.get(`/api/statistics/compare/suggestions/${playerId}?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener sugerencias de comparación para jugador ${playerId}:`, error);
    throw error;
  }
};

/**
 * Obtiene métricas de gráfico radar para una posición específica
 * @param {string} position - Posición del jugador
 * @returns {Promise<Object>} - Métricas y configuración del radar
 */
export const getRadarMetrics = async (position) => {
  try {
    if (!position) {
      throw new Error('Se requiere especificar una posición');
    }

    const response = await api.get(`/api/statistics/compare/radar-metrics/${position}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener métricas radar para posición ${position}:`, error);
    throw error;
  }
};

/**
 * Busca jugadores para comparación
 * @param {string} query - Término de búsqueda
 * @param {Object} filters - Filtros adicionales
 * @returns {Promise<Array>} - Lista de jugadores encontrados
 */
export const searchPlayersForComparison = async (query, filters = {}) => {
  try {
    if (!query || query.length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres');
    }

    const response = await api.get(`/api/search/players?q=${encodeURIComponent(query)}&limit=20`);
    return response.data;
  } catch (error) {
    console.error(`Error al buscar jugadores con término "${query}":`, error);
    throw error;
  }
};

/**
 * Exporta una comparación en formato específico
 * @param {Object} comparisonData - Datos de la comparación
 * @param {string} format - Formato de exportación ('pdf', 'png', 'json')
 * @returns {Promise<Object>} - Resultado de la exportación
 */
export const exportComparison = async (comparisonData, format = 'json') => {
  try {
    if (!comparisonData) {
      throw new Error('Se requieren los datos de la comparación');
    }

    const validFormats = ['pdf', 'png', 'json'];
    if (!validFormats.includes(format)) {
      throw new Error(`Formato debe ser uno de: ${validFormats.join(', ')}`);
    }

    const response = await api.post('/api/statistics/compare/export', {
      comparisonData,
      format
    });

    return response.data;
  } catch (error) {
    console.error(`Error al exportar comparación:`, error);
    throw error;
  }
};

/**
 * Genera un reporte compartible de la comparación
 * @param {Object} comparisonData - Datos de la comparación
 * @returns {Promise<Object>} - Reporte compartible
 */
export const generateShareableReport = async (comparisonData) => {
  try {
    if (!comparisonData) {
      throw new Error('Se requieren los datos de la comparación');
    }

    const response = await api.post('/api/statistics/compare/share', {
      comparisonData
    });

    return response.data;
  } catch (error) {
    console.error('Error al generar reporte compartible:', error);
    throw error;
  }
};

/**
 * Guarda una comparación para acceso posterior
 * @param {Object} comparisonData - Datos de la comparación
 * @returns {Promise<Object>} - Comparación guardada
 */
export const saveComparison = async (comparisonData) => {
  try {
    if (!comparisonData) {
      throw new Error('Se requieren los datos de la comparación');
    }

    const response = await api.post('/api/statistics/compare/save', comparisonData);
    return response.data;
  } catch (error) {
    console.error('Error al guardar comparación:', error);
    throw error;
  }
};

/**
 * Obtiene comparaciones guardadas del usuario
 * @returns {Promise<Array>} - Lista de comparaciones guardadas
 */
export const getSavedComparisons = async () => {
  try {
    const response = await api.get('/api/statistics/compare/saved');
    return response.data;
  } catch (error) {
    console.error('Error al obtener comparaciones guardadas:', error);
    throw error;
  }
};