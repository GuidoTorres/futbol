import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';
import TeamLogo from '../../components/TeamLogo';
import PlayerAvatar from '../../components/PlayerAvatar';
import MatchCard from '../../components/MatchCard';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import FavoriteButton from '../../components/FavoriteButton';
import { getLeagueById, getLeagueStandings } from '../../services/leagues';
import { getMatchesByLeague } from '../../services/matches';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const LEAGUE_DATA = {
  id: '1',
  name: 'La Liga',
  country: 'España',
  logo: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=128&h=128&fit=crop',
  season: '2023/24',
  standings: [
    { position: 1, team: 'Real Madrid', played: 31, won: 23, drawn: 5, lost: 3, gf: 75, ga: 24, gd: 51, points: 74, form: ['V', 'V', 'E', 'V', 'D'], logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop', id: '1' },
    { position: 2, team: 'Barcelona', played: 31, won: 22, drawn: 7, lost: 2, gf: 72, ga: 29, gd: 43, points: 73, form: ['V', 'V', 'V', 'E', 'V'], logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop', id: '2' },
    { position: 3, team: 'Girona', played: 31, won: 21, drawn: 8, lost: 2, gf: 70, ga: 28, gd: 42, points: 71, form: ['D', 'E', 'V', 'V', 'V'], logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&h=64&fit=crop', id: '3' },
  ],
  stats: {
    totalGoals: 845,
    avgGoalsPerMatch: 2.8,
    cleanSheets: 89,
    penalties: 42,
    cards: { yellow: 984, red: 28 },
  },
  topScorers: [
    { position: 1, player: 'Bellingham', team: 'Real Madrid', goals: 28, assists: 5, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop', id: '1' },
    { position: 2, player: 'Lewandowski', team: 'Barcelona', goals: 24, assists: 8, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop', id: '2' },
    { position: 3, player: 'Dovbyk', team: 'Girona', goals: 21, assists: 3, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop', id: '3' },
  ],
  form: [
    { matchday: 1, avgGoals: 2.4 },
    { matchday: 2, avgGoals: 2.8 },
    { matchday: 3, avgGoals: 2.6 },
    { matchday: 4, avgGoals: 3.1 },
    { matchday: 5, avgGoals: 2.9 },
  ],
  matches: [
    {
      id: '1',
      homeTeam: { name: 'Real Madrid', logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop' },
      awayTeam: { name: 'Barcelona', logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop' },
      homeScore: 2,
      awayScore: 1,
      status: 'finished',
      date: new Date('2024-03-15'),
      matchday: 28
    },
    {
      id: '2',
      homeTeam: { name: 'Girona', logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&h=64&fit=crop' },
      awayTeam: { name: 'Real Madrid', logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop' },
      status: 'scheduled',
      date: new Date('2024-03-22'),
      time: '20:00',
      matchday: 29
    },
  ],
  info: {
    founded: 1929,
    teams: 20,
    format: 'Liga de 20 equipos con sistema de todos contra todos a doble vuelta',
    currentChampion: 'Real Madrid',
  }
};

const { width: screenWidth } = Dimensions.get('window');

export default function LeagueDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [league, setLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tabla');
  const [selectedMatchday, setSelectedMatchday] = useState(null);

  useEffect(() => {
    loadLeagueData();
  }, [id]);

  const loadLeagueData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch real data, fallback to mock data
      try {
        const [leagueData, standingsData, matchesData] = await Promise.all([
          getLeagueById(id),
          getLeagueStandings(id),
          getMatchesByLeague(id),
        ]);
        
        setLeague(leagueData);
        setStandings(standingsData || []);
        setMatches(matchesData || []);
      } catch (apiError) {
        console.log('Using fallback data:', apiError);
        // Use fallback data
        setLeague(LEAGUE_DATA);
        setStandings(LEAGUE_DATA.standings);
        setMatches(LEAGUE_DATA.matches);
      }
    } catch (err) {
      console.error('Error loading league data:', err);
      setError(err.message || 'Error al cargar los datos de la liga');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLeagueData();
    setRefreshing(false);
  };

  const handleRetry = () => {
    loadLeagueData();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState message="Cargando información de la liga..." />
      </SafeAreaView>
    );
  }

  if (error && !league) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState
          title="Error al cargar"
          message={error}
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  if (!league) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState
          title="Liga no encontrada"
          message="No se pudo encontrar la información de esta liga"
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  // Get unique matchdays from matches
  const matchdays = [...new Set(matches.map(m => m.matchday).filter(Boolean))].sort((a, b) => b - a);
  const currentMatchday = selectedMatchday || (matchdays.length > 0 ? matchdays[0] : null);
  
  // Filter matches by selected matchday
  const filteredMatches = currentMatchday 
    ? matches.filter(m => m.matchday === currentMatchday)
    : matches;

  const renderFormBadge = (result) => {
    const backgroundColor = result === 'V' ? colors.success : result === 'E' ? colors.warning : colors.error;
    return (
      <View style={[styles.formBadge, { backgroundColor }]}>
        <Text style={styles.formText}>{result}</Text>
      </View>
    );
  };

  const handleTeamPress = (teamId) => {
    if (teamId) {
      router.push(`/team/${teamId}`);
    }
  };

  const handlePlayerPress = (playerId) => {
    if (playerId) {
      router.push(`/player/${playerId}`);
    }
  };

  // Renderiza el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'tabla':
        return (
          <View style={styles.tabContent}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.positionCell]}>#</Text>
              <Text style={[styles.tableCell, styles.teamCellHeader]}>Equipo</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>PJ</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>G</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>E</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>P</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>Pts</Text>
            </View>
            {standings.map((team) => (
              <TouchableOpacity
                key={team.position}
                style={styles.tableRow}
                onPress={() => handleTeamPress(team.id || team.teamId)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tableCell, styles.positionCell]}>{team.position}</Text>
                <View style={styles.teamCellContent}>
                  <TeamLogo uri={team.logo || team.logoUrl} size="sm" rounded />
                  <Text style={styles.teamNameText} numberOfLines={1}>
                    {team.team || team.name}
                  </Text>
                </View>
                <Text style={[styles.tableCell, styles.statsCell]}>{team.played}</Text>
                <Text style={[styles.tableCell, styles.statsCell]}>{team.won}</Text>
                <Text style={[styles.tableCell, styles.statsCell]}>{team.drawn}</Text>
                <Text style={[styles.tableCell, styles.statsCell]}>{team.lost}</Text>
                <Text style={[styles.tableCell, styles.pointsCell]}>{team.points}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 'goleadores':
        return (
          <View style={styles.tabContent}>
            {league.topScorers && league.topScorers.length > 0 ? (
              league.topScorers.map((scorer) => (
                <TouchableOpacity
                  key={scorer.position}
                  style={styles.scorerRow}
                  onPress={() => handlePlayerPress(scorer.id || scorer.playerId)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.position}>#{scorer.position}</Text>
                  <PlayerAvatar uri={scorer.image || scorer.photo} size="md" name={scorer.player || scorer.name} />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{scorer.player || scorer.name}</Text>
                    <Text style={styles.teamName}>{scorer.team || scorer.teamName}</Text>
                  </View>
                  <View style={styles.statsColumn}>
                    <Text style={styles.goals}>{scorer.goals}</Text>
                    <Text style={styles.assists}>{scorer.assists || 0} A</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay datos de goleadores disponibles</Text>
              </View>
            )}
          </View>
        );
      
      case 'calendario':
        return (
          <View style={styles.tabContent}>
            {/* Matchday Selector */}
            {matchdays.length > 0 && (
              <View style={styles.matchdaySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {matchdays.map((matchday) => (
                    <Button
                      key={matchday}
                      variant={currentMatchday === matchday ? 'primary' : 'ghost'}
                      size="sm"
                      onPress={() => setSelectedMatchday(matchday)}
                      style={styles.matchdayButton}
                    >
                      Jornada {matchday}
                    </Button>
                  ))}
                </ScrollView>
              </View>
            )}
            
            {/* Matches List */}
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  style={styles.matchCard}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay partidos disponibles</Text>
              </View>
            )}
          </View>
        );
      
      case 'info':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Información de la Liga</Text>
              
              {league.info?.founded && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fundada:</Text>
                  <Text style={styles.infoValue}>{league.info.founded}</Text>
                </View>
              )}
              
              {league.info?.teams && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Equipos:</Text>
                  <Text style={styles.infoValue}>{league.info.teams}</Text>
                </View>
              )}
              
              {league.info?.currentChampion && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Campeón Actual:</Text>
                  <Text style={styles.infoValue}>{league.info.currentChampion}</Text>
                </View>
              )}
              
              {league.info?.format && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Formato:</Text>
                  <Text style={styles.infoValue}>{league.info.format}</Text>
                </View>
              )}
            </View>
            
            {/* Participating Teams */}
            {standings.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Equipos Participantes</Text>
                <View style={styles.teamsGrid}>
                  {standings.map((team) => (
                    <TouchableOpacity
                      key={team.position}
                      style={styles.teamItem}
                      onPress={() => handleTeamPress(team.id || team.teamId)}
                      activeOpacity={0.7}
                    >
                      <TeamLogo uri={team.logo || team.logoUrl} size="md" rounded />
                      <Text style={styles.teamItemName} numberOfLines={2}>
                        {team.team || team.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* League Header */}
        <View style={styles.header}>
          <TeamLogo uri={league.logo || league.logoUrl} size="xl" rounded />
          <View style={styles.headerInfo}>
            <Text style={styles.leagueName}>{league.name}</Text>
            <Text style={styles.countryText}>{league.country}</Text>
            <Text style={styles.seasonText}>Temporada {league.season}</Text>
          </View>
          <FavoriteButton
            userId="1"
            entityType="league"
            entityId={league.id}
            size={28}
            style={styles.favoriteButton}
          />
        </View>

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <Button
            variant={activeTab === 'tabla' ? 'primary' : 'ghost'}
            size="sm"
            onPress={() => setActiveTab('tabla')}
            style={styles.tabButton}
            textStyle={styles.tabButtonText}
          >
            Tabla
          </Button>
          <Button
            variant={activeTab === 'goleadores' ? 'primary' : 'ghost'}
            size="sm"
            onPress={() => setActiveTab('goleadores')}
            style={styles.tabButton}
            textStyle={styles.tabButtonText}
          >
            Goleadores
          </Button>
          <Button
            variant={activeTab === 'calendario' ? 'primary' : 'ghost'}
            size="sm"
            onPress={() => setActiveTab('calendario')}
            style={styles.tabButton}
            textStyle={styles.tabButtonText}
          >
            Calendario
          </Button>
          <Button
            variant={activeTab === 'info' ? 'primary' : 'ghost'}
            size="sm"
            onPress={() => setActiveTab('info')}
            style={styles.tabButton}
            textStyle={styles.tabButtonText}
          >
            Info
          </Button>
        </View>

        {/* Tab Content */}
        <ScrollView 
          style={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {renderContent()}
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.base,
  },
  leagueName: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
  },
  countryText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    marginTop: spacing.xs,
  },
  seasonText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
  },
  favoriteButton: {
    marginLeft: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  tabButtonText: {
    fontSize: typography.fontSize.xs,
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  
  // Standings Table
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: colors.border.medium,
    marginBottom: spacing.xs,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.base,
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  tableCell: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  positionCell: {
    width: 30,
    fontFamily: typography.fontFamily.semiBold,
  },
  teamCellHeader: {
    flex: 1,
    textAlign: 'left',
    fontFamily: typography.fontFamily.semiBold,
  },
  teamCellContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamNameText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  statsCell: {
    width: 35,
    color: colors.text.secondary,
  },
  pointsCell: {
    width: 35,
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
  },
  
  // Top Scorers
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  position: {
    color: colors.text.tertiary,
    width: 35,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  playerName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
  },
  teamName: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
  },
  statsColumn: {
    alignItems: 'flex-end',
  },
  goals: {
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
  },
  assists: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
  },
  
  // Calendar
  matchdaySelector: {
    marginBottom: spacing.base,
  },
  matchdayButton: {
    marginRight: spacing.sm,
  },
  matchCard: {
    marginBottom: spacing.md,
  },
  
  // Info Tab
  infoSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  infoTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
  },
  infoValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
    textAlign: 'right',
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  teamItemName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  
  // Empty State
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  
  // Form badges
  formContainer: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  formBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  formText: {
    color: '#000',
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semiBold,
  },
});