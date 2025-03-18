import api from './api';

export const getAllLeagues = async () => {
  try {
    const response = await api.get('/api/leagues');
    return response.data;
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
};

export const getLeagueById = async (id) => {
  try {
    const response = await api.get(`/api/leagues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching league with id ${id}:`, error);
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
