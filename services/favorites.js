import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: '@favorites_cache',
  LAST_SYNC: '@favorites_last_sync',
  USER_ID: '@user_id',
  DEVICE_ID: '@device_id'
};

/**
 * Obtiene todos los favoritos de un usuario
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad (opcional): team, player, league, match
 * @returns {Promise<Array>} - Lista de favoritos
 */
export const getUserFavorites = async (userId, entityType = null) => {
  try {
    const params = entityType ? `?entityType=${entityType}` : '';
    const response = await api.get(`/api/favorites/users/${userId}${params}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener favoritos del usuario:', error);
    throw error;
  }
};

/**
 * Obtiene favoritos detallados con información de las entidades
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad (opcional): team, player, league, match
 * @returns {Promise<Array>} - Lista de favoritos con detalles
 */
export const getUserFavoritesDetailed = async (userId, entityType = null) => {
  try {
    const params = entityType ? `?entityType=${entityType}` : '';
    const response = await api.get(`/api/favorites/users/${userId}/detailed${params}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener favoritos detallados:', error);
    throw error;
  }
};

/**
 * Añade un favorito
 * @param {Object} favoriteData - Datos del favorito
 * @param {string|number} favoriteData.userId - ID del usuario
 * @param {string} favoriteData.entityType - Tipo de entidad: team, player, league, match
 * @param {string|number} favoriteData.entityId - ID de la entidad
 * @param {Object} favoriteData.preferences - Preferencias del favorito (opcional)
 * @returns {Promise<Object>} - Favorito creado
 */
export const addFavorite = async (favoriteData) => {
  try {
    const response = await api.post('/api/favorites', favoriteData);
    
    // Actualizar cache local
    await updateLocalFavoritesCache(favoriteData.userId);
    
    return response.data;
  } catch (error) {
    console.error('Error al añadir favorito:', error);
    throw error;
  }
};

/**
 * Elimina un favorito
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad
 * @param {string|number} entityId - ID de la entidad
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const removeFavorite = async (userId, entityType, entityId) => {
  try {
    const response = await api.delete(`/api/favorites/users/${userId}/${entityType}/${entityId}`);
    
    // Actualizar cache local
    await updateLocalFavoritesCache(userId);
    
    return response.data;
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    throw error;
  }
};

/**
 * Actualiza las preferencias de un favorito
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad
 * @param {string|number} entityId - ID de la entidad
 * @param {Object} preferences - Nuevas preferencias
 * @returns {Promise<Object>} - Favorito actualizado
 */
export const updateFavoritePreferences = async (userId, entityType, entityId, preferences) => {
  try {
    const response = await api.put(
      `/api/favorites/users/${userId}/${entityType}/${entityId}/preferences`,
      { preferences }
    );
    
    // Actualizar cache local
    await updateLocalFavoritesCache(userId);
    
    return response.data;
  } catch (error) {
    console.error('Error al actualizar preferencias del favorito:', error);
    throw error;
  }
};

/**
 * Verifica si una entidad es favorita del usuario
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad
 * @param {string|number} entityId - ID de la entidad
 * @returns {Promise<boolean>} - True si es favorito
 */
export const checkFavorite = async (userId, entityType, entityId) => {
  try {
    const response = await api.get(`/api/favorites/users/${userId}/${entityType}/${entityId}/check`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error al verificar favorito:', error);
    throw error;
  }
};

/**
 * Genera un feed personalizado basado en favoritos
 * @param {string|number} userId - ID del usuario
 * @param {number} limit - Límite de elementos (default: 50)
 * @param {number} offset - Elementos a saltar (default: 0)
 * @returns {Promise<Object>} - Feed personalizado
 */
export const generatePersonalizedFeed = async (userId, limit = 50, offset = 0) => {
  try {
    const response = await api.get(
      `/api/favorites/users/${userId}/feed?limit=${limit}&offset=${offset}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al generar feed personalizado:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de favoritos del usuario
 * @param {string|number} userId - ID del usuario
 * @returns {Promise<Object>} - Estadísticas de favoritos
 */
export const getFavoriteStats = async (userId) => {
  try {
    const response = await api.get(`/api/favorites/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de favoritos:', error);
    throw error;
  }
};

// Funciones de sincronización

/**
 * Sincroniza favoritos entre dispositivos
 * @param {string|number} userId - ID del usuario
 * @param {string} deviceId - ID del dispositivo
 * @param {string} lastSyncTimestamp - Timestamp de la última sincronización (opcional)
 * @param {Array} favorites - Favoritos locales para sincronizar (opcional)
 * @returns {Promise<Object>} - Resultado de la sincronización
 */
export const syncFavorites = async (userId, deviceId, lastSyncTimestamp = null, favorites = []) => {
  try {
    const response = await api.post(`/api/favorites/users/${userId}/sync`, {
      deviceId,
      lastSyncTimestamp,
      favorites
    });
    
    // Actualizar timestamp de última sincronización
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    
    return response.data;
  } catch (error) {
    console.error('Error al sincronizar favoritos:', error);
    throw error;
  }
};

/**
 * Fuerza la sincronización completa de favoritos
 * @param {string|number} userId - ID del usuario
 * @param {string} deviceId - ID del dispositivo
 * @returns {Promise<Object>} - Todos los favoritos del servidor
 */
export const forceSyncFavorites = async (userId, deviceId) => {
  try {
    const response = await api.post(`/api/favorites/users/${userId}/force-sync`, {
      deviceId
    });
    
    // Actualizar cache local con todos los favoritos
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(response.data.favorites));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, response.data.syncTimestamp);
    
    return response.data;
  } catch (error) {
    console.error('Error al forzar sincronización de favoritos:', error);
    throw error;
  }
};

/**
 * Obtiene el estado de sincronización del usuario
 * @param {string|number} userId - ID del usuario
 * @returns {Promise<Object>} - Estado de sincronización
 */
export const getSyncStatus = async (userId) => {
  try {
    const response = await api.get(`/api/favorites/users/${userId}/sync-status`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estado de sincronización:', error);
    throw error;
  }
};

/**
 * Resuelve un conflicto de sincronización
 * @param {string|number} userId - ID del usuario
 * @param {string} conflictId - ID del conflicto
 * @param {string} resolution - Resolución: keep_server, keep_client, merge
 * @param {Object} favoriteData - Datos del favorito en conflicto
 * @returns {Promise<Object>} - Resultado de la resolución
 */
export const resolveSyncConflict = async (userId, conflictId, resolution, favoriteData) => {
  try {
    const response = await api.post(`/api/favorites/users/${userId}/resolve-conflict`, {
      conflictId,
      resolution,
      favoriteData
    });
    
    // Actualizar cache local
    await updateLocalFavoritesCache(userId);
    
    return response.data;
  } catch (error) {
    console.error('Error al resolver conflicto de sincronización:', error);
    throw error;
  }
};

// Funciones de cache local

/**
 * Obtiene favoritos del cache local
 * @returns {Promise<Array>} - Favoritos cacheados
 */
export const getCachedFavorites = async () => {
  try {
    const cached = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error al obtener favoritos del cache:', error);
    return [];
  }
};

/**
 * Actualiza el cache local de favoritos
 * @param {string|number} userId - ID del usuario
 */
const updateLocalFavoritesCache = async (userId) => {
  try {
    const favorites = await getUserFavoritesDetailed(userId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error al actualizar cache de favoritos:', error);
  }
};

/**
 * Obtiene la última fecha de sincronización
 * @returns {Promise<string|null>} - Timestamp de última sincronización
 */
export const getLastSyncTimestamp = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  } catch (error) {
    console.error('Error al obtener timestamp de última sincronización:', error);
    return null;
  }
};

/**
 * Limpia el cache de favoritos
 */
export const clearFavoritesCache = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.FAVORITES,
      STORAGE_KEYS.LAST_SYNC
    ]);
  } catch (error) {
    console.error('Error al limpiar cache de favoritos:', error);
  }
};

