import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Users, Trophy, Trash2 } from 'lucide-react-native';
import FavoriteButton from './FavoriteButton';
import Card from './ui/Card';
import Button from './ui/Button';
import TeamLogo from './TeamLogo';
import PlayerAvatar from './PlayerAvatar';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

/**
 * Tarjeta para mostrar un elemento favorito
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.favorite - Datos del favorito
 * @param {string|number} props.userId - ID del usuario
 * @param {Function} props.onRemove - Callback cuando se elimina el favorito (opcional)
 */
const FavoriteCard = ({ favorite, userId, onRemove }) => {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  const handlePress = () => {
    const { entityType, entityId, entityData } = favorite;
    
    switch (entityType) {
      case 'team':
        router.push(`/team/${entityId}`);
        break;
      case 'player':
        router.push(`/player/${entityId}`);
        break;
      case 'league':
        router.push(`/league/${entityId}`);
        break;
      case 'match':
        router.push(`/match/${entityId}`);
        break;
      default:
        console.warn(`Unknown entity type: ${entityType}`);
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Eliminar favorito',
      '¿Estás seguro de que quieres eliminar este favorito?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setRemoving(true);
            try {
              // The FavoriteButton will handle the actual removal
              onRemove?.(favorite);
            } catch (error) {
              console.error('Error removing favorite:', error);
            } finally {
              setRemoving(false);
            }
          },
        },
      ]
    );
  };

  const handleFavoriteToggle = (result) => {
    if (result.action === 'removed') {
      onRemove?.(favorite);
    }
  };

  const renderEntityIcon = () => {
    switch (favorite.entityType) {
      case 'team':
        return <Users size={16} color="#888" />;
      case 'player':
        return <Users size={16} color="#888" />;
      case 'league':
        return <Trophy size={16} color="#888" />;
      case 'match':
        return <Calendar size={16} color="#888" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    const { entityType, entityData } = favorite;
    
    if (!entityData) {
      return (
        <View style={styles.unavailableContent}>
          <Text style={styles.unavailableText}>
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)} no disponible
          </Text>
        </View>
      );
    }

    switch (entityType) {
      case 'team':
        return (
          <View style={styles.content}>
            <TeamLogo
              uri={entityData.logo}
              size="md"
              rounded={true}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{entityData.name}</Text>
              {entityData.shortName && (
                <Text style={styles.subtitle}>{entityData.shortName}</Text>
              )}
              {entityData.country && (
                <View style={styles.metaRow}>
                  <MapPin size={12} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{entityData.country}</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'player':
        return (
          <View style={styles.content}>
            <PlayerAvatar
              uri={entityData.photo}
              name={entityData.name}
              size="md"
              border={false}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{entityData.name}</Text>
              {entityData.position && (
                <Text style={styles.subtitle}>{entityData.position}</Text>
              )}
              {entityData.Team && (
                <Text style={styles.metaText}>{entityData.Team.name}</Text>
              )}
              {entityData.nationality && (
                <View style={styles.metaRow}>
                  <MapPin size={12} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{entityData.nationality}</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'league':
        return (
          <View style={styles.content}>
            <TeamLogo
              uri={entityData.logo}
              size="md"
              rounded={false}
            />
            <View style={styles.info}>
              <Text style={styles.title}>{entityData.name}</Text>
              {entityData.country && (
                <View style={styles.metaRow}>
                  <MapPin size={12} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{entityData.country}</Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'match':
        return (
          <View style={styles.content}>
            <View style={styles.matchContent}>
              <View style={styles.matchTeams}>
                <View style={styles.team}>
                  <TeamLogo
                    uri={entityData.homeTeam?.logo}
                    size="sm"
                    rounded={true}
                  />
                  <Text style={styles.teamName} numberOfLines={2}>
                    {entityData.homeTeam?.shortName || entityData.homeTeam?.name}
                  </Text>
                </View>
                
                <View style={styles.matchScore}>
                  {entityData.status === 'FINISHED' ? (
                    <Text style={styles.score}>
                      {entityData.homeScore} - {entityData.awayScore}
                    </Text>
                  ) : (
                    <Text style={styles.vs}>VS</Text>
                  )}
                </View>
                
                <View style={styles.team}>
                  <TeamLogo
                    uri={entityData.awayTeam?.logo}
                    size="sm"
                    rounded={true}
                  />
                  <Text style={styles.teamName} numberOfLines={2}>
                    {entityData.awayTeam?.shortName || entityData.awayTeam?.name}
                  </Text>
                </View>
              </View>
              
              {entityData.date && (
                <View style={styles.metaRow}>
                  <Calendar size={12} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>
                    {new Date(entityData.date).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Elemento desconocido</Text>
          </View>
        );
    }
  };

  return (
    <Card
      variant="elevated"
      padding="md"
      onPress={handlePress}
      pressable={true}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.entityType}>
          {renderEntityIcon()}
          <Text style={styles.entityTypeText}>
            {favorite.entityType.charAt(0).toUpperCase() + favorite.entityType.slice(1)}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Button
            variant="ghost"
            size="sm"
            onPress={handleRemove}
            disabled={removing}
            icon={<Trash2 size={18} color={colors.error} />}
            style={styles.removeButton}
          />
        </View>
      </View>
      
      {renderContent()}
      
      <View style={styles.footer}>
        <Text style={styles.addedDate}>
          Añadido el {new Date(favorite.createdAt).toLocaleDateString('es-ES')}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  entityType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  entityTypeText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'capitalize',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  removeButton: {
    minWidth: 36,
    paddingHorizontal: spacing.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  metaText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  matchContent: {
    flex: 1,
  },
  matchTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  team: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  teamName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  matchScore: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
  },
  score: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
  vs: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  footer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  addedDate: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },
  unavailableContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  unavailableText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    fontStyle: 'italic',
  },
});

export default FavoriteCard;