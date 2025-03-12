import { useState, useEffect } from 'react';

// Tipos
export interface Team {
  id: number;
  name: string;
  logo: string;
  score?: number;
}

export interface Match {
  id: number;
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  time: Date;
  status: string;
}

// Datos de ejemplo
const MOCK_MATCHES: Match[] = [
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
    status: 'EN VIVO'
  },
  {
    id: 2,
    league: 'Premier League',
    homeTeam: {
      id: 3,
      name: 'Manchester City',
      logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop',
      score: 1
    },
    awayTeam: {
      id: 4,
      name: 'Arsenal',
      logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop',
      score: 0
    },
    time: new Date(),
    status: 'EN VIVO'
  },
  {
    id: 3,
    league: 'Serie A',
    homeTeam: {
      id: 5,
      name: 'AC Milan',
      logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop',
      score: 0
    },
    awayTeam: {
      id: 6,
      name: 'Juventus',
      logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop',
      score: 2
    },
    time: new Date(Date.now() + 86400000), // Mañana
    status: 'PRÓXIMO'
  },
  {
    id: 4,
    league: 'Bundesliga',
    homeTeam: {
      id: 7,
      name: 'Bayern Munich',
      logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop',
      score: 3
    },
    awayTeam: {
      id: 8,
      name: 'Borussia Dortmund',
      logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop',
      score: 2
    },
    time: new Date(),
    status: 'EN VIVO'
  },
];

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMatchesForDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    // En una aplicación real, harías una llamada a la API para obtener los partidos de esta fecha
    // Por ahora simulamos diferentes resultados basados en la fecha
    
    // Solo para demostración: muestra partidos reales solo en la fecha actual
    const isToday = new Date().toISOString().split('T')[0] === formattedDate;
    
    if (isToday) {
      return MOCK_MATCHES.slice(0, 3); // Los primeros 3 partidos
    } else if (date.getDate() % 2 === 0) {
      // Días pares
      return MOCK_MATCHES.slice(1, 3); // 2 partidos diferentes
    } else if (date.getDate() % 3 === 0) {
      // Días divisibles por 3
      return MOCK_MATCHES.slice(2, 4); // Últimos 2 partidos
    } else if (date.getDate() % 5 === 0) {
      // Días divisibles por 5
      return []; // Sin partidos
    } else {
      // Otros días
      return [MOCK_MATCHES[3]]; // Solo último partido
    }
  }

  return {
    matches,
    loading,
    error,
    getMatchesForDate
  };
}