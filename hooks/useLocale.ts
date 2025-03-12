import { useState, useEffect } from 'react';

export type LocaleType = 'es' | 'en';

interface Translations {
  tabs: {
    matches: string;
    leagues: string;
    favorites: string;
    calendar: string;
  };
  matches: {
    noMatches: string;
    browseMatches: string;
    matchEvents: string;
    matchStats: string;
    detailedStats: string;
    lineups: string;
    live: string;
    upcoming: string;
  };
  favorites: {
    noFavorites: string;
    addMatchesAndTeams: string;
  };
  leagues: {
    teams: string;
    matches: string;
    topScorer: string;
    goals: string;
    viewFullTable: string;
    leagueStats: string;
    totalGoals: string;
    goalsPerMatch: string;
    cleanSheets: string;
    penalties: string;
    goalsPerMatchday: string;
    topScorers: string;
    standings: string;
  };
}

const translations: Record<LocaleType, Translations> = {
  es: {
    tabs: {
      matches: 'Partidos',
      leagues: 'Ligas',
      favorites: 'Favoritos',
      calendar: 'Calendario'
    },
    matches: {
      noMatches: 'No hay partidos programados para este día',
      browseMatches: 'Explorar Partidos',
      matchEvents: 'Eventos del Partido',
      matchStats: 'Estadísticas del Partido',
      detailedStats: 'Estadísticas Detalladas',
      lineups: 'Alineaciones',
      live: 'EN VIVO',
      upcoming: 'PRÓXIMO'
    },
    favorites: {
      noFavorites: 'Sin Favoritos',
      addMatchesAndTeams: 'Añade partidos y equipos a tus favoritos para verlos aquí'
    },
    leagues: {
      teams: 'Equipos',
      matches: 'Partidos',
      topScorer: 'Máximo Goleador',
      goals: 'Goles',
      viewFullTable: 'Ver Tabla Completa',
      leagueStats: 'Estadísticas de Liga',
      totalGoals: 'Goles Totales',
      goalsPerMatch: 'Goles por Partido',
      cleanSheets: 'Porterías a Cero',
      penalties: 'Penaltis',
      goalsPerMatchday: 'Goles por Jornada',
      topScorers: 'Máximos Goleadores',
      standings: 'Clasificación'
    }
  },
  en: {
    tabs: {
      matches: 'Matches',
      leagues: 'Leagues',
      favorites: 'Favorites',
      calendar: 'Calendar'
    },
    matches: {
      noMatches: 'No matches scheduled for this day',
      browseMatches: 'Browse Matches',
      matchEvents: 'Match Events',
      matchStats: 'Match Stats',
      detailedStats: 'Detailed Statistics',
      lineups: 'Lineups',
      live: 'LIVE',
      upcoming: 'UPCOMING'
    },
    favorites: {
      noFavorites: 'No Favorites Yet',
      addMatchesAndTeams: 'Add matches and teams to your favorites to see them here'
    },
    leagues: {
      teams: 'Teams',
      matches: 'Matches',
      topScorer: 'Top Scorer',
      goals: 'Goals',
      viewFullTable: 'View Full Table',
      leagueStats: 'League Statistics',
      totalGoals: 'Total Goals',
      goalsPerMatch: 'Goals per Match',
      cleanSheets: 'Clean Sheets',
      penalties: 'Penalties',
      goalsPerMatchday: 'Goals per Matchday',
      topScorers: 'Top Scorers',
      standings: 'Standings'
    }
  }
};

export function useLocale() {
  const [locale, setLocale] = useState<LocaleType>('es');
  
  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[locale];
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // Fallback if translation not found
      }
    }
    
    return result as string;
  };
  
  return {
    locale,
    setLocale,
    t,
    translations,
    dateLocale: locale
  };
}