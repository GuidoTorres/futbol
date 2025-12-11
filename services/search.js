import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Realiza una búsqueda general en la base de datos
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Object>} - Resultados de la búsqueda
 */
export const searchData = async (query) => {
  try {
    if (!query || query.length < 3) {
      throw new Error('El término de búsqueda debe tener al menos 3 caracteres');
    }
    
    const response = await api.get(`/api/search/data?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error al realizar búsqueda con término "${query}":`, error);
    throw error;
  }
};

/**
 * Aplica filtros a una búsqueda
 * @param {Object} filters - Filtros a aplicar
 * @returns {Promise<Object>} - Resultados filtrados
 */
export const applyFilters = async (filters) => {
  try {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Para arrays, agregar cada valor como parámetro separado
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, value);
        }
      }
    });
    
    const response = await api.get(`/api/filters/apply?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error aplicando filtros:', error);
    throw error;
  }
};

/**
 * Obtiene las opciones disponibles para filtros
 * @returns {Promise<Object>} - Opciones de filtros
 */
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/api/filters/options');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo opciones de filtros:', error);
    throw error;
  }
};

/**
 * Guarda un filtro como favorito
 * @param {string} userId - ID del usuario
 * @param {string} name - Nombre del filtro
 * @param {Object} config - Configuración del filtro
 * @returns {Promise<Object>} - Filtro guardado
 */
export const saveFavoriteFilter = async (userId, name, config) => {
  try {
    const response = await api.post(`/api/filters/favorites/${userId}`, {
      name,
      config
    });
    
    // Actualizar cache local
    await updateLocalFavoriteFilters(userId);
    
    return response.data;
  } catch (error) {
    console.error('Error guardando filtro favorito:', error);
    throw error;
  }
};

/**
 * Obtiene los filtros favoritos del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} - Lista de filtros favoritos
 */
export const getFavoriteFilters = async (userId) => {
  try {
    // Intentar obtener del cache local primero
    const cached = await getLocalFavoriteFilters(userId);
    if (cached) {
      return cached;
    }
    
    const response = await api.get(`/api/filters/favorites/${userId}`);
    
    // Guardar en cache local
    await saveLocalFavoriteFilters(userId, response.data.filters);
    
    return response.data.filters;
  } catch (error) {
    console.error('Error obteniendo filtros favoritos:', error);
    throw error;
  }
};

/**
 * Elimina un filtro favorito
 * @param {string} userId - ID del usuario
 * @param {string} filterId - ID del filtro
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deleteFavoriteFilter = async (userId, filterId) => {
  try {
    const response = await api.delete(`/api/filters/favorites/${userId}/${filterId}`);
    
    // Actualizar cache local
    await updateLocalFavoriteFilters(userId);
    
    return response.data;
  } catch (error) {
    console.error('Error eliminando filtro favorito:', error);
    throw error;
  }
};

/**
 * Guarda filtros favoritos en cache local
 */
const saveLocalFavoriteFilters = async (userId, filters) => {
  try {
    await AsyncStorage.setItem(
      `favorite_filters_${userId}`,
      JSON.stringify({
        filters,
        timestamp: Date.now()
      })
    );
  } catch (error) {
    console.error('Error guardando filtros en cache local:', error);
  }
};

/**
 * Obtiene filtros favoritos del cache local
 */
const getLocalFavoriteFilters = async (userId) => {
  try {
    const cached = await AsyncStorage.getItem(`favorite_filters_${userId}`);
    if (cached) {
      const { filters, timestamp } = JSON.parse(cached);
      // Cache válido por 1 hora
      if (Date.now() - timestamp < 3600000) {
        return filters;
      }
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo filtros del cache local:', error);
    return null;
  }
};

/**
 * Actualiza el cache local de filtros favoritos
 */
const updateLocalFavoriteFilters = async (userId) => {
  try {
    const response = await api.get(`/api/filters/favorites/${userId}`);
    await saveLocalFavoriteFilters(userId, response.data.filters);
  } catch (error) {
    console.error('Error actualizando cache de filtros:', error);
  }
};

/**
 * Obtiene sugerencias de búsqueda para autocompletado
 * @param {string} query - Término de búsqueda parcial
 * @returns {Promise<Array>} - Lista de sugerencias
 */
export const getSearchSuggestions = async (query) => {
  try {
    if (!query || query.length < 2) {
      return [];
    }
    
    const response = await api.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data.suggestions || [];
  } catch (error) {
    console.error('Error obteniendo sugerencias:', error);
    // Return empty array on error to avoid breaking the UI
    return [];
  }
};

/**
 * Guarda una búsqueda en el historial local
 * @param {string} query - Término de búsqueda
 * @returns {Promise<void>}
 */
export const saveSearchHistory = async (query) => {
  try {
    const HISTORY_KEY = 'search_history';
    const MAX_HISTORY_ITEMS = 20;
    
    // Get existing history
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    let history = historyJson ? JSON.parse(historyJson) : [];
    
    // Remove duplicate if exists
    history = history.filter(item => item.query !== query);
    
    // Add new item at the beginning
    history.unshift({
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
    });
    
    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    // Save back to storage
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error guardando historial de búsqueda:', error);
  }
};

/**
 * Obtiene el historial de búsquedas
 * @returns {Promise<Array>} - Lista de búsquedas recientes
 */
export const getSearchHistory = async () => {
  try {
    const HISTORY_KEY = 'search_history';
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error obteniendo historial de búsqueda:', error);
    return [];
  }
};

/**
 * Limpia todo el historial de búsquedas
 * @returns {Promise<void>}
 */
export const clearSearchHistory = async () => {
  try {
    const HISTORY_KEY = 'search_history';
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error limpiando historial de búsqueda:', error);
  }
};

/**
 * Elimina un elemento específico del historial
 * @param {string} itemId - ID del elemento a eliminar
 * @returns {Promise<void>}
 */
export const deleteSearchHistoryItem = async (itemId) => {
  try {
    const HISTORY_KEY = 'search_history';
    const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
    
    if (historyJson) {
      let history = JSON.parse(historyJson);
      history = history.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.error('Error eliminando elemento del historial:', error);
  }
};