import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Filter, ChevronDown } from "lucide-react-native";
import { colors, typography, spacing, borderRadius, shadows } from "../../styles/theme";
import { useResponsiveValue, useGridColumns } from "../../utils/responsive";
import { Input, LoadingState, EmptyState, ErrorState, Card, Button, Badge } from "../../components/ui";
import PlayerAvatar from "../../components/PlayerAvatar";
import FilterPanel from "../../components/FilterPanel";
import { usePlayers } from "../../hooks/usePlayers";
import { searchPlayers } from "../../services/players";

const SORT_OPTIONS = [
  { id: "name", label: "Nombre" },
  { id: "rating", label: "Valoración" },
  { id: "goals", label: "Goles" },
  { id: "assists", label: "Asistencias" },
];

export default function PlayersScreen() {
  const router = useRouter();
  const { loading: hookLoading, error: hookError } = usePlayers();
  
  // State
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState("name");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  // Responsive
  const numColumns = useGridColumns();
  const cardPadding = useResponsiveValue({ base: spacing.md, md: spacing.base });

  // Load initial data
  useEffect(() => {
    loadPlayers();
  }, []);

  // Apply search, filters, and sorting
  useEffect(() => {
    applyFiltersAndSort();
  }, [players, searchQuery, activeFilters, sortBy]);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for now - replace with actual API call
      const mockPlayers = generateMockPlayers();
      setPlayers(mockPlayers);
    } catch (err) {
      console.error("Error loading players:", err);
      setError(err.message || "Error al cargar jugadores");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPlayers();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length >= 3) {
      try {
        setSearchLoading(true);
        const results = await searchPlayers(query);
        setPlayers(results.players || []);
      } catch (err) {
        console.error("Error searching players:", err);
        // Continue with local filtering
      } finally {
        setSearchLoading(false);
      }
    } else if (query.length === 0) {
      // Reset to all players
      await loadPlayers();
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...players];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (player) =>
          player.name?.toLowerCase().includes(query) ||
          player.team?.toLowerCase().includes(query) ||
          player.position?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (activeFilters.position && activeFilters.position.length > 0) {
      result = result.filter((player) =>
        activeFilters.position.includes(player.position)
      );
    }

    if (activeFilters.league) {
      result = result.filter((player) => player.league === activeFilters.league);
    }

    if (activeFilters.nationality && activeFilters.nationality.length > 0) {
      result = result.filter((player) =>
        activeFilters.nationality.includes(player.nationality)
      );
    }

    if (activeFilters.minAge) {
      result = result.filter((player) => player.age >= parseInt(activeFilters.minAge));
    }

    if (activeFilters.maxAge) {
      result = result.filter((player) => player.age <= parseInt(activeFilters.maxAge));
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "goals":
          return (b.goals || 0) - (a.goals || 0);
        case "assists":
          return (b.assists || 0) - (a.assists || 0);
        default:
          return 0;
      }
    });

    setFilteredPlayers(result);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(activeFilters).filter((key) => {
      const value = activeFilters[key];
      return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      );
    }).length;
  };

  const handlePlayerPress = (playerId) => {
    router.push(`/player/${playerId}`);
  };

  const renderPlayerCard = ({ item }) => (
    <PlayerCard
      player={item}
      onPress={() => handlePlayerPress(item.id)}
      style={{ flex: numColumns > 1 ? 1 / numColumns : 1 }}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Jugadores</Text>
      
      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar jugadores..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearable
          style={styles.searchInput}
        />
      </View>

      {/* Filter and Sort Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={colors.text.primary} />
          <Text style={styles.filterButtonText}>Filtros</Text>
          {getActiveFiltersCount() > 0 && (
            <Badge size="sm" variant="success">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortMenuVisible(!sortMenuVisible)}
        >
          <Text style={styles.sortButtonText}>
            {SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || "Ordenar"}
          </Text>
          <ChevronDown size={16} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Sort Menu */}
      {sortMenuVisible && (
        <View style={styles.sortMenu}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption,
                sortBy === option.id && styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortBy(option.id);
                setSortMenuVisible(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === option.id && styles.sortOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredPlayers.length} jugador{filteredPlayers.length !== 1 ? "es" : ""}
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="Cargando jugadores..." />
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          title="Error al cargar jugadores"
          message={error}
          onRetry={loadPlayers}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredPlayers}
        renderItem={renderPlayerCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title="No se encontraron jugadores"
            message={
              searchQuery || getActiveFiltersCount() > 0
                ? "Intenta ajustar tu búsqueda o filtros"
                : "No hay jugadores disponibles"
            }
          />
        }
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* Filter Modal */}
      <FilterPanel
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        filterOptions={getFilterOptions()}
        initialFilters={activeFilters}
        entityType="player"
      />
    </SafeAreaView>
  );
}

