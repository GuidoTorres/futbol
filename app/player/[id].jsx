import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Flag, TrendingUp, Award, Calendar, Users } from 'lucide-react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryBar, VictoryTheme } from 'victory-native';
import { getSofaScorePlayerById } from '../../services/players';
import { searchPlayersForComparison, comparePlayers } from '../../services/comparison';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import PlayerAvatar from '../../components/PlayerAvatar';
import TeamLogo from '../../components/TeamLogo';
import StatCard from '../../components/StatCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import FavoriteButton from '../../components/FavoriteButton';

const screenWidth = Dimensions.get('window').width;

const PlayerDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('statistics'); // 'statistics', 'history', 'compare'
  const [showCompleteInfo, setShowCompleteInfo] = useState(false);
  
  // Compare tab state
  const [comparePlayer, setComparePlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Mock user ID for favorites (replace with actual user ID from auth)
  const userId = 1;

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const data = await getSofaScorePlayerById(id, showCompleteInfo);
        setPlayer(data.player || data);
      } catch (err) {
        console.error(`Error cargando jugador ${id}:`, err);
        setError('No se pudo cargar la información del jugador');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id, showCompleteInfo]);

  // Load comparison when compare player is selected
  useEffect(() => {
    if (comparePlayer && player) {
      loadComparison();
    } else {
      setComparisonData(null);
    }
  }, [comparePlayer, player]);

  const loadComparison = async () => {
    try {
      setComparisonLoading(true);
      const response = await comparePlayers([player.id, comparePlayer.id]);
      setComparisonData(response.data);
    } catch (err) {
      console.error('Error loading comparison:', err);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchPlayersForComparison(query);
      setSearchResults(response.data || response || []);
    } catch (err) {
      console.error('Error searching:', err);
      setSearchResults([]);
    }
  };

  const selectComparePlayer = (selectedPlayer) => {
    setComparePlayer(selectedPlayer);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const clearComparePlayer = () => {
    setComparePlayer(null);
    setSearchQuery('');
    setSearchResults([]);
    setComparisonData(null);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    const fetchPlayer = async () => {
      try {
        const data = await getSofaScorePlayerById(id, showCompleteInfo);
        setPlayer(data.player || data);
      } catch (err) {
        console.error(`Error cargando jugador ${id}:`, err);
        setError('No se pudo cargar la información del jugador');
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  };

  // Renderizar pantalla de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'Detalle del Jugador',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary
        }} />
        <LoadingState message="Cargando información del jugador..." />
      </View>
    );
  }

  // Renderizar pantalla de error
  if (error || !player) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'Detalle del Jugador',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary
        }} />
        <ErrorState
          title="Error al cargar"
          message={error || 'No se encontró información del jugador'}
          onRetry={handleRetry}
        />
      </View>
    );
  }

  // Formatear fecha de nacimiento si está disponible
  const birthDate = player.birthDate ? new Date(player.birthDate) : null;
  const formattedBirthDate = birthDate ? birthDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'No disponible';

  // Preparar datos para el gráfico si están disponibles
  const careerData = player.transfers ? player.transfers.map(t => ({
    season: new Date(t.date).getFullYear().toString(),
    team: t.toTeam?.name || 'Desconocido',
    value: 1 // Solo para visualización
  })) : [];

  const renderHeader = () => (
    <View style={styles.header}>
      <PlayerAvatar 
        uri={player.photo} 
        name={player.name}
        size="xl"
        border
        style={styles.playerAvatar}
      />
      
      <View style={styles.headerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        
        <View style={styles.playerMeta}>
          {player.shirtNumber && (
            <Text style={styles.playerNumber}>#{player.shirtNumber}</Text>
          )}
          <Text style={styles.playerPosition}>
            {player.position || player.positionCategory || 'Jugador'}
          </Text>
        </View>

        {player.TeamId && player.Team && (
          <TouchableOpacity 
            style={styles.teamContainer}
            onPress={() => router.push(`/team/${player.TeamId}`)}
            activeOpacity={0.7}
          >
            <TeamLogo 
              uri={player.Team.logo} 
              size="sm" 
              rounded
            />
            <Text style={styles.teamName}>{player.Team.name}</Text>
          </TouchableOpacity>
        )}

        {player.nationality && (
          <View style={styles.nationalityContainer}>
            <Flag size={16} color={colors.text.secondary} />
            <Text style={styles.nationalityText}>{player.nationality}</Text>
          </View>
        )}
      </View>

      <View style={styles.favoriteButton}>
        <FavoriteButton
          userId={userId}
          entityType="player"
          entityId={id}
          size={28}
          activeColor={colors.primary}
          inactiveColor={colors.text.tertiary}
        />
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <Button
        variant={activeTab === 'statistics' ? 'primary' : 'ghost'}
        size="sm"
        onPress={() => setActiveTab('statistics')}
        style={styles.tabButton}
      >
        Estadísticas
      </Button>
      <Button
        variant={activeTab === 'history' ? 'primary' : 'ghost'}
        size="sm"
        onPress={() => setActiveTab('history')}
        style={styles.tabButton}
      >
        Historial
      </Button>
      <Button
        variant={activeTab === 'compare' ? 'primary' : 'ghost'}
        size="sm"
        onPress={() => setActiveTab('compare')}
        style={styles.tabButton}
      >
        Comparar
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: player.name || 'Detalle del Jugador',
        headerStyle: { backgroundColor: colors.background.primary },
        headerTintColor: colors.text.primary
      }} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderTabs()}

        {activeTab === 'statistics' && renderStatisticsTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'compare' && renderCompareTab()}

        {!showCompleteInfo && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={() => setShowCompleteInfo(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.loadMoreButtonText}>Cargar información completa</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );

  function renderStatisticsTab() {
    return (
      <View style={styles.tabContent}>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoGrid}>
            <InfoItem title="Nombre completo" value={player.fullName || player.name} />
            <InfoItem title="Nacionalidad" value={player.nationality || 'No disponible'} />
            <InfoItem title="Fecha de nacimiento" value={formattedBirthDate} />
            <InfoItem title="Edad" value={player.age ? `${player.age} años` : 'No disponible'} />
            <InfoItem title="Altura" value={player.height ? `${player.height} cm` : 'No disponible'} />
            <InfoItem title="Peso" value={player.weight ? `${player.weight} kg` : 'No disponible'} />
            <InfoItem title="Pie dominante" value={player.foot || 'No disponible'} />
          </View>
        </View>

        {/* Season Statistics */}
        {player.statistics && Object.keys(player.statistics).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estadísticas de Temporada</Text>
            <View style={styles.statsGrid}>
              {Object.entries(player.statistics).slice(0, 6).map(([key, value], index) => (
                <StatCard 
                  key={index} 
                  label={key} 
                  value={value}
                  style={styles.statCard}
                />
              ))}
            </View>
          </View>
        )}

        {/* Performance Chart */}
        {player.statistics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rendimiento</Text>
            <View style={styles.chartContainer}>
              <VictoryChart 
                width={screenWidth - 64}
                height={200}
                theme={VictoryTheme.material}
              >
                <VictoryAxis
                  style={{
                    axis: { stroke: colors.border.light },
                    tickLabels: {
                      fill: colors.text.secondary,
                      fontSize: 10,
                      fontFamily: typography.fontFamily.regular,
                    },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: colors.border.light },
                    tickLabels: {
                      fill: colors.text.secondary,
                      fontSize: 10,
                      fontFamily: typography.fontFamily.regular,
                    },
                    grid: { stroke: colors.border.light, strokeDasharray: '4,4' },
                  }}
                />
                <VictoryBar
                  data={Object.entries(player.statistics).slice(0, 5).map(([key, value]) => ({
                    x: key.substring(0, 4),
                    y: parseFloat(value) || 0,
                  }))}
                  style={{
                    data: { fill: colors.primary },
                  }}
                  barWidth={20}
                />
              </VictoryChart>
            </View>
          </View>
        )}
      </View>
    );
  }

  function renderHistoryTab() {
    return (
      <View style={styles.tabContent}>
        {/* Career History */}
        {careerData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trayectoria</Text>
            <View style={styles.chartContainer}>
              <VictoryChart 
                width={screenWidth - 64}
                height={200}
                theme={VictoryTheme.material}
              >
                <VictoryLine
                  data={careerData}
                  x="season"
                  y="value"
                  style={{
                    data: { stroke: colors.primary, strokeWidth: 2 },
                  }}
                />
                <VictoryAxis
                  style={{
                    axis: { stroke: colors.border.light },
                    tickLabels: {
                      fill: colors.text.secondary,
                      fontSize: 10,
                      fontFamily: typography.fontFamily.regular,
                    },
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        )}

        {/* Transfer History */}
        {player.transfers && player.transfers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historial de Transferencias</Text>
            {player.transfers.map((transfer, index) => (
              <TransferItem 
                key={index} 
                transfer={transfer}
                onPress={() => {
                  if (transfer.toTeam?.id) {
                    router.push(`/team/${transfer.toTeam.id}`);
                  }
                }}
              />
            ))}
          </View>
        )}

        {/* Achievements */}
        {player.achievements && player.achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Logros y Premios</Text>
            {player.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Award size={20} color={colors.primary} />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>
        )}

        {(!player.transfers || player.transfers.length === 0) && 
         (!player.achievements || player.achievements.length === 0) && (
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyStateText}>
              No hay información de historial disponible
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderCompareTab() {
    return (
      <View style={styles.tabContent}>
        {!comparePlayer ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecciona un jugador para comparar</Text>
            
            {!showSearch ? (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowSearch(true)}
                activeOpacity={0.7}
              >
                <Users size={32} color={colors.text.tertiary} />
                <Text style={styles.selectButtonText}>
                  Buscar jugador
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.searchContainer}>
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  clearable
                  autoFocus
                />

                {searchResults.length > 0 && (
                  <ScrollView
                    style={styles.searchResults}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {searchResults.slice(0, 5).map((result) => (
                      <TouchableOpacity
                        key={result.id}
                        style={styles.searchResultItem}
                        onPress={() => selectComparePlayer(result)}
                        activeOpacity={0.7}
                      >
                        <PlayerAvatar uri={result.photo} name={result.name} size="sm" />
                        <View style={styles.searchResultInfo}>
                          <Text style={styles.searchResultName}>{result.name}</Text>
                          <Text style={styles.searchResultDetails}>
                            {result.position} • {result.team}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Comparison Header */}
            <View style={styles.comparisonHeader}>
              <View style={styles.comparisonEntity}>
                <PlayerAvatar uri={player.photo} name={player.name} size="lg" border />
                <Text style={styles.comparisonEntityName}>{player.name}</Text>
              </View>

              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
              </View>

              <View style={styles.comparisonEntity}>
                <PlayerAvatar uri={comparePlayer.photo} name={comparePlayer.name} size="lg" border />
                <Text style={styles.comparisonEntityName}>{comparePlayer.name}</Text>
              </View>
            </View>

            <Button
              variant="outline"
              size="sm"
              onPress={clearComparePlayer}
              style={styles.changeButton}
            >
              Cambiar jugador
            </Button>

            {comparisonLoading ? (
              <LoadingState message="Cargando comparación..." />
            ) : comparisonData ? (
              <>
                {/* Statistics Comparison */}
                {comparisonData.statistics && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Estadísticas</Text>
                    {renderStatisticsComparison()}
                  </View>
                )}

                {/* Comparison Chart */}
                {comparisonData.statistics && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Comparación Visual</Text>
                    {renderComparisonChart()}
                  </View>
                )}

                {/* Strengths */}
                {comparisonData.insights?.strengths && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fortalezas</Text>
                    {renderStrengths()}
                  </View>
                )}
              </>
            ) : null}
          </>
        )}
      </View>
    );
  }

  function renderStatisticsComparison() {
    if (!comparisonData?.statistics) return null;

    const stats1 = comparisonData.statistics[0]?.comparisonMetrics || {};
    const stats2 = comparisonData.statistics[1]?.comparisonMetrics || {};

    const statKeys = [
      { key: 'goals', label: 'Goles' },
      { key: 'assists', label: 'Asistencias' },
      { key: 'passAccuracy', label: 'Precisión Pases', isPercentage: true },
      { key: 'tackles', label: 'Entradas' },
    ];

    return (
      <View style={styles.statsComparison}>
        {statKeys.map(({ key, label, isPercentage }) => {
          const value1 = stats1[key] || 0;
          const value2 = stats2[key] || 0;
          const better1 = value1 > value2;
          const better2 = value2 > value1;

          return (
            <View key={key} style={styles.statRow}>
              <View style={[styles.statValue, better1 && styles.statValueBetter]}>
                <Text style={[styles.statNumber, better1 && styles.statNumberBetter]}>
                  {isPercentage ? `${value1.toFixed(1)}%` : value1.toFixed(1)}
                </Text>
              </View>

              <Text style={styles.statLabel}>{label}</Text>

              <View style={[styles.statValue, better2 && styles.statValueBetter]}>
                <Text style={[styles.statNumber, better2 && styles.statNumberBetter]}>
                  {isPercentage ? `${value2.toFixed(1)}%` : value2.toFixed(1)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function renderComparisonChart() {
    if (!comparisonData?.statistics) return null;

    const stats1 = comparisonData.statistics[0]?.comparisonMetrics || {};
    const stats2 = comparisonData.statistics[1]?.comparisonMetrics || {};

    const chartData = [
      { category: 'Goles', player1: stats1.goals || 0, player2: stats2.goals || 0 },
      { category: 'Asist.', player1: stats1.assists || 0, player2: stats2.assists || 0 },
      { category: 'Tiros', player1: stats1.shots || 0, player2: stats2.shots || 0 },
    ];

    return (
      <View style={styles.chartContainer}>
        <VictoryChart
          width={screenWidth - 64}
          height={200}
          domainPadding={{ x: 30 }}
          theme={VictoryTheme.material}
        >
          <VictoryAxis
            style={{
              axis: { stroke: colors.border.light },
              tickLabels: {
                fill: colors.text.secondary,
                fontSize: 10,
                fontFamily: typography.fontFamily.regular,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.border.light },
              tickLabels: {
                fill: colors.text.secondary,
                fontSize: 10,
                fontFamily: typography.fontFamily.regular,
              },
              grid: { stroke: colors.border.light, strokeDasharray: '4,4' },
            }}
          />
          <VictoryBar
            data={chartData}
            x="category"
            y="player1"
            style={{ data: { fill: colors.primary } }}
            barWidth={15}
          />
          <VictoryBar
            data={chartData}
            x="category"
            y="player2"
            style={{ data: { fill: colors.info } }}
            barWidth={15}
          />
        </VictoryChart>

        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>{player.name}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.info }]} />
            <Text style={styles.legendText}>{comparePlayer.name}</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderStrengths() {
    if (!comparisonData?.insights?.strengths) return null;

    const strengths = comparisonData.insights.strengths;
    const player1Strengths = Object.values(strengths).find(s => s.playerId === parseInt(player.id));
    const player2Strengths = Object.values(strengths).find(s => s.playerId === comparePlayer.id);

    return (
      <View style={styles.strengthsGrid}>
        <View style={styles.strengthsColumn}>
          <Text style={styles.strengthsColumnTitle}>{player.name}</Text>
          {player1Strengths?.strengths?.slice(0, 3).map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <TrendingUp size={16} color={colors.success} />
              <Text style={styles.strengthText}>{strength.metric}</Text>
              <Text style={styles.strengthValue}>{strength.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.strengthsColumn}>
          <Text style={styles.strengthsColumnTitle}>{comparePlayer.name}</Text>
          {player2Strengths?.strengths?.slice(0, 3).map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <TrendingUp size={16} color={colors.success} />
              <Text style={styles.strengthText}>{strength.metric}</Text>
              <Text style={styles.strengthValue}>{strength.value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
};

const InfoItem = ({ title, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const TransferItem = ({ transfer, onPress }) => {
  const formattedDate = transfer.date ? 
    new Date(transfer.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) :
    'Fecha desconocida';
    
  return (
    <TouchableOpacity 
      style={styles.transferItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <Text style={styles.transferDate}>{formattedDate}</Text>
      <View style={styles.transferTeams}>
        <Text style={styles.transferTeam}>{transfer.fromTeam?.name || 'Desconocido'}</Text>
        <Text style={styles.transferArrow}>→</Text>
        <Text style={styles.transferTeam}>{transfer.toTeam?.name || 'Desconocido'}</Text>
      </View>
      <Text style={styles.transferFee}>{transfer.fee || 'Tarifa no divulgada'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
    position: 'relative',
  },
  playerAvatar: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  headerInfo: {
    alignItems: 'center',
  },
  playerName: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  playerNumber: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  playerPosition: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  teamName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
  nationalityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  nationalityText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  tabButton: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },
  section: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  infoGrid: {
    gap: spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  chartContainer: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    alignItems: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  transferItem: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  transferDate: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  transferTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  transferTeam: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
  transferArrow: {
    fontSize: typography.fontSize.lg,
    color: colors.primary,
    marginHorizontal: spacing.sm,
  },
  transferFee: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  achievementText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.tertiary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  selectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    minHeight: 120,
  },
  selectButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: spacing.md,
  },
  searchResults: {
    maxHeight: 250,
    marginTop: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.base,
    marginBottom: spacing.xs,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  searchResultName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
  searchResultDetails: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  comparisonEntity: {
    flex: 1,
    alignItems: 'center',
  },
  comparisonEntityName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  vsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    ...shadows.md,
  },
  vsText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: '#000',
  },
  changeButton: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  statsComparison: {
    gap: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  statValue: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.tertiary,
  },
  statValueBetter: {
    backgroundColor: colors.primary,
  },
  statNumber: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  statNumberBetter: {
    color: '#000',
  },
  statLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  strengthsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  strengthsColumn: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  strengthsColumnTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  strengthText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  strengthValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
  loadMoreButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.xl,
    ...shadows.base,
  },
  loadMoreButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: '#000',
  },
});

export default PlayerDetailScreen;