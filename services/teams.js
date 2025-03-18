import api from './api';

export const getAllTeams = async () => {
  try {
    const response = await api.get('/api/teams');
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getTeamById = async (id) => {
  try {
    const response = await api.get(`/api/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team with id ${id}:`, error);
    throw error;
  }
};

// SofaScore Specific
export const getTeamDetails = async (teamId) => {
  try {
    const response = await api.get(`/api/sofascore/teams/${teamId}/details`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching SofaScore team details for team ${teamId}:`, error);
    throw error;
  }
};

export const getTeamPlayers = async (teamId) => {
  try {
    const response = await api.get(`/api/sofascore/teams/${teamId}/players`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    throw error;
  }
};
