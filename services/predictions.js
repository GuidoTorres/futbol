import api from './api';

/**
 * Get prediction for a specific match
 * @param {string|number} matchId - Match ID
 * @returns {Promise<Object>} - Match prediction data
 */
export const getMatchPrediction = async (matchId) => {
  try {
    const response = await api.get(`/api/predictions/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting prediction for match ${matchId}:`, error);
    throw error;
  }
};

/**
 * Get predictions for upcoming matches
 * @param {number} limit - Number of predictions to fetch
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 * @returns {Promise<Object>} - Upcoming predictions data
 */
export const getUpcomingPredictions = async (limit = 10, date = null) => {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (date) {
      params.append('date', date);
    }
    const response = await api.get(`/api/predictions/upcoming?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error getting upcoming predictions:', error);
    throw error;
  }
};

/**
 * Get high confidence predictions
 * @param {number} minConfidence - Minimum confidence threshold (0-100)
 * @param {number} limit - Number of predictions to fetch
 * @returns {Promise<Object>} - High confidence predictions
 */
export const getHighConfidencePredictions = async (minConfidence = 70, limit = 10) => {
  try {
    const response = await api.get(`/api/predictions/high-confidence?minConfidence=${minConfidence}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error getting high confidence predictions:', error);
    throw error;
  }
};

/**
 * Get head-to-head analysis between two teams
 * @param {string|number} homeTeamId - Home team ID
 * @param {string|number} awayTeamId - Away team ID
 * @returns {Promise<Object>} - H2H analysis data
 */
export const getHeadToHeadAnalysis = async (homeTeamId, awayTeamId) => {
  try {
    const response = await api.get(`/api/predictions/h2h/${homeTeamId}/${awayTeamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting H2H analysis for teams ${homeTeamId} vs ${awayTeamId}:`, error);
    throw error;
  }
};

/**
 * Get prediction accuracy statistics
 * @param {number} period - Period in days (default 30)
 * @returns {Promise<Object>} - Accuracy statistics
 */
export const getPredictionAccuracy = async (period = 30) => {
  try {
    const response = await api.get(`/api/predictions/accuracy?period=${period}`);
    return response.data;
  } catch (error) {
    console.error('Error getting prediction accuracy:', error);
    throw error;
  }
};

/**
 * Get team form analysis
 * @param {string|number} teamId - Team ID
 * @param {number} matches - Number of recent matches to analyze
 * @returns {Promise<Object>} - Team form data
 */
export const getTeamForm = async (teamId, matches = 10) => {
  try {
    const response = await api.get(`/api/predictions/teams/${teamId}/form?matches=${matches}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting form for team ${teamId}:`, error);
    throw error;
  }
};

/**
 * Get prediction dashboard summary
 * @returns {Promise<Object>} - Dashboard data
 */
export const getPredictionDashboard = async () => {
  try {
    const response = await api.get('/api/predictions/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error getting prediction dashboard:', error);
    throw error;
  }
};

/**
 * Recalculate prediction for a match
 * @param {string|number} matchId - Match ID
 * @returns {Promise<Object>} - Updated prediction
 */
export const recalculatePrediction = async (matchId) => {
  try {
    const response = await api.put(`/api/predictions/matches/${matchId}/recalculate`);
    return response.data;
  } catch (error) {
    console.error(`Error recalculating prediction for match ${matchId}:`, error);
    throw error;
  }
};
