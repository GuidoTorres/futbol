import api from './api';

/**
 * Obtiene todos los jugadores
 * @returns {Promise<Array>} - Lista de jugadores
 */
export const getAllPlayers = async () => {
  try {
    const response = await api.get('/api/players');
    return response.data;
  } catch (error) {
    console.error('Error al obtener jugadores:', error);
    throw error;
  }
};

/**
 * Obtiene un jugador por su ID
 * @param {string|number} id - ID del jugador
 * @returns {Promise<Object>} - Datos del jugador
 */
export const getPlayerById = async (id) => {
  try {
    const response = await api.get(`/api/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jugador con id ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene jugadores por equipo
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Array>} - Lista de jugadores del equipo
 */
export const getPlayersByTeam = async (teamId) => {
  try {
    const response = await api.get(`/api/players/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jugadores del equipo ${teamId}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo jugador
 * @param {Object} playerData - Datos del jugador a crear
 * @returns {Promise<Object>} - Jugador creado
 */
export const createPlayer = async (playerData) => {
  try {
    const response = await api.post('/api/players', playerData);
    return response.data;
  } catch (error) {
    console.error('Error al crear jugador:', error);
    throw error;
  }
};

/**
 * Actualiza un jugador existente
 * @param {string|number} id - ID del jugador
 * @param {Object} playerData - Datos actualizados del jugador
 * @returns {Promise<Object>} - Jugador actualizado
 */
export const updatePlayer = async (id, playerData) => {
  try {
    const response = await api.put(`/api/players/${id}`, playerData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar jugador con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un jugador
 * @param {string|number} id - ID del jugador a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deletePlayer = async (id) => {
  try {
    const response = await api.delete(`/api/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar jugador con id ${id}:`, error);
    throw error;
  }
};

// SofaScore Specific
export const getSofaScorePlayerById = async (playerId, completeInfo = false) => {
  try {
    const response = await api.get(`/api/sofascore/players/${playerId}?completeInfo=${completeInfo}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jugador de SofaScore con id ${playerId}:`, error);
    throw error;
  }
};

export const searchPlayers = async (query) => {
  try {
    if (!query || query.length < 3) {
      throw new Error('El término de búsqueda debe tener al menos 3 caracteres');
    }
    
    const response = await api.get(`/api/sofascore/players/search/${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error al buscar jugadores con término "${query}":`, error);
    throw error;
  }
};
