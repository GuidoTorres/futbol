import { useState, useEffect, useCallback } from 'react';
import { 
  getUserFavoritesDetailed, 
  addFavorite, 
  removeFavorite, 
  checkFavorite,
  toggleFavorite,
  getFavoritesByType,
  generatePersonalizedFeed,
  getFavoriteStats,
  syncFavorites,
  getCachedFavorites,
  getLastSyncTimestamp
} from '../services/favorites';

/**
 * Hook personalizado para gestionar favoritos
 * @param {string|number} userId - ID del usuario
 * @returns {Object} - Estado y funciones para gestionar favoritos
 */
export const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Cargar favoritos iniciales
  const loadFavorites = useCallback(async (useCache = true) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let favoritesData;
      
      if (useCache) {
        // Intentar cargar desde cache primero
        const cached = await getCachedFavorites();
        if (cached.length > 0) {
          setFavorites(cached);
          // Cargar desde servidor en segundo plano
          getUserFavoritesDetailed(userId).then(serverFavorites => {
            setFavorites(serverFavorites);
          }).catch(console.error);
          setLoading(false);
          return;
        }
      }
      
      // Cargar desde servidor
      favoritesData = await getUserFavoritesDetailed(userId);
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err.message);
      
      // Fallback al cache si hay error de red
      try {
        const cached = await getCachedFavorites();
        setFavorites(cached);
      } catch (cacheError) {
        console.error('Error loading cached favorites:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Cargar estadísticas de favoritos
  const loadStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      const statsData = await getFavoriteStats(userId);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading favorite stats:', err);
    }
  }, [userId]);

  // Añadir favorito
  const addToFavorites = useCallback(async (entityType, entityId, preferences = {}) => {
    if (!userId) throw new Error('User ID is required');
    
    try {
      const newFavorite = await addFavorite({
        userId,
        entityType,
        entityId,
        preferences
      });
      
      // Actualizar estado local
      setFavorites(prev => [newFavorite, ...prev]);
      
      // Actualizar estadísticas
      loadStats();
      
      return newFavorite;
    } catch (err) {
      console.error('Error adding favorite:', err);
      throw err;
    }
  }, [userId, loadStats]);

  // Eliminar favorito
  const removeFromFavorites = useCallback(async (entityType, entityId) => {
    if (!userId) throw new Error('User ID is required');
    
    try {
      await removeFavorite(userId, entityType, entityId);
      
      // Actualizar estado local
      setFavorites(prev => 
        prev.filter(fav => !(fav.entityType === entityType && fav.entityId === entityId))
      );
      
      // Actualizar estadísticas
      loadStats();
    } catch (err) {
      console.error('Error removing favorite:', err);
      throw err;
    }
  }, [userId, loadStats]);

  // Alternar favorito
  const toggleFavoriteStatus = useCallback(async (entityType, entityId, preferences = {}) => {
    if (!userId) throw new Error('User ID is required');
    
    try {
      const result = await toggleFavorite(userId, entityType, entityId, preferences);
      
      if (result.action === 'added') {
        // Recargar favoritos para obtener los datos completos
        await loadFavorites(false);
      } else {
        // Eliminar del estado local
        setFavorites(prev => 
          prev.filter(fav => !(fav.entityType === entityType && fav.entityId === entityId))
        );
      }
      
      // Actualizar estadísticas
      loadStats();
      
      return result;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  }, [userId, loadFavorites, loadStats]);

  // Verificar si es favorito
  const isFavorite = useCallback((entityType, entityId) => {
    return favorites.some(fav => 
      fav.entityType === entityType && fav.entityId === parseInt(entityId)
    );
  }, [favorites]);

  // Obtener favoritos por tipo
  const getFavoritesByTypeLocal = useCallback((entityType) => {
    return favorites.filter(fav => fav.entityType === entityType);
  }, [favorites]);

  // Sincronizar favoritos
  const syncUserFavorites = useCallback(async (deviceId, force = false) => {
    if (!userId || !deviceId) return;
    
    try {
      setLoading(true);
      
      let syncResult;
      if (force) {
        // Forzar sincronización completa
        const { forceSyncFavorites } = await import('../services/favorites');
        syncResult = await forceSyncFavorites(userId, deviceId);
        setFavorites(syncResult.favorites);
      } else {
        // Sincronización incremental
        const lastSyncTime = await getLastSyncTimestamp();
        syncResult = await syncFavorites(userId, deviceId, lastSyncTime, favorites);
        
        // Aplicar cambios del servidor
        if (syncResult.serverChanges.length > 0) {
          await loadFavorites(false);
        }
      }
      
      setLastSync(new Date().toISOString());
      return syncResult;
    } catch (err) {
      console.error('Error syncing favorites:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, favorites, loadFavorites]);

  // Cargar feed personalizado
  const loadPersonalizedFeed = useCallback(async (limit = 50, offset = 0) => {
    if (!userId) return { feed: [], total: 0, hasMore: false };
    
    try {
      return await generatePersonalizedFeed(userId, limit, offset);
    } catch (err) {
      console.error('Error loading personalized feed:', err);
      throw err;
    }
  }, [userId]);

  // Efectos
  useEffect(() => {
    loadFavorites();
    loadStats();
  }, [loadFavorites, loadStats]);

  useEffect(() => {
    // Cargar timestamp de última sincronización
    getLastSyncTimestamp().then(setLastSync).catch(console.error);
  }, []);

  return {
    // Estado
    favorites,
    loading,
    error,
    stats,
    lastSync,
    
    // Funciones
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavoriteStatus,
    isFavorite,
    getFavoritesByType: getFavoritesByTypeLocal,
    syncUserFavorites,
    loadPersonalizedFeed,
    
    // Utilidades
    refresh: () => loadFavorites(false),
    clearError: () => setError(null)
  };
};

/**
 * Hook para gestionar un favorito específico
 * @param {string|number} userId - ID del usuario
 * @param {string} entityType - Tipo de entidad
 * @param {string|number} entityId - ID de la entidad
 * @returns {Object} - Estado y funciones para el favorito específico
 */
export const useFavoriteStatus = (userId, entityType, entityId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Verificar estado inicial
  useEffect(() => {
    if (!userId || !entityType || !entityId) return;
    
    const checkStatus = async () => {
      setLoading(true);
      try {
        const status = await checkFavorite(userId, entityType, entityId);
        setIsFavorite(status);
      } catch (err) {
        console.error('Error checking favorite status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [userId, entityType, entityId]);

  // Alternar estado
  const toggle = useCallback(async (preferences = {}) => {
    if (!userId || !entityType || !entityId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await toggleFavorite(userId, entityType, entityId, preferences);
      setIsFavorite(result.isFavorite);
      return result;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, entityType, entityId]);

  return {
    isFavorite,
    loading,
    error,
    toggle,
    clearError: () => setError(null)
  };
};