import api from './api';

export const getMatches = async () => {
  try {
    const response = await api.get('/api/matches');
    return response.data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const getMatchById = async (id) => {
  try {
    const response = await api.get(`/api/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching match with id ${id}:`, error);
    throw error;
  }
};

export const getLiveMatches = async () => {
  try {
    const response = await api.get('/api/matches/live');
    return response.data;
  } catch (error) {
    console.error('Error fetching live matches:', error);
    throw error;
  }
};

export const getMatchesByDate = async (date) => {
  try {
    // SofaScore format - YYYY-MM-DD
    const formattedDate = date instanceof Date 
      ? date.toISOString().split('T')[0] 
      : date;
    
    const response = await api.get(`/api/matches/date?startDate=${formattedDate}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching matches for date ${date}:`, error);
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
