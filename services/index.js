import api from './api';

export * from './matches';
export * from './teams';
export * from './players';
export * from './leagues';

// Funciones generales
export const getSofaScoreCountries = async () => {
  try {
    const response = await api.get('/api/sofascore/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching SofaScore countries:', error);
    throw error;
  }
};

export const getSofaScoreStructure = async () => {
  try {
    const response = await api.get('/api/sofascore/structure');
    return response.data;
  } catch (error) {
    console.error('Error fetching SofaScore structure:', error);
    throw error;
  }
};

export const searchData = async (query) => {
  try {
    const response = await api.get(`/api/search/data?q=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching data:', error);
    throw error;
  }
};

export default api;
