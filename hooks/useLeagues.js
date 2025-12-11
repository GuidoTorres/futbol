import { useState, useEffect, useCallback } from 'react';
import { getAllLeagues, getLeagueById, getSofaScoreLeagues, getLeagueTeams } from '../services/leagues';

export function useLeagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las ligas al inicio
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true);
      try {
        // Intentar primero con SofaScore, luego con la API general
        let data;
        try {
          const sofaScoreData = await getSofaScoreLeagues();
          data = sofaScoreData.leagues || [];
        } catch (err) {
          const regularData = await getAllLeagues();
          data = regularData || [];
        }

        // Enrich each league with standings and top scorers
        const enrichedLeagues = await Promise.all(
          data.map(async (league) => {
            try {
              // Fetch standings for this league
              const standingsResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.225:3000'}/api/leagues/${league.id}/standings`);
              const standingsData = await standingsResponse.json();
              
              // Transform standings to match expected format
              const standings = standingsData.standings?.slice(0, 3).map(s => ({
                position: s.position || s.played,
                team: s.team?.name || 'Unknown',
                teamId: s.team?.id,
                points: s.points || 0,
                logo: s.team?.logo
              })) || [];

              // For now, we don't have a top scorers endpoint, so leave it null
              return {
                ...league,
                standings,
                topScorer: null // Will be added when endpoint is available
              };
            } catch (err) {
              console.warn(`Could not fetch additional data for league ${league.id}:`, err.message);
              return league;
            }
          })
        );

        setLeagues(enrichedLeagues);
      } catch (err) {
        console.error('Error cargando ligas:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  // Obtener liga por ID
  const getLeague = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getLeagueById(id);
      return data;
    } catch (err) {
      console.error(`Error cargando liga con id ${id}:`, err);
      // Intentar encontrar la liga en las que ya cargamos
      const league = leagues.find(l => l.id === parseInt(id) || l.id === id);
      if (league) return league;
      throw err;
    } finally {
      setLoading(false);
    }
  }, [leagues]);

  // Obtener equipos de una liga
  const getTeamsByLeague = useCallback(async (leagueId, year) => {
    setLoading(true);
    try {
      // Primero intentar obtener el nombre de la liga si tenemos el ID
      let leagueName = leagueId;
      const league = leagues.find(l => l.id === parseInt(leagueId) || l.id === leagueId);
      if (league && league.name) {
        leagueName = league.name;
      }

      const data = await getLeagueTeams(leagueName, year);
      return data.teams || [];
    } catch (err) {
      console.error(`Error cargando equipos para liga ${leagueId}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [leagues]);

  return {
    leagues,
    loading,
    error,
    getLeague,
    getTeamsByLeague
  };
}