// Player Card Component
const PlayerCard = ({ player, onPress, style }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.playerCardContainer,
        style,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Card variant="elevated" padding="md" style={styles.playerCard}>
          <View style={styles.playerCardContent}>
            <PlayerAvatar
              uri={player.photo}
              name={player.name}
              size="lg"
              border
            />
            
            <View style={styles.playerInfo}>
              <Text style={styles.playerName} numberOfLines={1}>
                {player.name}
              </Text>
              <Text style={styles.playerTeam} numberOfLines={1}>
                {player.team}
              </Text>
              <Text style={styles.playerPosition}>{player.position}</Text>
            </View>

            <View style={styles.playerStats}>
              {player.rating && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Rating</Text>
                  <Text style={styles.statValue}>{player.rating}</Text>
                </View>
              )}
              {player.goals !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Goles</Text>
                  <Text style={styles.statValue}>{player.goals}</Text>
                </View>
              )}
              {player.assists !== undefined && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Asist.</Text>
                  <Text style={styles.statValue}>{player.assists}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper functions
const generateMockPlayers = () => {
  const positions = ["Portero", "Defensa", "Centrocampista", "Delantero"];
  const teams = [
    "Real Madrid",
    "Barcelona",
    "Atlético Madrid",
    "Sevilla",
    "Valencia",
    "Athletic Bilbao",
  ];
  const nationalities = ["España", "Argentina", "Brasil", "Francia", "Alemania"];
  const leagues = ["La Liga", "Premier League", "Serie A", "Bundesliga"];

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Jugador ${i + 1}`,
    photo: `https://via.placeholder.com/150?text=P${i + 1}`,
    team: teams[Math.floor(Math.random() * teams.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    league: leagues[Math.floor(Math.random() * leagues.length)],
    age: 18 + Math.floor(Math.random() * 20),
    rating: (6 + Math.random() * 3).toFixed(1),
    goals: Math.floor(Math.random() * 30),
    assists: Math.floor(Math.random() * 20),
  }));
};

const getFilterOptions = () => {
  return {
    positions: [
      { id: "Portero", name: "Portero" },
      { id: "Defensa", name: "Defensa" },
      { id: "Centrocampista", name: "Centrocampista" },
      { id: "Delantero", name: "Delantero" },
    ],
    leagues: [
      { id: "La Liga", name: "La Liga" },
      { id: "Premier League", name: "Premier League" },
      { id: "Serie A", name: "Serie A" },
      { id: "Bundesliga", name: "Bundesliga" },
    ],
    nationalities: [
      { id: "España", name: "España" },
      { id: "Argentina", name: "Argentina" },
      { id: "Brasil", name: "Brasil" },
      { id: "Francia", name: "Francia" },
      { id: "Alemania", name: "Alemania" },
    ],
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.base,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
    gap: spacing.sm,
  },
  filterButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
    gap: spacing.xs,
  },
  sortButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  sortMenu: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.base,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.md,
  },
  sortOption: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sortOptionActive: {
    backgroundColor: colors.background.tertiary,
  },
  sortOptionText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  resultsCount: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  playerCardContainer: {
    padding: spacing.xs,
  },
  playerCard: {
    marginBottom: 0,
  },
  playerCardContent: {
    alignItems: "center",
  },
  playerInfo: {
    alignItems: "center",
    marginTop: spacing.md,
    width: "100%",
  },
  playerName: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  playerTeam: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  playerPosition: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.tertiary,
  },
  playerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
});
