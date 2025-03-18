import { useState, useEffect, useCallback } from 'react';
import { getMatches, getLiveMatches, getMatchesByDate, getTodayMatches, getMatchById as apiGetMatchById } from '../services/matches';

// Datos de ejemplo para un partido completo (similar a MATCH_DATA en match/[id].jsx)
export const EXAMPLE_MATCH = {
  id: 999,
  league: 'Liga Ejemplo',
  homeTeam: {
    id: 1,
    name: 'Real Madrid',
    logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop',
    score: 2,
    formation: '4-3-3',
    coach: {
      name: 'Hansi Flick',
      image: 'https://images.unsplash.com/photo-1615572768141-290c2d38c0b5?w=64&h=64&fit=crop',
      nationality: 'Alemania',
      age: 58
    },
    players: [
      // Portero (mismo que en MATCH_DATA)
      { id: 1, name: 'Ter Stegen', number: 1, position: 'POR', x: 50, y: 10, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop' },
      // Defensas
      { id: 2, name: 'Koundé', number: 23, position: 'LD', x: 20, y: 25, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 3, name: 'Araújo', number: 4, position: 'DFC', x: 40, y: 25, image: 'https://images.unsplash.com/photo-1507038732509-8b1a9623223a?w=64&h=64&fit=crop' },
      { id: 4, name: 'Christensen', number: 15, position: 'DFC', x: 60, y: 25, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 5, name: 'Baldé', number: 3, position: 'LI', x: 80, y: 25, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      // Mediocampistas 
      { id: 6, name: 'Pedri', number: 8, position: 'MC', x: 30, y: 40, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      { id: 7, name: 'Busquets', number: 5, position: 'MCD', x: 50, y: 40, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 8, name: 'De Jong', number: 21, position: 'MC', x: 70, y: 40, image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&h=64&fit=crop' },
      // Delanteros
      { id: 9, name: 'Ferran', number: 11, position: 'EI', x: 30, y: 50, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 10, name: 'Lewandowski', number: 9, position: 'DC', x: 50, y: 50, image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=64&h=64&fit=crop' },
      { id: 11, name: 'Dembélé', number: 7, position: 'ED', x: 70, y: 50, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
    ],
    substitutes: [
      { id: 12, name: 'Iñaki Peña', number: 13, position: 'POR', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64&h=64&fit=crop' },
      { id: 13, name: 'Eric García', number: 24, position: 'DFC', image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=64&h=64&fit=crop' }
    ],
    staffMembers: [
      { name: 'Óscar Hernández', role: 'Asistente', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop' }
    ]
  },
  awayTeam: {
    id: 2,
    name: 'Barcelona',
    logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop',
    score: 1,
    formation: '4-3-3',
    coach: {
      name: 'Xavi',
      image: 'https://images.unsplash.com/photo-1615572768141-290c2d38c0b5?w=64&h=64&fit=crop',
      nationality: 'España',
      age: 44
    },
    players: [
      // Mismos jugadores que en homeTeam pero para el awayTeam
      { id: 1, name: 'Courtois', number: 1, position: 'POR', x: 50, y: 10, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop' },
      { id: 2, name: 'Carvajal', number: 2, position: 'LD', x: 20, y: 25, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 3, name: 'Militão', number: 3, position: 'DFC', x: 40, y: 25, image: 'https://images.unsplash.com/photo-1507038732509-8b1a9623223a?w=64&h=64&fit=crop' },
      { id: 4, name: 'Alaba', number: 4, position: 'DFC', x: 60, y: 25, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 5, name: 'Mendy', number: 23, position: 'LI', x: 80, y: 25, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      { id: 6, name: 'Tchouaméni', number: 18, position: 'MC', x: 30, y: 40, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      { id: 7, name: 'Modric', number: 10, position: 'MCD', x: 50, y: 40, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 8, name: 'Kroos', number: 8, position: 'MC', x: 70, y: 40, image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&h=64&fit=crop' },
      { id: 9, name: 'Vinicius', number: 7, position: 'EI', x: 30, y: 50, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 10, name: 'Bellingham', number: 5, position: 'DC', x: 50, y: 50, image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=64&h=64&fit=crop' },
      { id: 11, name: 'Rodrygo', number: 11, position: 'ED', x: 70, y: 50, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
    ],
    substitutes: [
      { id: 12, name: 'Lunin', number: 13, position: 'POR', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64&h=64&fit=crop' },
      { id: 13, name: 'Rüdiger', number: 22, position: 'DFC', image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=64&h=64&fit=crop' }
    ],
    staffMembers: [
      { name: 'Davide Ancelotti', role: 'Asistente', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop' }
    ]
  },
  stats: {
    possession: { home: 55, away: 45 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 10, away: 12 },
    yellowCards: { home: 2, away: 1 },
    redCards: { home: 0, away: 0 },
    offsides: { home: 3, away: 2 },
    saves: { home: 2, away: 3 },
    passes: { home: 423, away: 389 },
    passAccuracy: { home: 86, away: 83 },
  },
  events: [
    { time: '23', type: 'goal', team: 'home', player: 'Bellingham', assist: 'Modric', description: 'Disparo desde fuera del área' },
    { time: '31', type: 'substitution', team: 'away', playerOut: 'Christensen', playerIn: 'Eric García', reason: 'Lesión' },
    { time: '67', type: 'goal', team: 'away', player: 'Lewandowski', assist: 'De Jong', description: 'Remate de cabeza tras centro' }
  ]
};

// Datos de respaldo para usar mientras se cargan los datos reales
const FALLBACK_MATCHES = [
  {
    id: 1,
    league: 'La Liga',
    homeTeam: {
      id: 1,
      name: 'Real Madrid',
      logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop',
      score: 2
    },
    awayTeam: {
      id: 2,
      name: 'Barcelona',
      logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop',
      score: 1
    },
    time: new Date(),
    status: 'CARGANDO...'
  }
];

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [matchesByDate, setMatchesByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para transformar los datos de la API al formato que espera la UI
  const transformMatchData = (match) => {
    return {
      id: match.id,
      league: match.League?.name || match.league || 'Liga Desconocida',
      homeTeam: {
        id: match.homeTeamId || match.homeTeam?.id,
        name: match.homeTeam?.name || 'Equipo Local',
        logo: match.homeTeam?.logo || 'https://via.placeholder.com/64',
        score: match.homeScore || 0
      },
      awayTeam: {
        id: match.awayTeamId || match.awayTeam?.id,
        name: match.awayTeam?.name || 'Equipo Visitante',
        logo: match.awayTeam?.logo || 'https://via.placeholder.com/64',
        score: match.awayScore || 0
      },
      time: new Date(match.date || Date.now()),
      status: match.status || 'PROGRAMADO'
    };
  };

  // Cargar todos los partidos al inicio
  useEffect(() => {
    const fetchAllMatches = async () => {
      setLoading(true);
      try {
        const data = await getMatches();
        const transformedMatches = Array.isArray(data) 
          ? data.map(transformMatchData)
          : (data.matches ? data.matches.map(transformMatchData) : []);
        
        setMatches(transformedMatches);
      } catch (err) {
        console.error('Error cargando partidos:', err);
        setError(err.message);
        // Usar datos de respaldo en caso de error
        setMatches(FALLBACK_MATCHES);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMatches();
  }, []);

  // Obtener partidos para una fecha específica
  const getMatchesForDate = useCallback(async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    // Si ya tenemos los partidos para esta fecha en caché, devolverlos inmediatamente
    if (matchesByDate[formattedDate]) {
      return matchesByDate[formattedDate];
    }
    
    // De lo contrario, hacer la petición a la API
    setLoading(true);
    try {
      const data = await getMatchesByDate(formattedDate);
      const transformedMatches = Array.isArray(data) 
        ? data.map(transformMatchData)
        : (data.matches ? data.matches.map(transformMatchData) : []);
      
      // Guardar en caché para futuras consultas
      setMatchesByDate(prev => ({
        ...prev,
        [formattedDate]: transformedMatches
      }));
      
      return transformedMatches;
    } catch (err) {
      console.error(`Error cargando partidos para ${formattedDate}:`, err);
      
      // En caso de error, filtrar de los partidos que ya tenemos
      const fallbackMatches = matches.filter(match => {
        const matchDate = new Date(match.time).toISOString().split('T')[0];
        return matchDate === formattedDate;
      });
      
      return fallbackMatches.length ? fallbackMatches : FALLBACK_MATCHES;
    } finally {
      setLoading(false);
    }
  }, [matches, matchesByDate]);

  // Obtener partidos en vivo
  const getLive = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLiveMatches();
      const transformedMatches = Array.isArray(data) 
        ? data.map(transformMatchData)
        : (data.matches ? data.matches.map(transformMatchData) : []);
      
      return transformedMatches;
    } catch (err) {
      console.error('Error cargando partidos en vivo:', err);
      // Filtrar los partidos en vivo de los que ya tenemos
      return matches.filter(match => match.status === 'EN VIVO' || match.status === 'LIVE');
    } finally {
      setLoading(false);
    }
  }, [matches]);

  // Obtener partidos de hoy
  const getToday = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTodayMatches();
      const transformedMatches = Array.isArray(data) 
        ? data.map(transformMatchData)
        : (data.matches ? data.matches.map(transformMatchData) : []);
      
      return transformedMatches;
    } catch (err) {
      console.error('Error cargando partidos de hoy:', err);
      // Usar la fecha de hoy para filtrar
      const today = new Date().toISOString().split('T')[0];
      return matches.filter(match => {
        const matchDate = new Date(match.time).toISOString().split('T')[0];
        return matchDate === today;
      });
    } finally {
      setLoading(false);
    }
  }, [matches]);

  // Obtener un partido específico por su ID
  const getMatchById = useCallback(async (id) => {
    // Primero verificamos si ya lo tenemos en nuestro estado local
    const matchInState = matches.find(match => match.id.toString() === id.toString());
    if (matchInState) {
      // Tomamos los datos básicos del partido de nuestro estado
      // pero aseguramos que tenga la estructura completa necesaria
      return {
        ...EXAMPLE_MATCH,  // Datos completos como base
        ...matchInState,   // Sobreescribimos con datos reales
        // Mantenemos las estructuras necesarias de EXAMPLE_MATCH si no existen
        stats: matchInState.stats || EXAMPLE_MATCH.stats,
        events: matchInState.events || EXAMPLE_MATCH.events,
        homeTeam: {
          ...EXAMPLE_MATCH.homeTeam,
          ...(matchInState.homeTeam || {}),
          // Asegurar que estas propiedades existan
          players: matchInState.homeTeam?.players || EXAMPLE_MATCH.homeTeam.players,
          substitutes: matchInState.homeTeam?.substitutes || EXAMPLE_MATCH.homeTeam.substitutes,
          coach: matchInState.homeTeam?.coach || EXAMPLE_MATCH.homeTeam.coach,
          staffMembers: matchInState.homeTeam?.staffMembers || EXAMPLE_MATCH.homeTeam.staffMembers
        },
        awayTeam: {
          ...EXAMPLE_MATCH.awayTeam,
          ...(matchInState.awayTeam || {}),
          // Asegurar que estas propiedades existan
          players: matchInState.awayTeam?.players || EXAMPLE_MATCH.awayTeam.players,
          substitutes: matchInState.awayTeam?.substitutes || EXAMPLE_MATCH.awayTeam.substitutes,
          coach: matchInState.awayTeam?.coach || EXAMPLE_MATCH.awayTeam.coach,
          staffMembers: matchInState.awayTeam?.staffMembers || EXAMPLE_MATCH.awayTeam.staffMembers
        }
      };
    }
    
    // Si no está en el estado, intentamos obtenerlo de la API
    setLoading(true);
    try {
      const data = await apiGetMatchById(id);
      if (!data) {
        console.log("No se encontró partido con ID:", id);
        return EXAMPLE_MATCH; // Devolvemos datos de ejemplo si no se encuentra
      }
      
      // Transformamos los datos básicos
      const transformedMatch = transformMatchData(data);
      
      // Aseguramos que tenga la estructura completa
      return {
        ...EXAMPLE_MATCH,  // Datos completos como base
        ...transformedMatch,   // Sobreescribimos con datos reales
        // Aseguramos que estas propiedades existan usando EXAMPLE_MATCH como respaldo
        stats: transformedMatch.stats || EXAMPLE_MATCH.stats,
        events: transformedMatch.events || EXAMPLE_MATCH.events,
        homeTeam: {
          ...EXAMPLE_MATCH.homeTeam,
          ...(transformedMatch.homeTeam || {}),
          // Asegurar que estas propiedades existan
          players: transformedMatch.homeTeam?.players || EXAMPLE_MATCH.homeTeam.players,
          substitutes: transformedMatch.homeTeam?.substitutes || EXAMPLE_MATCH.homeTeam.substitutes,
          coach: transformedMatch.homeTeam?.coach || EXAMPLE_MATCH.homeTeam.coach,
          staffMembers: transformedMatch.homeTeam?.staffMembers || EXAMPLE_MATCH.homeTeam.staffMembers
        },
        awayTeam: {
          ...EXAMPLE_MATCH.awayTeam,
          ...(transformedMatch.awayTeam || {}),
          // Asegurar que estas propiedades existan
          players: transformedMatch.awayTeam?.players || EXAMPLE_MATCH.awayTeam.players,
          substitutes: transformedMatch.awayTeam?.substitutes || EXAMPLE_MATCH.awayTeam.substitutes,
          coach: transformedMatch.awayTeam?.coach || EXAMPLE_MATCH.awayTeam.coach,
          staffMembers: transformedMatch.awayTeam?.staffMembers || EXAMPLE_MATCH.awayTeam.staffMembers
        }
      };
    } catch (err) {
      console.error(`Error cargando partido con ID ${id}:`, err);
      return EXAMPLE_MATCH; // Devolvemos datos de ejemplo en caso de error
    } finally {
      setLoading(false);
    }
  }, [matches]);

  return {
    matches,
    loading,
    error,
    getMatchesForDate,
    getLiveMatches: getLive,
    getTodayMatches: getToday,
    getMatchById
  };
}