import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Modal,
  Platform,
  FlatList,
} from 'react-native';
import {
  format,
  eachDayOfInterval,
  addDays,
  startOfToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useMatches } from '../../hooks/useMatches';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Search, X, Calendar } from 'lucide-react-native';
import { searchData } from '../../services';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import MatchCard from '../../components/MatchCard';
import TeamLogo from '../../components/TeamLogo';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

// Mock data for preview
const MOCK_MATCHES = [
  {
    id: 1,
    homeTeam: { name: 'Real Madrid', logo: 'https://media.api-sports.io/football/teams/541.png' },
    awayTeam: { name: 'Barcelona', logo: 'https://media.api-sports.io/football/teams/529.png' },
    homeScore: 2,
    awayScore: 1,
    status: 'FT',
    time: '90+3',
    league: 'La Liga',
    date: new Date(),
  },
  {
    id: 2,
    homeTeam: { name: 'Manchester City', logo: 'https://media.api-sports.io/football/teams/50.png' },
    awayTeam: { name: 'Liverpool', logo: 'https://media.api-sports.io/football/teams/40.png' },
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    time: '67',
    league: 'Premier League',
    date: new Date(),
  },
  {
    id: 3,
    homeTeam: { name: 'Bayern Munich', logo: 'https://media.api-sports.io/football/teams/157.png' },
    awayTeam: { name: 'Borussia Dortmund', logo: 'https://media.api-sports.io/football/teams/165.png' },
    homeScore: null,
    awayScore: null,
    status: 'NS',
    time: '20:00',
    league: 'Bundesliga',
    date: new Date(),
  },
  {
    id: 4,
    homeTeam: { name: 'PSG', logo: 'https://media.api-sports.io/football/teams/85.png' },
    awayTeam: { name: 'Marseille', logo: 'https://media.api-sports.io/football/teams/81.png' },
    homeScore: null,
    awayScore: null,
    status: 'NS',
    time: '21:00',
    league: 'Ligue 1',
    date: new Date(),
  },
];

const MOCK_SEARCH_RESULTS = [
  { id: 1, type: 'team', name: 'Real Madrid', league: 'La Liga', logo: 'https://media.api-sports.io/football/teams/541.png' },
  { id: 2, type: 'player', name: 'Lionel Messi', team: 'Inter Miami', photo: 'https://cdn.sofifa.net/players/158/023/25_120.png' },
  { id: 3, type: 'team', name: 'Manchester City', league: 'Premier League', logo: 'https://media.api-sports.io/football/teams/50.png' },
  { id: 4, type: 'player', name: 'Cristiano Ronaldo', team: 'Al Nassr', photo: 'https://cdn.sofifa.net/players/020/801/25_120.png' },
];

