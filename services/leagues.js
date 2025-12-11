import api from './api';

/**
 * Obtiene todas las ligas
 * @returns {Promise<Array>} - Lista de ligas
 */
export const getAllLeagues = async () => {
  try {
    const response = await api.get('/api/leagues');
    return response.data;
  } catch (error) {
    console.error('Error al obtener ligas:', error);
    throw error;
  }
};

/**
 * Obtiene una liga por su ID
 * @param {string|number} id - ID de la liga
 * @returns {Promise<Object>} - Datos de la liga
 */
export const getLeagueById = async (id) => {
  try {
    const response = await api.get(`/api/leagues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener liga con id ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene ligas por país
 * @param {string} country - Nombre del país
 * @returns {Promise<Array>} - Lista de ligas del país
 */
export const getLeaguesByCountry = async (country) => {
  try {
    const response = await api.get(`/api/leagues/country/${country}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener ligas del país ${country}:`, error);
    throw error;
  }
};

/**
 * Obtiene la clasificación de una liga
 * @param {string|number} leagueId - ID de la liga
 * @returns {Promise<Array>} - Clasificación de la liga
 */
export const getLeagueStandings = async (leagueId) => {
  try {
    const response = await api.get(`/api/leagues/${leagueId}/standings`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener clasificación de la liga ${leagueId}:`, error);
    throw error;
  }
};

/**
 * Crea una nueva liga
 * @param {Object} leagueData - Datos de la liga a crear
 * @returns {Promise<Object>} - Liga creada
 */
export const createLeague = async (leagueData) => {
  try {
    const response = await api.post('/api/leagues', leagueData);
    return response.data;
  } catch (error) {
    console.error('Error al crear liga:', error);
    throw error;
  }
};

/**
 * Actualiza una liga existente
 * @param {string|number} id - ID de la liga
 * @param {Object} leagueData - Datos actualizados de la liga
 * @returns {Promise<Object>} - Liga actualizada
 */
export const updateLeague = async (id, leagueData) => {
  try {
    const response = await api.put(`/api/leagues/${id}`, leagueData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar liga con id ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina una liga
 * @param {string|number} id - ID de la liga a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteLeague = async (id) => {
  try {
    const response = await api.delete(`/api/leagues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar liga con id ${id}:`, error);
    throw error;
  }
};

// SofaScore Specific
export const getSofaScoreLeagues = async () => {
  try {
    const response = await api.get('/api/sofascore/leagues');
    return response.data;
  } catch (error) {
    console.error('Error fetching SofaScore leagues:', error);
    throw error;
  }
};

export const getLeagueSeasons = async (leagueName) => {
  try {
    const response = await api.get(`/api/sofascore/leagues/${leagueName}/seasons`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching seasons for league ${leagueName}:`, error);
    throw error;
  }
};

export const getLeagueTeams = async (leagueName, year) => {
  try {
    const url = year 
      ? `/api/sofascore/leagues/${leagueName}/teams/${year}` 
      : `/api/sofascore/leagues/${leagueName}/teams`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueName}:`, error);
    throw error;
  }
};

export const getLeaguePlayers = async (leagueName, year, maxTeams = 20) => {
  try {
    const url = year 
      ? `/api/sofascore/leagues/${leagueName}/players/${year}?maxTeams=${maxTeams}` 
      : `/api/sofascore/leagues/${leagueName}/players?maxTeams=${maxTeams}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching players for league ${leagueName}:`, error);
    throw error;
  }
};

export const getLeagueDetails = async (leagueId) => {
  try {
    const response = await api.get(`/api/sofascore/leagues/${leagueId}/details`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for league ${leagueId}:`, error);
    throw error;
  }
};
