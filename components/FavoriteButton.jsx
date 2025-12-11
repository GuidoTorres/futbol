import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useFavoriteStatus } from '../hooks/useFavorites';

/**
 * Botón para marcar/desmarcar favoritos
 * @param {Object} props - Propiedades del componente
 * @param {string|number} props.userId - ID del usuario
 * @param {string} props.entityType - Tipo de entidad (team, player, league, match)
 * @param {string|number} props.entityId - ID de la entidad
 * @param {Object} props.preferences - Preferencias del favorito (opcional)
 * @param {number} props.size - Tamaño del icono (default: 24)
 * @param {string} props.activeColor - Color cuando está activo (default: '#ff4757')
 * @param {string} props.inactiveColor - Color cuando está inactivo (default: '#888')
 * @param {Function} props.onToggle - Callback cuando se alterna el estado (opcional)
 * @param {Object} props.style - Estilos adicionales (opcional)
 * @param {boolean} props.disabled - Si el botón está deshabilitado (opcional)
 */
const FavoriteButton = ({
  userId,
  entityType,
  entityId,
  preferences = {},
  size = 24,
  activeColor = '#ff4757',
  inactiveColor = '#888',
  onToggle,
  style,
  disabled = false
}) => {
  const { isFavorite, loading, toggle } = useFavoriteStatus(userId, entityType, entityId);

  const handlePress = async () => {
    if (disabled || loading) return;
    
    try {
      const result = await toggle(preferences);
      onToggle?.(result);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <TouchableOpacity style={[styles.button, style]} disabled>
        <ActivityIndicator size="small" color={inactiveColor} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      accessibilityState={{ disabled }}
    >
      <Heart
        size={size}
        color={isFavorite ? activeColor : inactiveColor}
        fill={isFavorite ? activeColor : 'transparent'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});

export default FavoriteButton;