import api from './api';

/**
 * Obtiene todos los eventos de un partido específico
 * @param {string|number} matchId - ID del partido
 * @returns {Promise<Array>} - Lista de eventos del partido
 */
export const getEventsByMatch = async (matchId) => {
  try {
    const response = await api.get(`/api/events/match/${matchId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener eventos del partido ${matchId}:`, error);
    throw error;
  }
};

/**
 * Crea un nuevo evento
 * @param {Object} eventData - Datos del evento a crear
 * @returns {Promise<Object>} - Evento creado
 */
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error al crear evento:', error);
    throw error;
  }
};

/**
 * Actualiza un evento existente
 * @param {string|number} eventId - ID del evento
 * @param {Object} eventData - Datos actualizados del evento
 * @returns {Promise<Object>} - Evento actualizado
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`/api/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar evento ${eventId}:`, error);
    throw error;
  }
};

/**
 * Elimina un evento
 * @param {string|number} eventId - ID del evento a eliminar
 * @returns {Promise<Object>} - Resultado de la eliminación
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar evento ${eventId}:`, error);
    throw error;
  }
};
