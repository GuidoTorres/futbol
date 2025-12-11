import api from './api';

/**
 * Obtiene todos los equipos
 * @returns {Promise<Array>} - Lista de equipos
 */
export const getAllTeams = async () => {
  try {
    const response = await api.get('/api/teams');
    return response.data;
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    throw error;
  }
};

/**
 * Obtiene un equipo por su ID
 * @param {string|number} id - ID del equipo
 * @returns {Promise<Object>} - Datos del equipo
 */
export const getTeamById = async (id) => {
  try {
    const response = await api.get(`/api/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener equipo con id ${id}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo equipo
 * @param {Object} teamData - Datos del equipo a crear
 * @returns {Promise<Object>} - Equipo creado
 */
export const createTeam = async (teamData) => {
  try {
    const response = await api.post('/api/teams', teamData);
    return response.data;
  } catch (error) {
    console.error('Error al crear equipo:', error);
    throw error;
  }
};

/**
 * Actualiza un equipo existente
 * @param {string|number} id - ID del equipo
 * @param {Object} teamData - Datos actualizados del equipo
 * @returns {Promise<Object>} - Equipo actualizado
 */
export const updateTeam = async (id, teamData) => {
  try {
    const response = await api.put(`/api/teams/${id}`, teamData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar equipo con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un equipo
 * @param {string|number} id - ID del equipo a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteTeam = async (id) => {
  try {
    const response = await api.delete(`/api/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar equipo con id ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene los jugadores de un equipo
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Array>} - Lista de jugadores del equipo
 */
export const getTeamPlayers = async (teamId) => {
  try {
    const response = await api.get(`/api/players/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener jugadores del equipo ${teamId}:`, error);
    throw error;
  }
};

/**
 * Obtiene los detalles completos de un equipo
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Object>} - Detalles del equipo
 */
export const getTeamDetails = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener detalles del equipo ${teamId}:`, error);
    throw error;
  }
};

/**
 * Obtiene las estadísticas de un equipo
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Object>} - Estadísticas del equipo
 */
export const getTeamStats = async (teamId) => {
  try {
    const response = await api.get(`/api/teams/${teamId}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener estadísticas del equipo ${teamId}:`, error);
    // Return empty stats if endpoint doesn't exist
    return { stats: {} };
  }
};
