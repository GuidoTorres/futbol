import { Platform } from 'react-native';

// Configuración de API mejorada
const API_CONFIG = {
  // URLs por entorno
  development: {
    web: 'http://localhost:3000',
    ios: 'http://192.168.0.225:3000', // Para simulador iOS y dispositivos físicos
    android: 'http://10.0.2.2:3000', // Para emulador Android
    device: 'http://192.168.0.225:3000' // Para dispositivos físicos - IP de tu Mac
  },
  production: {
    web: 'https://your-api-domain.com',
    ios: 'https://your-api-domain.com',
    android: 'https://your-api-domain.com',
    device: 'https://your-api-domain.com'
  }
};

// Detectar el entorno y plataforma
const getApiUrl = () => {
  const env = process.env.NODE_ENV || 'development';
  const config = API_CONFIG[env];
  
  // Si estamos en web
  if (typeof document !== 'undefined') {
    return config.web;
  }
  
  // Para React Native
  if (Platform.OS === 'ios') {
    return config.ios;
  } else if (Platform.OS === 'android') {
    return config.android;
  }
  
  // Fallback
  return config.device;
};

// Configuración de timeouts y reintentos
export const API_SETTINGS = {
  baseURL: getApiUrl(),
  timeout: 15000, // 15 segundos
  retries: 3,
  retryDelay: 1000, // 1 segundo
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Endpoints principales
export const ENDPOINTS = {
  // Equipos
  teams: '/api/teams',
  teamById: (id) => `/api/teams/${id}`,
  teamPlayers: (id) => `/api/teams/${id}/players`,
  
  // Jugadores
  players: '/api/players',
  playerById: (id) => `/api/players/${id}`,
  
  // Ligas
  leagues: '/api/leagues',
  leagueById: (id) => `/api/leagues/${id}`,
  leagueTeams: (id) => `/api/leagues/${id}/teams`,
  
  // Partidos
  matches: '/api/matches',
  matchById: (id) => `/api/matches/${id}`,
  matchesToday: '/api/matches/today',
  matchesByDate: (date) => `/api/matches/date/${date}`,
  
  // Búsqueda
  search: '/api/search',
  
  // SofaScore
  sofascore: {
    matches: '/api/sofascore/matches',
    leagues: '/api/sofascore/leagues',
    matchDetails: (id) => `/api/sofascore/matches/${id}`
  }
};

export default API_SETTINGS;