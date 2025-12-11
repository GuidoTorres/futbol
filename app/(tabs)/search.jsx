import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Keyboard,
} from 'react-native';
import { Search, Clock, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import TeamLogo from '../../components/TeamLogo';
import PlayerAvatar from '../../components/PlayerAvatar';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';
import { 
  searchData, 
  getSearchSuggestions,
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryItem
} from '../../services/search';

// Filter types
const FILTER_TYPES = [
  { id: 'all', label: 'Todos' },
  { id: 'player', label: 'Jugadores' },
  { id: 'team', label: 'Equipos' },
  { id: 'league', label: 'Ligas' },
  { id: 'match', label: 'Partidos' },
];

/**
 * Search Screen - Complete implementation with modern design
 */
export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Search history
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  
  const searchInputRef = useRef(null);

  // Load search history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  // Perform search when query changes (debounced)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowHistory(true);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query = searchQuery) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowHistory(true);
      return;
    }

    setIsSearching(true);
    setShowHistory(false);
    
    try {
      const response = await searchData(query);
      setSearchResults(response.results || []);
      
      // Save to search history
      if (query.trim()) {
        await saveSearchHistory(query.trim());
        await loadHistory();
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setShowHistory(true);
      setSearchResults([]);
    }
  };

  const handleHistoryItemPress = (historyItem) => {
    setSearchQuery(historyItem.query);
    setShowHistory(false);
    Keyboard.dismiss();
  };

  const handleDeleteHistoryItem = async (itemId) => {
    try {
      await deleteSearchHistoryItem(itemId);
      await loadHistory();
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleFilterPress = (filterId) => {
    setSelectedFilter(filterId);
  };

  const handleResultPress = (result) => {
    switch (result.type) {
      case 'player':
        router.push(`/player/${result.id}`);
        break;
      case 'team':
        router.push(`/team/${result.id}`);
        break;
      case 'match':
        router.push(`/match/${result.id}`);
        break;
      case 'league':
        router.push(`/league/${result.id}`);
        break;
      default:
        break;
    }
  };

  const getResultSubtitle = (result) => {
    switch (result.type) {
      case 'player':
        return `${result.position || ''} ${result.team ? `• ${result.team.name}` : ''}`;
      case 'team':
        return result.country || '';
      case 'match':
        return `${result.homeTeam?.name || ''} vs ${result.awayTeam?.name || ''}`;
      case 'league':
        return result.country || '';
      default:
        return '';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'player':
        return 'Jugador';
      case 'team':
        return 'Equipo';
      case 'match':
        return 'Partido';
      case 'league':
        return 'Liga';
      default:
        return '';
    }
  };

  // Filter results by selected type
  const filteredResults = selectedFilter === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === selectedFilter);

  // Group results by type
  const groupedResults = filteredResults.reduce((acc, result) => {
    const type = result.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(result);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Búsqueda</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Input
            ref={searchInputRef}
            placeholder="Buscar jugadores, equipos, partidos..."
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            clearable
            icon={<Search size={20} color={colors.text.tertiary} />}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Type Buttons */}
        {searchQuery.length >= 2 && searchResults.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {FILTER_TYPES.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => handleFilterPress(filter.id)}
                style={styles.filterButton}
              >
                {filter.label}
              </Button>
            ))}
          </ScrollView>
        )}

        {/* Recent Searches */}
        {showHistory && searchHistory.length > 0 && searchQuery.length === 0 && (
          <View style={styles.historySection}>
            <View style={styles.historySectionHeader}>
              <Text style={styles.sectionTitle}>Búsquedas recientes</Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={handleClearHistory}
                textStyle={styles.clearButtonText}
              >
                Limpiar todo
              </Button>
            </View>
            <ScrollView style={styles.historyList}>
              {searchHistory.map((item) => (
                <Card
                  key={item.id}
                  variant="default"
                  padding="sm"
                  pressable
                  onPress={() => handleHistoryItemPress(item)}
                  style={styles.historyItem}
                >
                  <View style={styles.historyItemContent}>
                    <Clock size={18} color={colors.text.tertiary} />
                    <Text style={styles.historyItemText}>{item.query}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteHistoryItem(item.id)}
                      style={styles.deleteButton}
                    >
                      <X size={18} color={colors.text.tertiary} />
                    </TouchableOpacity>
                  </View>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search Results */}
        {!showHistory && (
          <ScrollView style={styles.resultsContainer}>
            {isSearching ? (
              <LoadingState message="Buscando..." />
            ) : filteredResults.length > 0 ? (
              <>
                <Text style={styles.resultsCount}>
                  {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''}
                </Text>
                
                {/* Grouped Results */}
                {Object.keys(groupedResults).map((type) => (
                  <View key={type} style={styles.resultGroup}>
                    <Text style={styles.groupTitle}>{getTypeLabel(type)}</Text>
                    {groupedResults[type].map((result) => (
                      <Card
                        key={`${result.type}-${result.id}`}
                        variant="default"
                        padding="md"
                        pressable
                        onPress={() => handleResultPress(result)}
                        style={styles.resultCard}
                      >
                        <View style={styles.resultContent}>
                          {/* Image/Avatar */}
                          {result.type === 'player' ? (
                            <PlayerAvatar
                              uri={result.photo}
                              name={result.name || result.fullName}
                              size="md"
                            />
                          ) : result.type === 'team' || result.type === 'league' ? (
                            <TeamLogo
                              uri={result.logo}
                              size="md"
                              rounded
                            />
                          ) : (
                            <View style={styles.matchIcon}>
                              <Search size={24} color={colors.primary} />
                            </View>
                          )}
                          
                          {/* Info */}
                          <View style={styles.resultInfo}>
                            <Text style={styles.resultName}>
                              {result.name || result.fullName}
                            </Text>
                            <Text style={styles.resultSubtitle}>
                              {getResultSubtitle(result)}
                            </Text>
                          </View>
                          
                          {/* Type Badge */}
                          <Badge variant="default" size="sm">
                            {getTypeLabel(result.type)}
                          </Badge>
                        </View>
                      </Card>
                    ))}
                  </View>
                ))}
              </>
            ) : searchQuery.length >= 2 ? (
              <EmptyState
                icon={<Search size={64} color={colors.text.tertiary} />}
                title="No se encontraron resultados"
                message="Intenta con otros términos de búsqueda"
              />
            ) : (
              <EmptyState
                icon={<Search size={64} color={colors.text.tertiary} />}
                title="Busca contenido"
                message="Escribe al menos 2 caracteres para buscar jugadores, equipos, ligas o partidos"
              />
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
  },
  searchContainer: {
    padding: spacing.base,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterContainer: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  filterContent: {
    gap: spacing.sm,
  },
  filterButton: {
    marginRight: 0,
  },
  historySection: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
  },
  clearButtonText: {
    color: colors.error,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    marginBottom: spacing.sm,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  historyItemText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  deleteButton: {
    padding: spacing.xs,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
  },
  resultsCount: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  resultGroup: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
  },
  resultCard: {
    marginBottom: spacing.md,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  matchIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
  },
  resultSubtitle: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
});
