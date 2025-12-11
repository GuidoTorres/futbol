import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { 
  searchPlayersForComparison, 
  getComparisonSuggestions,
  comparePlayers,
  generateRadarChart 
} from '../../services/comparison';

const { width } = Dimensions.get('window');

export default function ComparisonScreen() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      // Load popular players for suggestions
      const response = await searchPlayersForComparison('', { popular: true });
      setSuggestions(response.data || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await searchPlayersForComparison(query);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addPlayer = (player) => {
    if (selectedPlayers.length >= 4) {
      Alert.alert('Límite alcanzado', 'Solo puedes comparar hasta 4 jugadores');
      return;
    }

    if (selectedPlayers.find(p => p.id === player.id)) {
      Alert.alert('Jugador ya seleccionado', 'Este jugador ya está en la comparación');
      return;
    }

    setSelectedPlayers([...selectedPlayers, player]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removePlayer = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  };

  const startComparison = () => {
    if (selectedPlayers.length < 2) {
      Alert.alert('Selección insuficiente', 'Necesitas al menos 2 jugadores para comparar');
      return;
    }

    const playerIds = selectedPlayers.map(p => p.id);
    router.push({
      pathname: '/comparison/results',
      params: { 
        playerIds: JSON.stringify(playerIds),
        playerNames: JSON.stringify(selectedPlayers.map(p => p.name))
      }
    });
  };

  const renderPlayerCard = (player, isSelected = false) => (
    <TouchableOpacity
      key={player.id}
      style={[styles.playerCard, isSelected && styles.selectedPlayerCard]}
      onPress={() => isSelected ? removePlayer(player.id) : addPlayer(player)}
    >
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerDetails}>
          {player.position} • {player.team}
        </Text>
      </View>
      <Ionicons
        name={isSelected ? 'remove-circle' : 'add-circle'}
        size={24}
        color={isSelected ? '#FF6B6B' : '#4ECDC4'}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Comparar Jugadores</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Selected Players Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Jugadores Seleccionados ({selectedPlayers.length}/4)
          </Text>
          
          {selectedPlayers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                Busca y selecciona jugadores para comparar
              </Text>
            </View>
          ) : (
            <View style={styles.selectedPlayersContainer}>
              {selectedPlayers.map(player => renderPlayerCard(player, true))}
            </View>
          )}
        </View>

        {/* Search Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buscar Jugadores</Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre del jugador..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="words"
            />
            {searchLoading && (
              <ActivityIndicator size="small" color="#4ECDC4" style={styles.searchLoader} />
            )}
          </View>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Resultados de búsqueda:</Text>
              {searchResults.map(player => renderPlayerCard(player))}
            </View>
          )}
        </View>

        {/* Suggestions Section */}
        {suggestions.length > 0 && searchQuery === '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jugadores Populares</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#4ECDC4" style={styles.loader} />
            ) : (
              <View style={styles.suggestionsContainer}>
                {suggestions.slice(0, 10).map(player => renderPlayerCard(player))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Compare Button */}
      {selectedPlayers.length >= 2 && (
        <View style={styles.compareButtonContainer}>
          <TouchableOpacity
            style={styles.compareButton}
            onPress={startComparison}
          >
            <Ionicons name="analytics" size={24} color="white" />
            <Text style={styles.compareButtonText}>
              Comparar {selectedPlayers.length} Jugadores
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  selectedPlayersContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedPlayerCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#4ECDC4',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  playerDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchLoader: {
    marginLeft: 10,
  },
  resultsContainer: {
    marginTop: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  loader: {
    paddingVertical: 20,
  },
  compareButtonContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    borderRadius: 12,
  },
  compareButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 10,
  },
});