import api from './api';

export const getAllPlayers = async () => {
  try {
    const response = await api.get('/api/players');
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const getPlayerById = async (id) => {
  try {
    const response = await api.get(`/api/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player with id ${id}:`, error);
    throw error;
  }
};

export const getPlayersByTeam = async (teamId) => {
  try {
    const response = await api.get(`/api/players/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    throw error;
  }
};

// SofaScore Specific
export const getSofaScorePlayerById = async (playerId, completeInfo = false) => {
  try {
    const response = await api.get(`/api/sofascore/players/${playerId}?completeInfo=${completeInfo}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching SofaScore player with id ${playerId}:`, error);
    throw error;
  }
};

export const searchPlayers = async (query) => {
  try {
    if (!query || query.length < 3) {
      throw new Error('Search query must be at least 3 characters');
    }
    
    const response = await api.get(`/api/sofascore/players/search/${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching players with query ${query}:`, error);
    throw error;
  }
};
