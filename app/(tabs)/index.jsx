import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView, Modal, Platform, TextInput, FlatList } from 'react-native';
import { format, eachDayOfInterval, addDays, startOfToday, subMonths, addMonths, getYear, getMonth, getDate, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useMatches } from '../../hooks/useMatches';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Search, X } from 'lucide-react-native';
import { searchData } from '../../services';

export default function MatchesScreen() {
  const router = useRouter();
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [matchesForSelectedDate, setMatchesForSelectedDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModalPicker, setShowModalPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { getMatchesForDate } = useMatches();
  
  // Obtener los próximos 14 días para el calendario
  const dates = eachDayOfInterval({
    start: today,
    end: addDays(today, 14),
  });
  
  // Cargar partidos para la fecha seleccionada
  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const matches = await getMatchesForDate(selectedDate);
        setMatchesForSelectedDate(matches);
      } catch (error) {
        console.error('Error cargando partidos:', error);
        setMatchesForSelectedDate([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadMatches();
  }, [selectedDate, getMatchesForDate]);
  
  // Función para buscar cuando cambia la consulta
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length > 2 && isSearchActive) {
        try {
          const data = await searchData(searchQuery);
          setSearchResults(data.results || []);
          setShowSearchResults(true);
        } catch (error) {
          console.error('Error buscando:', error);
          setSearchResults([]);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, isSearchActive]);
  
  // Función para refrescar los datos
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const matches = await getMatchesForDate(selectedDate);
      setMatchesForSelectedDate(matches);
    } catch (error) {
      console.error('Error recargando partidos:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  // Función para abrir el selector de fecha
  const openDatePicker = () => {
    if (Platform.OS === 'ios') {
      setShowModalPicker(true);
    } else {
      setShowDatePicker(true);
    }
  };
  
  // Función para manejar cambios en la fecha seleccionada
  const onDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Función para cerrar el modal (solo iOS)
  const onModalClose = () => {
    setShowModalPicker(false);
  };
  
  // Función para activar la búsqueda
  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };
  
  // Función para limpiar la búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };
  
  // Función para manejar la selección de un resultado de búsqueda
  const handleSearchResultPress = (result) => {
    if (result.type === 'player') {
      router.push(`/player/${result.id}`);
    } else if (result.type === 'team') {
      router.push(`/team/${result.id}`);
    } else if (result.type === 'league') {
      router.push(`/league/${result.id}`);
    }
    setSearchQuery('');
    setShowSearchResults(false);
    setIsSearchActive(false);
  };
  
  // Renderizar un elemento de resultado de búsqueda
  const renderSearchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultItem} 
      onPress={() => handleSearchResultPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.searchResultImage} 
      />
      <Text style={styles.searchResultText}>{item.title}</Text>
    </TouchableOpacity>
  );
  
  // Filtrar partidos basados en la búsqueda
  const filteredMatches = searchQuery.trim() === '' 
    ? matchesForSelectedDate 
    : matchesForSelectedDate.filter(match => 
        match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header con logo y buscador */}
        <View style={styles.header}>
          {isSearchActive ? (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar jugadores, equipos, ligas..."
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
              <Text style={styles.appLogo}>⚽ FUTBOL APP</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
                  <Search size={22} color="#00ff87" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                  <Image 
                    source={{ uri: 'https://ui-avatars.com/api/?name=User&background=00ff87&color=fff' }} 
                    style={styles.profileImage} 
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        
        {/* Resultados de búsqueda */}
        {showSearchResults && searchResults.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <FlatList
              data={searchResults}
              renderItem={renderSearchItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.searchResultsList}
            />
          </View>
        )}
        
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00ff87']}
              tintColor="#00ff87"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
        {/* Tira de Calendario con botón de selección */}
        <View style={styles.calendarContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
            {dates.map((date) => {
              const isSelected = date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
              
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.dateItem,
                    isSelected && styles.dateItemActive,
                  ]}
                  onPress={() => setSelectedDate(date)}>
                  <Text style={[styles.dayName, isSelected && styles.activeText]}>
                    {format(date, 'EEE', { locale: es })}
                  </Text>
                  <Text style={[styles.dayNumber, isSelected && styles.activeText]}>
                    {format(date, 'd')}
                  </Text>
                  <Text style={[styles.monthName, isSelected && styles.activeText]}>
                    {format(date, 'MMM', { locale: es })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          
          {/* Botón para abrir calendario completo */}
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={openDatePicker}
          >
            <Text style={styles.calendarButtonText}>🗓️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Date Picker para Android */}
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}
        
        {/* Modal Date Picker para iOS */}
        {Platform.OS === 'ios' && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModalPicker}
            onRequestClose={onModalClose}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={onModalClose} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Seleccionar fecha</Text>
                  <TouchableOpacity onPress={onModalClose} style={styles.modalButton}>
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  minimumDate={new Date(2020, 0, 1)}
                  maximumDate={new Date(2030, 11, 31)}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Lista de Partidos */}
        <View style={styles.matchesContainer}>
          <Text style={styles.dateHeader}>
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00ff87" />
              <Text style={styles.loadingText}>Cargando partidos...</Text>
            </View>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map(match => (
              <TouchableOpacity 
                key={match.id} 
                style={styles.matchCard}
                onPress={() => router.push(`/match/${match.id}`)}
              >
                <View style={styles.leagueHeader}>
                  <Text style={styles.leagueText}>{match.league}</Text>
                </View>
                
                <View style={styles.matchInfo}>
                  <TouchableOpacity 
                    style={styles.team}
                    onPress={() => router.push(`/team/${match.homeTeam.id}`)}
                  >
                    <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.homeTeam.name}</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.scoreContainer}>
                    <Text style={styles.score}>
                      {match.homeTeam.score} - {match.awayTeam.score}
                    </Text>
                    <Text style={styles.status}>{match.status}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.team}
                    onPress={() => router.push(`/team/${match.awayTeam.id}`)}
                  >
                    <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.awayTeam.name}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : searchQuery.trim() !== '' ? (
            <Text style={styles.noMatches}>No se encontraron resultados para "{searchQuery}"</Text>
          ) : (
            <Text style={styles.noMatches}>No hay partidos programados para este día</Text>
          )}
        </View>
      </ScrollView>
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 60,
    zIndex: 10,
  },
  appLogo: {
    fontSize: 20,
    color: '#00ff87',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 16,
    padding: 4,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00ff87',
  },
  profileImage: {
    width: '100%',
    height: '100%',
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
  searchResultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    zIndex: 9,
    maxHeight: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  searchResultsList: {
    width: '100%',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchResultImage: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 20,
  },
  searchResultText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dateList: {
    flex: 1,
    paddingVertical: 12,
  },
  calendarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
    marginLeft: 8,
    backgroundColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00ff87',
  },
  calendarButtonText: {
    fontSize: 20,
  },
  dateItem: {
    padding: 12,
    alignItems: 'center',
    minWidth: 72,
    marginHorizontal: 5,
    borderRadius: 14,
    backgroundColor: '#232323',
    borderWidth: 1,
    borderColor: '#333',
  },
  dateItemActive: {
    backgroundColor: 'rgba(0, 255, 135, 0.2)', 
    borderColor: '#00ff87',
  },
  dayName: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textTransform: 'capitalize',
  },
  dayNumber: {
    color: '#fff',
    fontSize: 22,
    marginVertical: 4,
    fontFamily: 'Inter_700Bold',
  },
  monthName: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    textTransform: 'capitalize',
  },
  activeText: {
    color: '#00ff87',
  },
  matchesContainer: {
    padding: 16,
  },
  dateHeader: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize',
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff87',
  },
  matchCard: {
    backgroundColor: '#1d1d1d',
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  leagueHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueText: {
    color: '#00ff87',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    // Eliminado el borderRadius para mostrar los logos en su forma original
    marginBottom: 8,
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
    marginTop: 10,
    paddingHorizontal: 5,
    maxWidth: 100,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 255, 135, 0.1)',
    paddingVertical: 10,
    borderRadius: 8,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  status: {
    color: '#00ff87',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noMatches: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  modalButton: {
    padding: 8,
  },
  modalButtonText: {
    color: '#00ff87',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  datePicker: {
    height: 220,
    backgroundColor: '#1a1a1a',
  },
});