export default function MatchesScreen() {
  const router = useRouter();
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [matchesForSelectedDate, setMatchesForSelectedDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModalPicker, setShowModalPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getMatchesForDate } = useMatches();

  // Obtener los próximos 14 días para el calendario
  const dates = eachDayOfInterval({
    start: today,
    end: addDays(today, 14),
  });

  // Function to load mock data
  const loadMockData = () => {
    setUseMockData(true);
    setMatchesForSelectedDate(MOCK_MATCHES);
    setLoading(false);
    setError(null);
  };

  // Cargar partidos para la fecha seleccionada
  useEffect(() => {
    const loadMatches = async () => {
      if (useMockData) {
        setMatchesForSelectedDate(MOCK_MATCHES);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const matches = await getMatchesForDate(selectedDate);
        setMatchesForSelectedDate(matches);
      } catch (error) {
        console.error('Error cargando partidos:', error);
        setError('No se pudieron cargar los partidos. Por favor, intenta de nuevo.');
        setMatchesForSelectedDate([]);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [selectedDate, getMatchesForDate, useMockData]);

  // Función para buscar usando la API con cada letra ingresada
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length > 0 && isSearchActive) {
        setSearchLoading(true);
        try {
          const data = await searchData(searchQuery);
          if (data && data.results) {
            setSearchResults(data.results);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error('Error buscando:', error);
          // Use mock data on error
          setSearchResults(MOCK_SEARCH_RESULTS);
          setShowSearchResults(true);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isSearchActive]);

  // Función para refrescar los datos
  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const matches = await getMatchesForDate(selectedDate);
      setMatchesForSelectedDate(matches);
    } catch (error) {
      console.error('Error recargando partidos:', error);
      setError('No se pudieron cargar los partidos. Por favor, intenta de nuevo.');
    } finally {
      setRefreshing(false);
    }
  };

  // Función para reintentar cargar partidos
  const handleRetry = () => {
    onRefresh();
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
      activeOpacity={0.7}
    >
      <TeamLogo uri={item.image} size="sm" rounded />
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultText}>{item.title}</Text>
        <Text style={styles.searchResultType}>{item.type}</Text>
      </View>
    </TouchableOpacity>
  );

  // Mostramos todos los partidos independientemente del estado del buscador
  const filteredMatches = matchesForSelectedDate;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header con logo y buscador */}
        <View style={styles.header}>
          {isSearchActive ? (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Input
                  placeholder="Buscar jugadores, equipos, ligas..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearable
                  icon={<Search size={20} color={colors.text.tertiary} />}
                  style={styles.searchInputComponent}
                  inputStyle={styles.searchInputText}
                />
              </View>
              <Button
                variant="ghost"
                size="sm"
                onPress={toggleSearch}
                style={styles.closeSearchButton}
              >
                <X size={22} color={colors.primary} />
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.appLogo}>⚽ FUTBOL APP</Text>
              <View style={styles.headerButtons}>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={loadMockData}
                  style={styles.iconButton}
                >
                  <Text style={styles.previewButtonText}>Vista Previa</Text>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={toggleSearch}
                  style={styles.iconButton}
                >
                  <Search size={22} color={colors.primary} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={openDatePicker}
                  style={styles.iconButton}
                >
                  <Calendar size={22} color={colors.primary} />
                </Button>
              </View>
            </>
          )}
        </View>

        {/* Resultados de búsqueda */}
        {isSearchActive && (
          <View style={styles.searchResultsContainer}>
            {searchLoading ? (
              <View style={styles.searchLoadingContainer}>
                <LoadingState message="Buscando..." size="sm" />
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.searchResultsList}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={10}
              />
            ) : searchQuery.trim().length > 0 ? (
              <View style={styles.emptySearchContainer}>
                <EmptyState
                  title="Sin resultados"
                  message={`No se encontraron resultados para "${searchQuery}"`}
                />
              </View>
            ) : null}
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.dateList}
              contentContainerStyle={styles.dateListContent}
            >
              {dates.map((date) => {
                const isSelected =
                  date.toISOString().split('T')[0] ===
                  selectedDate.toISOString().split('T')[0];

                return (
                  <Card
                    key={date.toISOString()}
                    variant={isSelected ? "elevated" : "default"}
                    padding="sm"
                    pressable
                    onPress={() => setSelectedDate(date)}
                    style={[
                      styles.dateItem,
                      isSelected && styles.dateItemActive,
                    ]}
                  >
                    <Text
                      style={[styles.dayName, isSelected && styles.activeText]}
                    >
                      {format(date, 'EEE', { locale: es })}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        isSelected && styles.activeText,
                      ]}
                    >
                      {format(date, 'd')}
                    </Text>
                    <Text
                      style={[
                        styles.monthName,
                        isSelected && styles.activeText,
                      ]}
                    >
                      {format(date, 'MMM', { locale: es })}
                    </Text>
                  </Card>
                );
              })}
            </ScrollView>
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
                    <TouchableOpacity
                      onPress={onModalClose}
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Seleccionar fecha</Text>
                    <TouchableOpacity
                      onPress={onModalClose}
                      style={styles.modalButton}
                    >
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
              <LoadingState message="Cargando partidos..." />
            ) : error ? (
              <ErrorState
                title="Error al cargar partidos"
                message={error}
                onRetry={handleRetry}
              />
            ) : filteredMatches.length > 0 ? (
              <View style={styles.matchesList}>
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={{
                      id: match.id,
                      homeTeam: {
                        name: match.homeTeam.name,
                        logo: match.homeTeam.logo,
                        id: match.homeTeam.id,
                      },
                      awayTeam: {
                        name: match.awayTeam.name,
                        logo: match.awayTeam.logo,
                        id: match.awayTeam.id,
                      },
                      homeScore: match.homeTeam.score,
                      awayScore: match.awayTeam.score,
                      status: match.status,
                      league: { name: match.league },
                      date: match.date,
                      time: match.time,
                    }}
                    variant="detailed"
                    style={styles.matchCardItem}
                  />
                ))}
              </View>
            ) : (
              <EmptyState
                title="No hay partidos"
                message="No hay partidos programados para este día"
                icon={<Calendar size={64} color={colors.text.tertiary} />}
              />
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
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...shadows.base,
    minHeight: 60,
    zIndex: 10,
  },
  appLogo: {
    fontSize: typography.fontSize.xl,
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    padding: spacing.xs,
  },
  previewButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInputWrapper: {
    flex: 1,
  },
  searchInputComponent: {
    marginBottom: 0,
  },
  searchInputText: {
    fontSize: typography.fontSize.base,
  },
  closeSearchButton: {
    minWidth: 44,
    minHeight: 44,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    zIndex: 999,
    maxHeight: 400,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...shadows.lg,
  },
  searchLoadingContainer: {
    padding: spacing.xl,
  },
  searchResultsList: {
    width: '100%',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.md,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  searchResultType: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    textTransform: 'capitalize',
  },
  emptySearchContainer: {
    padding: spacing.xl,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...shadows.sm,
  },
  dateList: {
    flex: 1,
    paddingVertical: spacing.md,
  },
  dateListContent: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  dateItem: {
    alignItems: 'center',
    minWidth: 70,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  dateItemActive: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dayName: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'capitalize',
    marginBottom: spacing.xs,
  },
  dayNumber: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    marginVertical: spacing.xs,
  },
  monthName: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    textTransform: 'capitalize',
    marginTop: spacing.xs,
  },
  activeText: {
    color: colors.primary,
  },
  matchesContainer: {
    padding: spacing.base,
    minHeight: 400,
  },
  dateHeader: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    marginBottom: spacing.base,
    fontFamily: typography.fontFamily.semiBold,
    textTransform: 'capitalize',
    paddingLeft: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  matchesList: {
    gap: spacing.base,
  },
  matchCardItem: {
    marginBottom: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
  },
  modalButton: {
    padding: spacing.sm,
  },
  modalButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  datePicker: {
    height: 220,
    backgroundColor: colors.background.secondary,
  },
});
