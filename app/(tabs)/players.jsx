import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import { usePlayers } from '../../hooks/usePlayers';

export default function PlayersScreen() {
  const router = useRouter();
  const { searchPlayersByName } = usePlayers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manejar la búsqueda cuando cambia el texto
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Función para realizar la búsqueda
  const handleSearch = async () => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchPlayersByName(searchQuery.trim());
      setSearchResults(results);
      setError(null);
    } catch (err) {
      console.error('Error en búsqueda:', err);
      setError('No se pudieron cargar los resultados. Intenta nuevamente.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar la búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  // Activar/desactivar la búsqueda
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Navegar a la página de detalle del jugador
  const navigateToPlayerDetail = (playerId) => {
    router.push(`/player/${playerId}`);
  };

  // Renderizar cada jugador en la lista
  const renderPlayerItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.playerCard}
      onPress={() => navigateToPlayerDetail(item.id)}
    >
      <Image 
        source={{ uri: item.photo || 'https://via.placeholder.com/100?text=?' }} 
        style={styles.playerImage} 
      />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerDetails}>
          {item.position || 'Jugador'} 
          {item.nationality && ` • ${item.nationality}`}
        </Text>
        {item.Team && (
          <View style={styles.teamInfo}>
            {item.Team.logo && (
              <Image 
                source={{ uri: item.Team.logo }} 
                style={styles.teamLogo} 
              />
            )}
            <Text style={styles.teamName}>{item.Team.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Renderizar contenido principal
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00ff87" />
          <Text style={styles.loadingText}>Buscando jugadores...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (searchQuery.trim().length >= 3 && searchResults.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.noResultsText}>No se encontraron jugadores que coincidan con "{searchQuery}"</Text>
        </View>
      );
    }

    if (searchResults.length > 0) {
      return (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderPlayerItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    // Estado inicial o búsqueda vacía
    return (
      <View style={styles.centerContainer}>
        <Search size={50} color="#333" style={styles.searchIcon} />
        <Text style={styles.searchPrompt}>Busca jugadores por nombre</Text>
        <Text style={styles.searchHint}>Ingresa al menos 3 caracteres para comenzar la búsqueda</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header con búsqueda */}
        <View style={styles.header}>
          {isSearchActive ? (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar jugadores..."
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={clearSearch} style={styles.searchClearButton}>
                    <X size={16} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
                <X size={22} color="#00ff87" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.headerTitle}>Jugadores</Text>
              <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
                <Search size={22} color="#00ff87" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Contenido principal */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 60,
  },
  headerTitle: {
    color: '#00ff87',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 20,
    marginRight: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    color: '#fff',
    fontFamily: 'Inter_400Regular',
  },
  searchClearButton: {
    padding: 8,
    marginRight: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  searchIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  searchPrompt: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchHint: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  noResultsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  listContent: {
    padding: 16,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#252525',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  playerDetails: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 6,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  teamName: {
    color: '#00ff87',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
});