// Funciones de utilidad

/**
 * Alterna el estado de favorito de una entidad
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad
 * @param {string|number} entityId - ID de la entidad
 * @param {Object} preferences - Preferencias del favorito (opcional)
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const toggleFavorite = async (userId, entityType, entityId, preferences = {}) => {
  try {
    const isFavorite = await checkFavorite(userId, entityType, entityId);
    
    if (isFavorite) {
      await removeFavorite(userId, entityType, entityId);
      return { action: 'removed', isFavorite: false };
    } else {
      await addFavorite({ userId, entityType, entityId, preferences });
      return { action: 'added', isFavorite: true };
    }
  } catch (error) {
    console.error('Error al alternar favorito:', error);
    throw error;
  }
};

/**
 * Obtiene favoritos por tipo con cache
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad
 * @param {boolean} useCache - Usar cache local si está disponible
 * @returns {Promise<Array>} - Favoritos del tipo especificado
 */
export const getFavoritesByType = async (userId, entityType, useCache = true) => {
  try {
    if (useCache) {
      const cached = await getCachedFavorites();
      if (cached.length > 0) {
        return cached.filter(fav => fav.entityType === entityType);
      }
    }
    
    return await getUserFavoritesDetailed(userId, entityType);
  } catch (error) {
    console.error(`Error al obtener favoritos de tipo ${entityType}:`, error);
    throw error;
  }
};