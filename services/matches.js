import api from './api';

/**
 * Obtiene todos los partidos
 * @returns {Promise<Array>} - Lista de partidos
 */
export const getMatches = async () => {
  try {
    const response = await api.get('/api/matches');
    return response.data;
  } catch (error) {
    console.error('Error al obtener partidos:', error);
    throw error;
  }
};

/**
 * Obtiene un partido por su ID
 * @param {string|number} id - ID del partido
 * @returns {Promise<Object>} - Datos del partido
 */
export const getMatchById = async (id) => {
  try {
    const response = await api.get(`/api/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener partido con id ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene partidos en vivo
 * @returns {Promise<Array>} - Lista de partidos en vivo
 */
export const getLiveMatches = async () => {
  try {
    const response = await api.get('/api/matches/live');
    return response.data;
  } catch (error) {
    console.error('Error al obtener partidos en vivo:', error);
    throw error;
  }
};

/**
 * Crea un nuevo partido
 * @param {Object} matchData - Datos del partido a crear
 * @returns {Promise<Object>} - Partido creado
 */
export const createMatch = async (matchData) => {
  try {
    const response = await api.post('/api/matches', matchData);
    return response.data;
  } catch (error) {
    console.error('Error al crear partido:', error);
    throw error;
  }
};

/**
 * Actualiza un partido existente
 * @param {string|number} id - ID del partido
 * @param {Object} matchData - Datos actualizados del partido
 * @returns {Promise<Object>} - Partido actualizado
 */
export const updateMatch = async (id, matchData) => {
  try {
    const response = await api.put(`/api/matches/${id}`, matchData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar partido con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un partido
 * @param {string|number} id - ID del partido a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteMatch = async (id) => {
  try {
    const response = await api.delete(`/api/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar partido con id ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene partidos por fecha
 * @param {Date|string} date - Fecha para buscar partidos
 * @returns {Promise<Array>} - Lista de partidos en la fecha especificada
 */
export const getMatchesByDate = async (date) => {
  try {
    // Formato SofaScore - YYYY-MM-DD
    const formattedDate = date instanceof Date 
      ? date.toISOString().split('T')[0] 
      : date;
    
    // Use same date for start and end to get matches for that specific day
    const response = await api.get(`/api/matches/date?startDate=${formattedDate}&endDate=${formattedDate}`);
    return response.data.matches || response.data;
  } catch (error) {
    console.error(`Error al obtener partidos para la fecha ${date}:`, error);
    throw error;
  }
};

/**
 * Obtiene partidos por liga
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} - Lista de partidos de la liga
 */
export const getMatchesByLeague = async (leagueId) => {
  try {
    const response = await api.get(`/api/matches/league/${leagueId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener partidos de la liga ${leagueId}:`, error);
    throw error;
  }
};

/**
 * Obtiene partidos por equipo
 * @param {string|number} teamId - ID del equipo
 * @returns {Promise<Array>} - Lista de partidos del equipo
 */
export const getMatchesByTeam = async (teamId) => {
  try {
    const response = await api.get(`/api/matches/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener partidos del equipo ${teamId}:`, error);
    throw error;
  }
};

export const getMatchesByDateRange = async (startDate, endDate) => {
  try {
    // Format dates if they are Date objects
    const formattedStartDate = startDate instanceof Date 
      ? startDate.toISOString().split('T')[0] 
      : startDate;
    
    const formattedEndDate = endDate instanceof Date 
      ? endDate.toISOString().split('T')[0] 
      : endDate;
    
    const response = await api.get(`/api/matches/range/${formattedStartDate}/${formattedEndDate}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching matches for range ${startDate} to ${endDate}:`, error);
    throw error;
  }
};

export const getTodayMatches = async () => {
  try {
    const response = await api.get('/api/matches/today');
    return response.data;
  } catch (error) {
    console.error('Error fetching today\'s matches:', error);
    throw error;
  }
};

export const getWeekMatches = async () => {
  try {
    const response = await api.get('/api/matches/week');
    return response.data;
  } catch (error) {
    console.error('Error fetching week matches:', error);
    throw error;
  }
};
