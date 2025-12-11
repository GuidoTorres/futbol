import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  VictoryPie,
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
  VictoryBar,
  VictoryGroup,
} from 'victory-native';
import { Svg, Rect, Line, Circle, Path } from 'react-native-svg';
import { Calendar, MapPin } from 'lucide-react-native';
import { useMatches, EXAMPLE_MATCH } from '../../hooks/useMatches';
import { getTeamDetails, getTeamPlayers } from '../../services/teams';
import LineupDisplay from './LineupDisplay';
import TeamLogo from '../../components/TeamLogo';
import PlayerAvatar from '../../components/PlayerAvatar';
import Badge from '../../components/ui/Badge';
import FavoriteButton from '../../components/FavoriteButton';
import StatCard from '../../components/StatCard';
import { LoadingState, ErrorState } from '../../components/ui';
import { colors, spacing, typography } from '../../styles/theme';


const { width: screenWidth } = Dimensions.get('window');



const MatchDetailScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id } = params;
  const [match, setMatch] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getMatchById } = useMatches();
  const [activeTab, setActiveTab] = useState('resumen');
  // Hook para el sub-tab de alineaciones
  const [activeSubTab, setActiveSubTab] = useState('campo');
  // State para la vista de equipo en la lista de jugadores
  const [teamView, setTeamView] = useState('home');
  // Hook para el submenu de estadísticas (debe estar aquí para evitar errores de hooks)
  const [statsSubTab, setStatsSubTab] = useState('resumen');

  useEffect(() => {
    fetchData();
  }, [id]);

  // Retry function for error state
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-fetch data
    fetchData();
  };

  // Function to fetch data (extracted for retry)
  const fetchData = async () => {
    try {
      const matchData = await getMatchById(id);
      setMatch(matchData);

      const homeTeamId = matchData.homeTeamId;
      const awayTeamId = matchData.awayTeamId;

      const [
        homeTeamResponse,
        homePlayersResponse,
        awayTeamResponse,
        awayPlayersResponse,
      ] = await Promise.all([
        getTeamDetails(homeTeamId),
        getTeamPlayers(homeTeamId),
        getTeamDetails(awayTeamId),
        getTeamPlayers(awayTeamId),
      ]);

      setHomeTeam(homeTeamResponse.team || homeTeamResponse);
      setAwayTeam(awayTeamResponse.team || awayTeamResponse);
      setHomePlayers(homePlayersResponse.players || []);
      setAwayPlayers(awayPlayersResponse.players || []);
      setError(null);
    } catch (err) {
      console.error(`Error al cargar los datos del partido ${id}:`, err);
      setError('No se pudieron cargar los datos del partido.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LoadingState message="Cargando datos del partido..." size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ErrorState
            title="Error al cargar"
            message={error}
            onRetry={handleRetry}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Missing data state
  if (!match || !match.homeTeam || !match.awayTeam) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ErrorState
            title="Datos incompletos"
            message="No se pudieron cargar los datos del partido"
            onRetry={handleRetry}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Aseguramos que existan las propiedades antes de usarlas
  const statsData = [
    {
      x: 'Posesión',
      home: match.stats?.possession?.home || 0,
      away: match.stats?.possession?.away || 0,
    },
    {
      x: 'Tiros',
      home: match.stats?.shots?.home || 0,
      away: match.stats?.shots?.away || 0,
    },
    {
      x: 'A Puerta',
      home: match.stats?.shotsOnTarget?.home || 0,
      away: match.stats?.shotsOnTarget?.away || 0,
    },
    {
      x: 'Córners',
      home: match.stats?.corners?.home || 0,
      away: match.stats?.corners?.away || 0,
    },
    {
      x: 'Pases',
      home: match.stats?.passes?.home || 0,
      away: match.stats?.passes?.away || 0,
    },
  ];

  // Traducción para estadísticas detalladas - movido aquí arriba para que esté disponible en todas las secciones
  const statTranslations = {
    possession: 'Posesión',
    shots: 'Tiros',
    shotsOnTarget: 'Tiros a Puerta',
    corners: 'Córners',
    fouls: 'Faltas',
    yellowCards: 'Tarjetas Amarillas',
    redCards: 'Tarjetas Rojas',
    offsides: 'Fueras de Juego',
    saves: 'Paradas',
    passes: 'Pases',
    passAccuracy: 'Precisión de Pases %',
  };

  // Para visualizar la formación táctica
  const renderFormationVisualizer = (formation, isHome = true) => {
    const parts = formation.split('-');
    return (
      <View style={styles.formationVisualizer}>
        {parts.map((count, index) => (
          <View key={index} style={styles.formationRow}>
            {[...Array(parseInt(count, 10))].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.formationDot,
                  { backgroundColor: isHome ? '#00ff87' : '#ff4d4d' },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Enhanced Tab Button Component with animations
  const TabButton = ({ title, active, onPress }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
      <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
        <TouchableOpacity
          style={[styles.tabButton, active && styles.activeTabButton]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text
            style={[styles.tabButtonText, active && styles.activeTabButtonText]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // SubTab button component
  const SubTabButton = ({ title, active, onPress }) => (
    <TouchableOpacity
      style={[styles.subTabButton, active && styles.activeSubTabButton]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.subTabButtonText,
          active && styles.activeSubTabButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Render player list item component with navigation
  const PlayerListItem = ({ player, isStarter = false }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const handlePress = () => {
      if (player.id) {
        router.push(`/player/${player.id}`);
      }
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.playerListItem}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.playerNumberBox}>
            <Text style={styles.playerNumberBoxText}>{player.number}</Text>
          </View>
          <PlayerAvatar
            uri={player.image}
            name={player.name}
            size="md"
          />
          <View style={styles.playerListInfo}>
            <Text style={styles.playerListName}>{player.name}</Text>
            <Text style={styles.playerListPosition}>{player.position}</Text>
          </View>
          {isStarter && (
            <Badge variant="success" size="sm">
              Titular
            </Badge>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const CoachCard = ({ coach, teamName }) => (
    <TouchableOpacity style={styles.coachCard}>
      <Image source={{ uri: coach.image }} style={styles.coachImage} />
      <View style={styles.coachInfo}>
        <Text style={styles.coachName}>{coach.name}</Text>
        <Text style={styles.coachTeam}>{teamName}</Text>
        <Text style={styles.coachDetails}>
          {coach.nationality}, {coach.age} años
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render staff member component
  const StaffMember = ({ member }) => (
    <View style={styles.staffMember}>
      <Image source={{ uri: member.image }} style={styles.staffImage} />
      <Text style={styles.staffName}>{member.name}</Text>
      <Text style={styles.staffRole}>{member.role}</Text>
    </View>
  );

  // Render content based on active sub-tab
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'campo':
        return (
          <>
            <LineupDisplay
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          </>
        );
      case 'jugadores':
        return (
          <>
            <View style={styles.teamSelectorContainer}>
              <TouchableOpacity
                style={[
                  styles.teamSelectorButton,
                  { backgroundColor: teamView === 'home' ? '#00ff87' : '#333' },
                ]}
                onPress={() => setTeamView('home')}
              >
                <Text
                  style={[
                    styles.teamSelectorText,
                    { color: teamView === 'home' ? '#000' : '#fff' },
                  ]}
                >
                  {match.homeTeam.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.teamSelectorButton,
                  { backgroundColor: teamView === 'away' ? '#ff4d4d' : '#333' },
                ]}
                onPress={() => setTeamView('away')}
              >
                <Text
                  style={[
                    styles.teamSelectorText,
                    { color: teamView === 'away' ? '#000' : '#fff' },
                  ]}
                >
                  {match.awayTeam.name}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.playerListContainer}>
              <Text style={styles.playerListHeader}>Titulares</Text>
              {(teamView === 'home'
                ? match.homeTeam.players
                : match.awayTeam.players
              ).map((player) => (
                <PlayerListItem
                  key={player.id}
                  player={player}
                  isStarter={true}
                />
              ))}

              <Text style={styles.playerListHeader}>Suplentes</Text>
              {(teamView === 'home'
                ? match.homeTeam.substitutes
                : match.awayTeam.substitutes
              ).map((player) => (
                <PlayerListItem key={player.id} player={player} />
              ))}
            </View>
          </>
        );
      case 'entrenadores':
        return (
          <View style={styles.coachesContainer}>
            <Text style={styles.coachesHeader}>Entrenadores</Text>
            <View style={styles.coachCardsContainer}>
              <CoachCard
                coach={match.homeTeam.coach}
                teamName={match.homeTeam.name}
              />
              <CoachCard
                coach={match.awayTeam.coach}
                teamName={match.awayTeam.name}
              />
            </View>

            <Text style={styles.coachesHeader}>
              Staff Técnico - {match.homeTeam.name}
            </Text>
            <View style={styles.staffContainer}>
              {match.homeTeam.staffMembers.map((member, index) => (
                <StaffMember key={index} member={member} />
              ))}
            </View>

            <Text style={styles.coachesHeader}>
              Staff Técnico - {match.awayTeam.name}
            </Text>
            <View style={styles.staffContainer}>
              {match.awayTeam.staffMembers.map((member, index) => (
                <StaffMember key={index} member={member} />
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  // Renderiza el contenido basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <View style={styles.tabContent}>
            {/* Key Match Events Timeline */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Eventos Clave</Text>
              <View style={styles.timelineContainer}>
                {match.events && match.events.length > 0 ? (
                  match.events.slice(0, 5).map((event, index) => {
                    const getEventIcon = (type) => {
                      switch (type) {
                        case 'goal':
                          return '⚽';
                        case 'yellow':
                          return '🟨';
                        case 'red':
                          return '🟥';
                        case 'substitution':
                          return '🔄';
                        default:
                          return '•';
                      }
                    };

                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.timelineEvent}
                        activeOpacity={0.7}
                      >
                        <View style={styles.timelineTime}>
                          <Text style={styles.timelineTimeText}>{event.time}'</Text>
                        </View>
                        <View
                          style={[
                            styles.timelineDot,
                            {
                              backgroundColor:
                                event.team === 'home' ? colors.primary : colors.error,
                            },
                          ]}
                        />
                        <View style={styles.timelineContent}>
                          <Text style={styles.timelineIcon}>{getEventIcon(event.type)}</Text>
                          <View style={styles.timelineTextContainer}>
                            <Text style={styles.timelinePlayer}>{event.player}</Text>
                            {event.assist && (
                              <Text style={styles.timelineAssist}>
                                Asistencia: {event.assist}
                              </Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.noDataText}>No hay eventos disponibles</Text>
                )}
              </View>
            </View>

            {/* Match Statistics Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Estadísticas del Partido</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  label="Posesión"
                  value={`${match.stats?.possession?.home || 0}%`}
                  style={styles.statCardItem}
                />
                <StatCard
                  label="Tiros"
                  value={match.stats?.shots?.home || 0}
                  style={styles.statCardItem}
                />
                <StatCard
                  label="A Puerta"
                  value={match.stats?.shotsOnTarget?.home || 0}
                  style={styles.statCardItem}
                />
                <StatCard
                  label="Córners"
                  value={match.stats?.corners?.home || 0}
                  style={styles.statCardItem}
                />
                <StatCard
                  label="Faltas"
                  value={match.stats?.fouls?.home || 0}
                  style={styles.statCardItem}
                />
                <StatCard
                  label="Tarjetas"
                  value={`${(match.stats?.yellowCards?.home || 0) + (match.stats?.redCards?.home || 0)}`}
                  style={styles.statCardItem}
                />
              </View>
            </View>

            {/* Prediction if available */}
            {match.prediction && (
              <View style={styles.summarySection}>
                <Text style={styles.sectionTitle}>Predicción</Text>
                <View style={styles.predictionCard}>
                  <View style={styles.predictionRow}>
                    <Text style={styles.predictionLabel}>Resultado Esperado:</Text>
                    <Text style={styles.predictionValue}>
                      {match.prediction.result || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.predictionRow}>
                    <Text style={styles.predictionLabel}>Confianza:</Text>
                    <Badge variant="success" size="sm">
                      {match.prediction.confidence || 'N/A'}
                    </Badge>
                  </View>
                  {match.prediction.analysis && (
                    <Text style={styles.predictionAnalysis}>
                      {match.prediction.analysis}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        );
      case 'eventos':
        const getEventIcon = (type) => {
          switch (type) {
            case 'goal':
              return '⚽';
            case 'yellow':
              return '🟨';
            case 'red':
              return '🟥';
            case 'substitution':
              return '🔄';
            default:
              return '•';
          }
        };

        const getEventColor = (type, team) => {
          if (type === 'goal') return team === 'home' ? '#00ff87' : '#ff4d4d';
          if (type === 'yellow') return '#ffdd00';
          if (type === 'red') return '#ff0000';
          if (type === 'substitution') return '#64b5f6';
          return '#ffffff';
        };

        // Agrupar eventos por mitad de tiempo
        const firstHalfEvents = match.events.filter((e) => {
          const minutes = parseInt(e.time.split('+')[0], 10);
          return minutes <= 45;
        });

        const secondHalfEvents = match.events.filter((e) => {
          const minutes = parseInt(e.time.split('+')[0], 10);
          return minutes > 45;
        });

        // Renderizar un evento individual con navegación
        const renderEvent = (event, index) => {
          const handlePlayerPress = (playerId) => {
            if (playerId) {
              router.push(`/player/${playerId}`);
            }
          };

          return (
            <View key={index} style={styles.event}>
              <Text style={styles.eventTime}>{event.time}'</Text>
              <View
                style={[
                  styles.eventIndicator,
                  { backgroundColor: getEventColor(event.type, event.team) },
                ]}
              />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  {event.type === 'substitution' ? (
                    <View style={styles.eventPlayer}>
                      <TouchableOpacity
                        onPress={() => handlePlayerPress(event.playerOutId)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.eventPlayerName}>
                          {event.playerOut}
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ color: colors.info }}> ↔ </Text>
                      <TouchableOpacity
                        onPress={() => handlePlayerPress(event.playerInId)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.eventPlayerName, { color: colors.success }]}>
                          {event.playerIn}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handlePlayerPress(event.playerId)}
                      activeOpacity={0.7}
                      style={styles.eventPlayer}
                    >
                      <Text style={styles.eventPlayerName}>{event.player}</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={styles.eventIcon}>
                    {getEventIcon(event.type)}
                  </Text>
                  <View style={styles.eventTeamIndicator}>
                    <View
                      style={[
                        styles.teamDot,
                        {
                          backgroundColor:
                            event.team === 'home' ? colors.primary : colors.error,
                        },
                      ]}
                    />
                    <Text style={styles.eventTeamName}>
                      {event.team === 'home'
                        ? match.homeTeam.name
                        : match.awayTeam.name}
                    </Text>
                  </View>
                </View>

                {event.type === 'goal' && event.assist && (
                  <TouchableOpacity
                    onPress={() => handlePlayerPress(event.assistId)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.eventDetail}>
                      Asistencia: <Text style={styles.eventDetailLink}>{event.assist}</Text>
                    </Text>
                  </TouchableOpacity>
                )}

                {event.type === 'substitution' && event.reason && (
                  <Text style={styles.eventDetail}>Razón: {event.reason}</Text>
                )}

                {event.description && (
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>
                )}
              </View>
            </View>
          );
        };

        return (
          <View style={styles.tabContent}>
            <View style={styles.eventPeriodContainer}>
              <View style={styles.eventPeriodHeader}>
                <View style={styles.eventPeriodDot} />
                <Text style={styles.eventPeriodTitle}>Primera Mitad</Text>
              </View>
              <View style={styles.events}>
                {firstHalfEvents.length > 0 ? (
                  firstHalfEvents.map(renderEvent)
                ) : (
                  <Text style={styles.noEventsText}>
                    No hay eventos en la primera mitad
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.eventPeriodContainer}>
              <View style={styles.eventPeriodHeader}>
                <View style={styles.eventPeriodDot} />
                <Text style={styles.eventPeriodTitle}>Segunda Mitad</Text>
              </View>
              <View style={styles.events}>
                {secondHalfEvents.length > 0 ? (
                  secondHalfEvents.map(renderEvent)
                ) : (
                  <Text style={styles.noEventsText}>
                    No hay eventos en la segunda mitad
                  </Text>
                )}
              </View>
            </View>
          </View>
        );
      case 'estadisticas':
        // Ya estamos usando el state definido al inicio del componente

        // Categorías de estadísticas para la pestañas 'avanzado'
        const statCategories = [
          {
            title: 'Ataque',
            icon: '⚔️',
            stats: [
              { key: 'possession', icon: '⚽' },
              { key: 'shots', icon: '🎯' },
              { key: 'shotsOnTarget', icon: '🥅' },
              { key: 'corners', icon: '🚩' },
              { key: 'offsides', icon: '🚫' },
            ],
          },
          {
            title: 'Pases',
            icon: '🦶',
            stats: [
              { key: 'passes', icon: '🔄' },
              { key: 'passAccuracy', icon: '📊' },
            ],
          },
          {
            title: 'Disciplina',
            icon: '🧠',
            stats: [
              { key: 'fouls', icon: '👊' },
              { key: 'yellowCards', icon: '🟨' },
              { key: 'redCards', icon: '🟥' },
            ],
          },
          {
            title: 'Portería',
            icon: '🧤',
            stats: [{ key: 'saves', icon: '🛡️' }],
          },
        ];

        // Función para renderizar una categoría de estadísticas
        const renderStatCategory = (category) => {
          return (
            <View key={category.title} style={styles.statCategoryContainer}>
              <View style={styles.statCategoryHeader}>
                <Text style={styles.statCategoryIcon}>{category.icon}</Text>
                <Text style={styles.statCategoryTitle}>{category.title}</Text>
              </View>
              <View style={styles.detailedStats}>
                {category.stats.map((stat) => {
                  // Verificación adicional para evitar error si stats[stat.key] es undefined
                  const value = match.stats && match.stats[stat.key];
                  if (!value) return null;

                  // Verificar si el valor existe
                  if (
                    !value ||
                    typeof value !== 'object' ||
                    !('home' in value) ||
                    !('away' in value)
                  ) {
                    return null;
                  }

                  // Calcular la diferencia para destacar mejor equipo
                  const diff = value.home - value.away;
                  const homeBetter = diff > 0;
                  const awayBetter = diff < 0;

                  // Para stats donde número menor es mejor (faltas, tarjetas)
                  const reversedStat = [
                    'fouls',
                    'yellowCards',
                    'redCards',
                    'offsides',
                  ].includes(stat.key);

                  return (
                    <View key={stat.key} style={styles.statRow}>
                      <Text
                        style={[
                          styles.statValue,
                          (!reversedStat && homeBetter) ||
                          (reversedStat && !homeBetter)
                            ? styles.statValueHighlighted
                            : null,
                        ]}
                      >
                        {value.home}
                      </Text>
                      <View style={styles.statLabel}>
                        <Text style={styles.statIcon}>{stat.icon}</Text>
                        <Text style={styles.statLabelText}>
                          {statTranslations[stat.key] || stat.key}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.statValue,
                          (!reversedStat && awayBetter) ||
                          (reversedStat && !awayBetter)
                            ? styles.statValueHighlighted
                            : null,
                        ]}
                      >
                        {value.away}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        };

        // Crea un nuevo conjunto de datos más completo
        const keyStats = [
          {
            title: 'Posesión',
            home: match.stats?.possession?.home || 0,
            away: match.stats?.possession?.away || 0,
            unit: '%',
            icon: '⚽',
          },
          {
            title: 'Tiros',
            home: match.stats?.shots?.home || 0,
            away: match.stats?.shots?.away || 0,
            unit: '',
            icon: '🎯',
          },
          {
            title: 'Tiros a Puerta',
            home: match.stats?.shotsOnTarget?.home || 0,
            away: match.stats?.shotsOnTarget?.away || 0,
            unit: '',
            icon: '🥅',
          },
          {
            title: 'Precisión de Pases',
            home: match.stats?.passAccuracy?.home || 0,
            away: match.stats?.passAccuracy?.away || 0,
            unit: '%',
            icon: '🦶',
          },
          {
            title: 'Córners',
            home: match.stats?.corners?.home || 0,
            away: match.stats?.corners?.away || 0,
            unit: '',
            icon: '🚩',
          },
          {
            title: 'Faltas',
            home: match.stats?.fouls?.home || 0,
            away: match.stats?.fouls?.away || 0,
            unit: '',
            icon: '👊',
          },
        ];

        // Función para renderizar barras de progreso mejoradas
        const renderProgressBar = (stat) => {
          const total = stat.home + stat.away;
          // Asegurar que siempre tengamos al menos un 10% de barra para cada equipo
          const homePercent =
            total === 0
              ? 50
              : Math.max(10, Math.min(90, (stat.home / total) * 100));
          const awayPercent = 100 - homePercent;

          return (
            <View style={styles.progressBarContainer} key={stat.title}>
              <View style={styles.progressBarLabels}>
                <View style={styles.teamStatValue}>
                  <Text
                    style={[
                      styles.progressBarValue,
                      { color: '#00ff87', textAlign: 'center' },
                    ]}
                  >
                    {stat.home}
                    {stat.unit}
                  </Text>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#00ff87',
                      marginLeft: 4,
                    }}
                  />
                </View>
                <Text style={styles.progressBarTitle}>
                  {stat.icon} {stat.title}
                </Text>
                <View style={styles.teamStatValue}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#ff4d4d',
                      marginRight: 4,
                    }}
                  />
                  <Text
                    style={[
                      styles.progressBarValue,
                      { color: '#ff4d4d', textAlign: 'center' },
                    ]}
                  >
                    {stat.away}
                    {stat.unit}
                  </Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressBarHome, { width: `${homePercent}%` }]}
                />
                <View
                  style={[styles.progressBarAway, { width: `${awayPercent}%` }]}
                />
              </View>
            </View>
          );
        };

        // SubTabs para estadísticas
        const StatsSubTab = ({ title, active, onPress }) => (
          <TouchableOpacity
            style={[
              styles.statsSubTabButton,
              active && styles.activeStatsSubTabButton,
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                styles.statsSubTabText,
                active && styles.activeStatsSubTabText,
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        );

        // Renderizar el contenido según el subtab activo
        const renderStatsContent = () => {
          switch (statsSubTab) {
            case 'resumen':
              return (
                <>
                  {/* Estadísticas clave con barras de progreso */}
                  <View style={styles.statsSection}>
                    <View style={styles.statsHeader}>
                      <View style={styles.teamHeaderItem}>
                        <Image
                          source={{ uri: match.homeTeam.logo }}
                          style={styles.statsTeamLogo}
                        />
                        <Text style={styles.statsTeamName}>
                          {match.homeTeam.name}
                        </Text>
                      </View>
                      <View style={{ width: 40 }} />
                      <View style={styles.teamHeaderItem}>
                        <Image
                          source={{ uri: match.awayTeam.logo }}
                          style={styles.statsTeamLogo}
                        />
                        <Text style={styles.statsTeamName}>
                          {match.awayTeam.name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.statsContainer}>
                      {keyStats.map(renderProgressBar)}
                    </View>
                  </View>
                </>
              );

            case 'grafico':
              return (
                <>
                  {/* Gráfico de barras mejorado */}
                  <View style={styles.statsSection}>
                    <View style={styles.statsHeader}>
                      <View style={styles.teamHeaderItem}>
                        <Image
                          source={{ uri: match.homeTeam.logo }}
                          style={styles.statsTeamLogo}
                        />
                        <Text style={styles.statsTeamName}>
                          {match.homeTeam.name}
                        </Text>
                      </View>
                      <View style={{ width: 40 }} />
                      <View style={styles.teamHeaderItem}>
                        <Image
                          source={{ uri: match.awayTeam.logo }}
                          style={styles.statsTeamLogo}
                        />
                        <Text style={styles.statsTeamName}>
                          {match.awayTeam.name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.statsContainer}>
                      <VictoryChart
                        height={350}
                        padding={{ top: 40, bottom: 80, left: 40, right: 40 }}
                        domainPadding={{ x: 30 }}
                      >
                        <VictoryLegend
                          x={125}
                          y={0}
                          orientation="horizontal"
                          gutter={20}
                          data={[
                            {
                              name: match.homeTeam.name,
                              symbol: { fill: colors.primary },
                            },
                            {
                              name: match.awayTeam.name,
                              symbol: { fill: colors.error },
                            },
                          ]}
                          style={{
                            labels: { fill: colors.text.primary, fontSize: 12 },
                          }}
                        />
                        <VictoryGroup offset={20}>
                          <VictoryBar
                            data={statsData}
                            y="home"
                            style={{ data: { fill: colors.primary } }}
                            cornerRadius={{ top: 3 }}
                            barWidth={20}
                          />
                          <VictoryBar
                            data={statsData}
                            y="away"
                            style={{ data: { fill: colors.error } }}
                            cornerRadius={{ top: 3 }}
                            barWidth={20}
                          />
                        </VictoryGroup>
                        <VictoryAxis
                          style={{
                            axis: { stroke: colors.border.medium },
                            tickLabels: {
                              fill: colors.text.tertiary,
                              fontSize: 12,
                              angle: -45,
                              padding: 5,
                            },
                          }}
                        />
                        <VictoryAxis
                          dependentAxis
                          style={{
                            axis: { stroke: '#444' },
                            tickLabels: { fill: '#999', fontSize: 12 },
                            grid: { stroke: '#333', strokeWidth: 0.5 },
                          }}
                        />
                      </VictoryChart>
                    </View>
                  </View>
                </>
              );

            case 'avanzado':
              return (
                <View style={styles.statsDetailsContainer}>
                  {/* Categorías de estadísticas - usar las definidas en este contexto */}
                  {statCategories.map(renderStatCategory)}
                </View>
              );

            default:
              return null;
          }
        };

        return (
          <View style={styles.tabContent}>
            {/* Sub-tabs para estadísticas */}
            <View style={styles.statsSubTabsContainer}>
              <StatsSubTab
                title="Resumen"
                active={statsSubTab === 'resumen'}
                onPress={() => setStatsSubTab('resumen')}
              />
              <StatsSubTab
                title="Gráfico"
                active={statsSubTab === 'grafico'}
                onPress={() => setStatsSubTab('grafico')}
              />
              <StatsSubTab
                title="Avanzado"
                active={statsSubTab === 'avanzado'}
                onPress={() => setStatsSubTab('avanzado')}
              />
            </View>

            {/* Contenido del subtab activo */}
            {renderStatsContent()}
          </View>
        );
      case 'detalles':
        // Verificar si las estadísticas están disponibles
        const hasStats = match.stats && typeof match.stats === 'object';

        // Usamos la misma estructura de categorías que en estadísticas, pero con otro nombre para evitar conflictos
        const detailsCategories = [
          {
            title: 'Ataque',
            icon: '⚔️',
            stats: [
              { key: 'possession', icon: '⚽' },
              { key: 'shots', icon: '🎯' },
              { key: 'shotsOnTarget', icon: '🥅' },
              { key: 'corners', icon: '🚩' },
              { key: 'offsides', icon: '🚫' },
            ],
          },
          {
            title: 'Pases',
            icon: '🦶',
            stats: [
              { key: 'passes', icon: '🔄' },
              { key: 'passAccuracy', icon: '📊' },
            ],
          },
          {
            title: 'Disciplina',
            icon: '🧠',
            stats: [
              { key: 'fouls', icon: '👊' },
              { key: 'yellowCards', icon: '🟨' },
              { key: 'redCards', icon: '🟥' },
            ],
          },
          {
            title: 'Portería',
            icon: '🧤',
            stats: [{ key: 'saves', icon: '🛡️' }],
          },
        ];

        // Añadir algunos datos adicionales de interés
        const matchInfo = [
          { label: 'Fecha', value: '11 de Marzo, 2025' },
          { label: 'Competición', value: match.league },
          { label: 'Estadio', value: 'Santiago Bernabéu' },
          { label: 'Asistencia', value: '78,435 espectadores' },
          { label: 'Árbitro', value: 'Mateu Lahoz' },
        ];

        // Renderizar una categoría de estadísticas (versión para detalles)
        const renderDetailCategory = (category) => (
          <View key={category.title} style={styles.statCategoryContainer}>
            <View style={styles.statCategoryHeader}>
              <Text style={styles.statCategoryIcon}>{category.icon}</Text>
              <Text style={styles.statCategoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.detailedStats}>
              {category.stats.map((stat) => {
                // Verificación adicional para evitar error si stats[stat.key] es undefined
                const value = match.stats && match.stats[stat.key];
                if (!value) return null;

                // Verificar si el valor existe
                if (
                  !value ||
                  typeof value !== 'object' ||
                  !('home' in value) ||
                  !('away' in value)
                ) {
                  return null;
                }

                // Calcular la diferencia para destacar mejor equipo
                const diff = value.home - value.away;
                const homeBetter = diff > 0;
                const awayBetter = diff < 0;

                // Para stats donde número menor es mejor (faltas, tarjetas)
                const reversedStat = [
                  'fouls',
                  'yellowCards',
                  'redCards',
                  'offsides',
                ].includes(stat.key);

                return (
                  <View key={stat.key} style={styles.statRow}>
                    <Text
                      style={[
                        styles.statValue,
                        (!reversedStat && homeBetter) ||
                        (reversedStat && !homeBetter)
                          ? styles.statValueHighlighted
                          : null,
                      ]}
                    >
                      {value.home}
                    </Text>
                    <View style={styles.statLabel}>
                      <Text style={styles.statIcon}>{stat.icon}</Text>
                      <Text style={styles.statLabelText}>
                        {statTranslations[stat.key] || stat.key}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.statValue,
                        (!reversedStat && awayBetter) ||
                        (reversedStat && !awayBetter)
                          ? styles.statValueHighlighted
                          : null,
                      ]}
                    >
                      {value.away}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );

        return (
          <View style={styles.tabContent}>
            {/* Información del partido */}
            <View style={styles.matchInfoContainer}>
              <Text style={styles.matchInfoTitle}>Información del Partido</Text>
              {matchInfo.map((info, index) => (
                <View key={index} style={styles.matchInfoRow}>
                  <Text style={styles.matchInfoLabel}>{info.label}:</Text>
                  <Text style={styles.matchInfoValue}>{info.value}</Text>
                </View>
              ))}
            </View>

            {/* Estadísticas agrupadas por categorías */}
            <View style={styles.matchInfoContainer}>
              <Text style={styles.matchInfoTitle}>Estadísticas Detalladas</Text>
              {detailsCategories.map(renderDetailCategory)}
            </View>
          </View>
        );
      case 'alineaciones':
        return (
          <View style={styles.tabContent}>
            {/* Sub-tabs for alineaciones */}
            <View style={styles.subTabsContainer}>
              <SubTabButton
                title="Campo"
                active={activeSubTab === 'campo'}
                onPress={() => setActiveSubTab('campo')}
              />
              <SubTabButton
                title="Jugadores"
                active={activeSubTab === 'jugadores'}
                onPress={() => setActiveSubTab('jugadores')}
              />
              <SubTabButton
                title="Entrenadores"
                active={activeSubTab === 'entrenadores'}
                onPress={() => setActiveSubTab('entrenadores')}
              />
            </View>

            {/* Content for the active sub-tab */}
            {renderSubTabContent()}
          </View>
        );
      default:
        return null;
    }
  };

  // Helper function to get match status badge variant
  const getMatchStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'en vivo':
        return 'success';
      case 'finished':
      case 'finalizado':
        return 'default';
      case 'upcoming':
      case 'próximo':
        return 'info';
      default:
        return 'default';
    }
  };

  // Format date and time
  const formatMatchDateTime = () => {
    if (!match.date) return '';
    try {
      const date = new Date(match.date);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return match.date;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Enhanced Match Header */}
        <View style={styles.header}>
          {/* Top Row: Status Badge and Favorite Button */}
          <View style={styles.headerTopRow}>
            <Badge
              variant={getMatchStatusVariant(match.status)}
              size="sm"
              rounded
            >
              {match.status || 'Finalizado'}
            </Badge>
            <FavoriteButton
              userId="1"
              entityType="match"
              entityId={match.id}
              size={20}
              activeColor={colors.primary}
              inactiveColor={colors.text.tertiary}
            />
          </View>

          {/* Teams and Score Row */}
          <View style={styles.teamsRow}>
            <View style={styles.team}>
              <TeamLogo
                uri={match.homeTeam.logo}
                size="lg"
                rounded
              />
              <Text style={styles.teamName} numberOfLines={2}>
                {match.homeTeam.name}
              </Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                {match.homeTeam.score} - {match.awayTeam.score}
              </Text>
            </View>

            <View style={styles.team}>
              <TeamLogo
                uri={match.awayTeam.logo}
                size="lg"
                rounded
              />
              <Text style={styles.teamName} numberOfLines={2}>
                {match.awayTeam.name}
              </Text>
            </View>
          </View>

          {/* Match Info Row */}
          <View style={styles.matchInfoRow}>
            <View style={styles.infoItem}>
              <Calendar size={14} color={colors.text.tertiary} />
              <Text style={styles.infoText}>{formatMatchDateTime()}</Text>
            </View>
            {match.venue && (
              <View style={styles.infoItem}>
                <MapPin size={14} color={colors.text.tertiary} />
                <Text style={styles.infoText}>{match.venue}</Text>
              </View>
            )}
          </View>

          {/* League Info */}
          {match.league && (
            <Text style={styles.leagueText}>{match.league}</Text>
          )}
        </View>

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <TabButton
            title="Resumen"
            active={activeTab === 'resumen'}
            onPress={() => setActiveTab('resumen')}
          />
          <TabButton
            title="Estadísticas"
            active={activeTab === 'estadisticas'}
            onPress={() => setActiveTab('estadisticas')}
          />
          <TabButton
            title="Alineaciones"
            active={activeTab === 'alineaciones'}
            onPress={() => setActiveTab('alineaciones')}
          />
          <TabButton
            title="Eventos"
            active={activeTab === 'eventos'}
            onPress={() => setActiveTab('eventos')}
          />
        </View>

        {/* Tab Content */}
        <ScrollView style={styles.contentContainer}>
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MatchDetailScreen;

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
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  teamName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
    maxWidth: '100%',
  },
  scoreContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    minWidth: 100,
    alignItems: 'center',
  },
  scoreText: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    textShadowColor: `${colors.primary}80`,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  matchInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  leagueText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    height: 52,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    backgroundColor: colors.background.elevated,
  },
  tabButtonText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  activeTabButtonText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  // Sub-tabs styling for alineaciones
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 16,
    height: 40,
    padding: 3,
  },
  subTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSubTabButton: {
    backgroundColor: '#3a3a3a',
  },
  subTabButtonText: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  activeSubTabButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  events: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.base,
    width: '100%',
  },
  event: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  eventTime: {
    color: colors.text.tertiary,
    width: 40,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: spacing.md,
    marginTop: 6,
  },
  eventText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
  },
  statsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  detailedStats: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    width: 50,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  statLabel: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statLabelText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  formationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  formationTeam: {
    alignItems: 'center',
  },
  formationLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formationTeamName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 5,
  },
  formationBox: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#00ff87',
  },
  formationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  field: {
    backgroundColor: '#1a4728',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  playerName: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  playerPosition: {
    color: '#ddd',
    fontSize: 8,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#0008',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  playerCircle: {
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  playerNumberText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  noEventsText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 20,
  },
  // Team selector styles
  teamSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  teamSelectorButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamSelectorText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // Player list styles
  playerListContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  playerListHeader: {
    backgroundColor: colors.background.elevated,
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  playerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.md,
  },
  playerNumberBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumberBoxText: {
    color: '#000',
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
  },
  playerListInfo: {
    flex: 1,
  },
  playerListName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },
  playerListPosition: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  // Coaches styles
  coachesContainer: {
    width: '100%',
  },
  coachesHeader: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
    marginTop: 20,
  },
  coachCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  coachCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  coachImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#00ff87',
  },
  coachInfo: {
    alignItems: 'center',
  },
  coachName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  coachTeam: {
    color: '#00ff87',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  coachDetails: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  // Staff styles
  staffContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  staffMember: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 16,
  },
  staffImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  staffName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  staffRole: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  // Formación táctica visualización
  formationVisualizer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  formationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  formationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },

  // Eventos mejorados
  eventPeriodContainer: {
    marginBottom: spacing.lg,
  },
  eventPeriodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eventPeriodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  eventPeriodTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  eventPlayer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  eventPlayerName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },
  eventIcon: {
    fontSize: 16,
    marginHorizontal: spacing.xs,
  },
  eventTeamIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  eventTeamName: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  eventDetail: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  eventDetailLink: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  eventDescription: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
    fontStyle: 'italic',
    fontFamily: typography.fontFamily.regular,
  },

  // Estadísticas mejoradas
  statsSection: {
    marginBottom: 24,
  },
  statsSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBarTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  progressBarValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    width: 60,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressBarHome: {
    backgroundColor: '#00ff87',
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  progressBarAway: {
    backgroundColor: '#ff4d4d',
    height: '100%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },

  // Nuevos estilos para el submenú de estadísticas
  statsSubTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 16,
    height: 40,
    padding: 3,
  },
  statsSubTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeStatsSubTabButton: {
    backgroundColor: '#3a3a3a',
  },
  statsSubTabText: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  activeStatsSubTabText: {
    color: '#00ff87',
    fontFamily: 'Inter_600SemiBold',
  },
  teamStatValue: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'center',
  },
  statsTeamLogo: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  statsTeamName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  teamHeaderItem: {
    alignItems: 'center',
  },
  statsDetailsContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.base,
    width: '100%',
  },

  // Detalles del partido
  matchInfoContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  matchInfoTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  matchInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  matchInfoLabel: {
    color: '#888',
    fontSize: 14,
    width: 100,
    fontFamily: 'Inter_400Regular',
  },
  matchInfoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
  },
  statCategoryContainer: {
    marginBottom: 16,
  },
  statCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCategoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  statCategoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statValueHighlighted: {
    color: '#00ff87',
    fontWeight: 'bold',
  },

  // Summary Tab Styles
  summarySection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.base,
  },
  timelineContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.base,
  },
  timelineEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  timelineTime: {
    width: 50,
    alignItems: 'center',
  },
  timelineTimeText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: spacing.md,
  },
  timelineContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  timelineTextContainer: {
    flex: 1,
  },
  timelinePlayer: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },
  timelineAssist: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCardItem: {
    flex: 1,
    minWidth: '45%',
  },
  predictionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  predictionLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  predictionValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
  predictionAnalysis: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.sm,
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  noDataText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
