import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Alert
} from 'react-native';
import { Heart, BarChart3, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../hooks/useFavorites';
import FavoriteCard from '../../components/FavoriteCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';
import { useResponsiveValue, useGridColumns, useIsTablet } from '../../utils/responsive';

// Mock user ID - En una app real, esto vendría del contexto de autenticación
const MOCK_USER_ID = 1;

export default function FavoritesScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showStats, setShowStats] = useState(false);
  
  const {
    favorites,
    loading,
    error,
    stats,
    refresh,
    getFavoritesByType,
    clearError
  } = useFavorites(MOCK_USER_ID);
  
  // Responsive values
  const isTablet = useIsTablet();
  const numColumns = useGridColumns();
  const containerPadding = useResponsiveValue({ base: spacing.lg, md: spacing.xl });

  const filterOptions = [
    { key: 'all', label: 'Todos', icon: Heart },
    { key: 'team', label: 'Equipos', icon: Heart },
    { key: 'player', label: 'Jugadores', icon: Heart },
    { key: 'league', label: 'Ligas', icon: Heart },
    { key: 'match', label: 'Partidos', icon: Heart },
  ];

  const filteredFavorites = selectedFilter === 'all' 
    ? favorites 
    : getFavoritesByType(selectedFilter);

  const handleRefresh = async () => {
    try {
      await refresh();
      clearError();
    } catch (err) {
      Alert.alert('Error', 'No se pudieron actualizar los favoritos');
    }
  };

  const handleFavoriteRemove = (removedFavorite) => {
    // El hook ya maneja la actualización del estado
    console.log('Favorito eliminado:', removedFavorite);
  };

  const renderFilterButtons = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {filterOptions.map((option) => {
        const isActive = selectedFilter === option.key;
        const count = stats?.byType?.[option.key] || 0;
        
        return (
          <Button
            key={option.key}
            variant={isActive ? "primary" : "secondary"}
            size="sm"
            onPress={() => setSelectedFilter(option.key)}
            style={styles.filterButton}
          >
            <View style={styles.filterButtonContent}>
              <Text style={[
                styles.filterButtonText,
                isActive && styles.filterButtonTextActive
              ]}>
                {option.label}
              </Text>
              {count > 0 && (
                <View style={[
                  styles.filterBadge,
                  isActive && styles.filterBadgeActive
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    isActive && styles.filterBadgeTextActive
                  ]}>
                    {count}
                  </Text>
                </View>
              )}
            </View>
          </Button>
        );
      })}
    </ScrollView>
  );

  const renderStats = () => {
    if (!showStats || !stats) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Estadísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          {Object.entries(stats.byType).map(([type, count]) => (
            <View key={type} style={styles.statItem}>
              <Text style={styles.statNumber}>{count}</Text>
              <Text style={styles.statLabel}>
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <View style={styles.headerActions}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setShowStats(!showStats)}
            icon={<BarChart3 size={20} color={colors.text.secondary} />}
            style={styles.headerButton}
          />
          <Button
            variant="ghost"
            size="sm"
            onPress={handleRefresh}
            disabled={loading}
            loading={loading}
            icon={!loading && <RefreshCw size={20} color={colors.text.secondary} />}
            style={styles.headerButton}
          />
        </View>
      </View>
      
      {stats && (
        <Text style={styles.headerSubtitle}>
          {stats.total} elemento{stats.total !== 1 ? 's' : ''} guardado{stats.total !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );

  const renderEmptyState = () => {
    const filterLabel = filterOptions.find(f => f.key === selectedFilter)?.label;
    
    return (
      <EmptyState
        icon={<Heart size={64} color={colors.border.medium} />}
        title={selectedFilter === 'all' ? 'Sin Favoritos' : `Sin ${filterLabel}`}
        message={
          selectedFilter === 'all' 
            ? 'Añade partidos, equipos, jugadores y ligas a tus favoritos para verlos aquí'
            : `No tienes ${filterLabel?.toLowerCase()} en favoritos`
        }
        action={
          <Button 
            variant="primary"
            size="md"
            onPress={() => router.push('/')}
          >
            Explorar Contenido
          </Button>
        }
      />
    );
  };

  const renderError = () => (
    <ErrorState
      title="Error al cargar favoritos"
      message={error || 'No se pudieron cargar tus favoritos. Por favor, intenta de nuevo.'}
      onRetry={handleRefresh}
    />
  );

  const renderContent = () => {
    // Show loading state on initial load
    if (loading && favorites.length === 0 && !error) {
      return <LoadingState message="Cargando favoritos..." />;
    }

    // Show error state if there's an error and no cached data
    if (error && favorites.length === 0) {
      return renderError();
    }

    // Show empty state if no favorites match the filter
    if (filteredFavorites.length === 0) {
      return renderEmptyState();
    }

    // Show favorites list with pull-to-refresh
    return (
      <ScrollView
        style={styles.favoritesList}
        contentContainerStyle={[
          styles.favoritesListContent,
          { paddingHorizontal: containerPadding }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={[
          styles.favoritesGrid,
          isTablet && styles.favoritesGridTablet
        ]}>
          {filteredFavorites.map((favorite) => (
            <View 
              key={`${favorite.entityType}-${favorite.entityId}`}
              style={[
                styles.favoriteCardWrapper,
                isTablet && { width: numColumns === 2 ? '48%' : '31%' }
              ]}
            >
              <FavoriteCard
                favorite={favorite}
                userId={MOCK_USER_ID}
                onRemove={handleFavoriteRemove}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderStats()}
      {renderFilterButtons()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: colors.background.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerButton: {
    minWidth: 40,
    paddingHorizontal: spacing.xs,
  },
  statsContainer: {
    backgroundColor: colors.background.secondary,
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statsTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '20%',
    marginBottom: spacing.sm,
  },
  statNumber: {
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
  },
  filterContainer: {
    marginBottom: spacing.base,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  filterButton: {
    marginRight: spacing.md,
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  filterButtonTextActive: {
    fontFamily: typography.fontFamily.semiBold,
  },
  filterBadge: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  filterBadgeText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  filterBadgeTextActive: {
    color: '#000',
  },
  favoritesList: {
    flex: 1,
  },
  favoritesListContent: {
    paddingBottom: spacing.xl,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  favoritesGridTablet: {
    gap: spacing.base,
  },
  favoriteCardWrapper: {
    width: '100%',
    marginBottom: spacing.base,
  },
});