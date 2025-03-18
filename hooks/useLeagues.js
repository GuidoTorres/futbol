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

        setLeagues(data);
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