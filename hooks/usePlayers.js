import { useState, useEffect, useCallback } from 'react';
import { getAllPlayers, getPlayerById, getSofaScorePlayerById, searchPlayers } from '../services/players';

export function usePlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener un jugador por ID
  const getPlayer = useCallback(async (id, useCompleteInfo = false) => {
    setLoading(true);
    try {
      // Intentar primero con la API de SofaScore
      try {
        const data = await getSofaScorePlayerById(id, useCompleteInfo);
        return data.player || data;
      } catch (err) {
        // Si falla, usar la API regular
        const regularData = await getPlayerById(id);
        return regularData;
      }
    } catch (err) {
      console.error(`Error cargando jugador con id ${id}:`, err);
      // Buscar en los jugadores que ya tenemos
      const player = players.find(p => p.id === parseInt(id) || p.id === id);
      if (player) return player;
      throw err;
    } finally {
      setLoading(false);
    }
  }, [players]);

  // Buscar jugadores por nombre
  const searchPlayersByName = useCallback(async (query) => {
    if (!query || query.length < 3) {
      throw new Error('La búsqueda debe tener al menos 3 caracteres');
    }

    setLoading(true);
    try {
      const data = await searchPlayers(query);
      return data.players || [];
    } catch (err) {
      console.error(`Error buscando jugadores con query ${query}:`, err);
      // Buscar en los jugadores que ya tenemos como fallback
      const filteredPlayers = players.filter(p => 
        p.name && p.name.toLowerCase().includes(query.toLowerCase())
      );
      return filteredPlayers;
    } finally {
      setLoading(false);
    }
  }, [players]);

  return {
    players,
    loading,
    error,
    getPlayer,
    searchPlayersByName
  };
}