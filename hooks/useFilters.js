import { useState, useEffect, useCallback } from 'react';
import {
  applyFilters,
  getFilterOptions,
  saveFavoriteFilter,
  getFavoriteFilters,
  deleteFavoriteFilter,
} from '../services/search';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook personalizado para gestionar filtros
 * Proporciona funcionalidad completa de filtrado con persistencia
 */
const useFilters = (userId, entityType = 'all') => {
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState(null);
  const [favoriteFilters, setFavoriteFilters] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar opciones de filtros al montar
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Cargar filtros favoritos cuando hay userId
  useEffect(() => {
    if (userId) {
      loadFavoriteFilters();
    }
  }, [userId]);

  // Cargar filtros guardados localmente al montar
  useEffect(() => {
    loadSavedFilters();
  }, [entityType]);

  /**
   * Cargar opciones disponibles para filtros
   */
  const loadFilterOptions = async () => {
    try {
      const options = await getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error cargando opciones de filtros:', err);
      setError('No se pudieron cargar las opciones de filtros');
    }
  };

  /**
   * Cargar filtros favoritos del usuario
   */
  const loadFavoriteFilters = async () => {
    if (!userId) return;

    try {
      const filters = await getFavoriteFilters(userId);
      setFavoriteFilters(filters);
    } catch (err) {
      console.error('Error cargando filtros favoritos:', err);
    }
  };

  /**
   * Cargar filtros guardados localmente
   */
  const loadSavedFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem(
        `last_filters_${entityType}`
      );
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      }
    } catch (err) {
      console.error('Error cargando filtros guardados:', err);
    }
  };

  /**
   * Guardar filtros localmente
   */
  const saveFiltersLocally = async (filtersToSave) => {
    try {
      await AsyncStorage.setItem(
        `last_filters_${entityType}`,
        JSON.stringify(filtersToSave)
      );
    } catch (err) {
      console.error('Error guardando filtros localmente:', err);
    }
  };

  /**
   * Aplicar filtros y obtener resultados
   */
  const applyCurrentFilters = useCallback(
    async (customFilters = null) => {
      const filtersToApply = customFilters || filters;

      // Si no hay filtros activos, no hacer nada
      if (Object.keys(filtersToApply).length === 0) {
        setResults(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Agregar tipo de entidad si está especificado
        const filterParams = {
          ...filtersToApply,
          ...(entityType !== 'all' && { type: entityType }),
        };

        const response = await applyFilters(filterParams);
        setResults(response);

        // Guardar filtros localmente
        await saveFiltersLocally(filtersToApply);

        return response;
      } catch (err) {
        console.error('Error aplicando filtros:', err);
        setError('No se pudieron aplicar los filtros');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [filters, entityType]
  );

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * Limpiar filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    setResults(null);
    saveFiltersLocally({});
  }, []);

  /**
   * Agregar un filtro individual
   */
  const addFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Remover un filtro individual
   */
  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  /**
   * Guardar filtro como favorito
   */
  const saveAsFavorite = useCallback(
    async (name, config = null) => {
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const filterConfig = config || filters;

      if (Object.keys(filterConfig).length === 0) {
        throw new Error('No hay filtros para guardar');
      }

      try {
        const response = await saveFavoriteFilter(userId, name, filterConfig);
        await loadFavoriteFilters();
        return response;
      } catch (err) {
        console.error('Error guardando filtro favorito:', err);
        throw err;
      }
    },
    [userId, filters]
  );

  /**
   * Eliminar filtro favorito
   */
  const deleteFavorite = useCallback(
    async (filterId) => {
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      try {
        await deleteFavoriteFilter(userId, filterId);
        await loadFavoriteFilters();
      } catch (err) {
        console.error('Error eliminando filtro favorito:', err);
        throw err;
      }
    },
    [userId]
  );

  /**
   * Cargar un filtro favorito
   */
  const loadFavorite = useCallback((filterConfig) => {
    setFilters(filterConfig);
  }, []);

  /**
   * Obtener conteo de filtros activos
   */
  const getActiveFiltersCount = useCallback(() => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key];
      return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      );
    }).length;
  }, [filters]);

  /**
   * Verificar si hay filtros activos
   */
  const hasActiveFilters = useCallback(() => {
    return getActiveFiltersCount() > 0;
  }, [getActiveFiltersCount]);

  /**
   * Obtener resumen de filtros activos
   */
  const getFiltersSummary = useCallback(() => {
    const activeFilters = Object.keys(filters).filter((key) => {
      const value = filters[key];
      return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      );
    });

    return activeFilters.map((key) => {
      const value = filters[key];
      let displayValue = value;

      if (Array.isArray(value)) {
        displayValue = value.length > 1 ? `${value.length} seleccionados` : value[0];
      }

      // Buscar el nombre legible en filterOptions
      if (filterOptions) {
        if (key === 'league' && filterOptions.leagues) {
          const league = filterOptions.leagues.find((l) => l.id === value);
          if (league) displayValue = league.name;
        } else if (key === 'position' && Array.isArray(value)) {
          displayValue = value.join(', ');
        } else if (key === 'nationality' && Array.isArray(value)) {
          displayValue = value.join(', ');
        }
      }

      return {
        key,
        label: formatFilterLabel(key),
        value: displayValue,
      };
    });
  }, [filters, filterOptions]);

  /**
   * Formatear etiqueta de filtro
   */
  const formatFilterLabel = (key) => {
    const labels = {
      league: 'Liga',
      season: 'Temporada',
      position: 'Posición',
      nationality: 'Nacionalidad',
      country: 'País',
      status: 'Estado',
      minAge: 'Edad mínima',
      maxAge: 'Edad máxima',
      dateFrom: 'Desde',
      dateTo: 'Hasta',
      teamId: 'Equipo',
    };

    return labels[key] || key;
  };

  return {
    // Estado
    filters,
    filterOptions,
    favoriteFilters,
    results,
    loading,
    error,

    // Acciones
    updateFilters,
    clearFilters,
    addFilter,
    removeFilter,
    applyCurrentFilters,

    // Favoritos
    saveAsFavorite,
    deleteFavorite,
    loadFavorite,
    loadFavoriteFilters,

    // Utilidades
    getActiveFiltersCount,
    hasActiveFilters,
    getFiltersSummary,
  };
};

export default useFilters;
