import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getTeamDetails, getTeamPlayers, getTeamStats } from '../../services/teams';
import { getMatchesByTeam } from '../../services/matches';
import FavoriteButton from '../../components/FavoriteButton';
import TeamLogo from '../../components/TeamLogo';
import PlayerAvatar from '../../components/PlayerAvatar';
import MatchCard from '../../components/MatchCard';
import StatCard from '../../components/StatCard';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import { Trophy, Users, TrendingUp, Target, Calendar, MapPin, User as UserIcon } from 'lucide-react-native';

// Mock user ID - En una app real, esto vendría del contexto de autenticación
const MOCK_USER_ID = 1;

const TeamDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('squad'); // squad, stats, matches, info

  const fetchTeamData = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    setError(null);
    
    try {
      // Cargar datos en paralelo
      const [teamResponse, playersResponse, matchesResponse, statsResponse] = await Promise.all([
        getTeamDetails(id),
        getTeamPlayers(id),
        getMatchesByTeam(id),
        getTeamStats(id)
      ]);
      
      setTeam(teamResponse.team || teamResponse);
      setPlayers(playersResponse.players || playersResponse || []);
      setMatches(matchesResponse.matches || matchesResponse || []);
      setStats(statsResponse.stats || statsResponse || null);
    } catch (err) {
      console.error(`Error cargando equipo ${id}:`, err);
      setError('No se pudo cargar la información del equipo');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeamData(true);
  };

  const handleRetry = () => {
    fetchTeamData();
  };

  // Renderizar pantalla de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'Equipo',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary
        }} />
        <LoadingState message="Cargando información del equipo..." />
      </View>
    );
  }

  // Renderizar pantalla de error
  if (error || !team) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'Equipo',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary
        }} />
        <ErrorState
          title="Error al cargar"
          message={error || 'No se encontró información del equipo'}
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        title: team.name || 'Detalle del Equipo',
        headerStyle: { backgroundColor: colors.background.primary },
        headerTintColor: colors.text.primary
      }} />
      
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton
              userId={MOCK_USER_ID}
              entityType="team"
              entityId={id}
              size={28}
              activeColor={colors.error}
              inactiveColor={colors.text.tertiary}
            />
          </View>
          
          <TeamLogo 
            uri={team.logo || team.logoUrl} 
            size="xl"
            rounded
            style={styles.teamLogo}
          />
          
          <Text style={styles.teamName}>{team.name}</Text>
          
          <View style={styles.teamMetaContainer}>
            {team.country && (
              <Text style={styles.teamMeta}>{team.country}</Text>
            )}
            {team.founded && (
              <>
                <Text style={styles.teamMetaSeparator}>•</Text>
                <Text style={styles.teamMeta}>Fundado en {team.founded}</Text>
              </>
            )}
          </View>
        </View>

        {/* Tabs Navigation */}
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <TabButton
              label="Plantilla"
              active={activeTab === 'squad'}
              onPress={() => setActiveTab('squad')}
              icon={<Users size={18} color={activeTab === 'squad' ? '#000' : colors.text.primary} />}
            />
            <TabButton
              label="Estadísticas"
              active={activeTab === 'stats'}
              onPress={() => setActiveTab('stats')}
              icon={<TrendingUp size={18} color={activeTab === 'stats' ? '#000' : colors.text.primary} />}
            />
            <TabButton
              label="Partidos"
              active={activeTab === 'matches'}
              onPress={() => setActiveTab('matches')}
              icon={<Target size={18} color={activeTab === 'matches' ? '#000' : colors.text.primary} />}
            />
            <TabButton
              label="Info"
              active={activeTab === 'info'}
              onPress={() => setActiveTab('info')}
              icon={<Trophy size={18} color={activeTab === 'info' ? '#000' : colors.text.primary} />}
            />
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'squad' && (
            <SquadTab players={players} router={router} />
          )}
          {activeTab === 'stats' && (
            <StatsTab team={team} stats={stats} />
          )}
          {activeTab === 'matches' && (
            <MatchesTab matches={matches} />
          )}
          {activeTab === 'info' && (
            <InfoTab team={team} />
          )}
        </View>
      </ScrollView>
    </>
  );
};

// Tab Button Component
const TabButton = ({ label, active, onPress, icon }) => (
  <Button
    variant={active ? 'primary' : 'ghost'}
    size="sm"
    onPress={onPress}
    style={[styles.tabButton, active && styles.tabButtonActive]}
    icon={icon}
  >
    {label}
  </Button>
);

// Squad Tab Component
const SquadTab = ({ players, router }) => {
  if (!players || players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Users size={48} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>No hay información de jugadores disponible</Text>
      </View>
    );
  }

  // Group players by position
  const groupedPlayers = {
    goalkeepers: players.filter(p => 
      p.position === 'Portero' || p.position === 'POR' || p.position === 'GK'
    ),
    defenders: players.filter(p => 
      p.position === 'Defensa' || p.position === 'DEF' ||
      ['LI', 'LD', 'DFC', 'CAD', 'CAI', 'LB', 'RB', 'CB'].includes(p.position)
    ),
    midfielders: players.filter(p => 
      p.position === 'Mediocampista' || p.position === 'MED' ||
      ['MC', 'MCD', 'MCO', 'MI', 'MD', 'CM', 'CDM', 'CAM', 'LM', 'RM'].includes(p.position)
    ),
    forwards: players.filter(p => 
      p.position === 'Delantero' || p.position === 'DEL' ||
      ['DC', 'EI', 'ED', 'SD', 'ST', 'CF', 'LW', 'RW'].includes(p.position)
    ),
  };

  return (
    <View style={styles.squadContainer}>
      {groupedPlayers.goalkeepers.length > 0 && (
        <PlayerGroup 
          title="Porteros" 
          players={groupedPlayers.goalkeepers}
          router={router}
        />
      )}
      {groupedPlayers.defenders.length > 0 && (
        <PlayerGroup 
          title="Defensas" 
          players={groupedPlayers.defenders}
          router={router}
        />
      )}
      {groupedPlayers.midfielders.length > 0 && (
        <PlayerGroup 
          title="Mediocampistas" 
          players={groupedPlayers.midfielders}
          router={router}
        />
      )}
      {groupedPlayers.forwards.length > 0 && (
        <PlayerGroup 
          title="Delanteros" 
          players={groupedPlayers.forwards}
          router={router}
        />
      )}
    </View>
  );
};

// Player Group Component
const PlayerGroup = ({ title, players, router }) => (
  <View style={styles.playerGroup}>
    <Text style={styles.playerGroupTitle}>{title}</Text>
    <View style={styles.playersList}>
      {players.map((player, index) => (
        <TouchableOpacity
          key={player.id || index}
          style={styles.playerCard}
          onPress={() => router.push(`/player/${player.id}`)}
          activeOpacity={0.7}
        >
          <PlayerAvatar
            uri={player.photo || player.photoUrl}
            name={player.name}
            size="lg"
          />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName} numberOfLines={1}>
              {player.name || 'Jugador'}
            </Text>
            {player.shirtNumber && (
              <Text style={styles.playerNumber}>#{player.shirtNumber}</Text>
            )}
            {player.position && (
              <Text style={styles.playerPosition}>{player.position}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Stats Tab Component
const StatsTab = ({ team, stats }) => {
  // Mock stats if not available
  const displayStats = stats || {
    matchesPlayed: team.matchesPlayed || 0,
    wins: team.wins || 0,
    draws: team.draws || 0,
    losses: team.losses || 0,
    goalsFor: team.goalsFor || 0,
    goalsAgainst: team.goalsAgainst || 0,
    points: team.points || 0,
    position: team.position || 0,
  };

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsGrid}>
        <StatCard
          label="Posición"
          value={displayStats.position || '-'}
          variant="highlighted"
          icon={<Trophy size={20} color={colors.primary} />}
        />
        <StatCard
          label="Puntos"
          value={displayStats.points || '0'}
          icon={<Target size={20} color={colors.text.secondary} />}
        />
        <StatCard
          label="Partidos"
          value={displayStats.matchesPlayed || '0'}
          icon={<Calendar size={20} color={colors.text.secondary} />}
        />
        <StatCard
          label="Victorias"
          value={displayStats.wins || '0'}
          trend="up"
        />
        <StatCard
          label="Empates"
          value={displayStats.draws || '0'}
          trend="neutral"
        />
        <StatCard
          label="Derrotas"
          value={displayStats.losses || '0'}
          trend="down"
        />
        <StatCard
          label="Goles a favor"
          value={displayStats.goalsFor || '0'}
          trend="up"
        />
        <StatCard
          label="Goles en contra"
          value={displayStats.goalsAgainst || '0'}
          trend="down"
        />
      </View>
    </View>
  );
};

// Matches Tab Component
const MatchesTab = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Calendar size={48} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>No hay partidos disponibles</Text>
      </View>
    );
  }

  // Separate upcoming and recent matches
  const now = new Date();
  const upcomingMatches = matches.filter(m => {
    const matchDate = new Date(m.date);
    return matchDate > now || m.status === 'scheduled' || m.status === 'upcoming';
  }).slice(0, 5);

  const recentMatches = matches.filter(m => {
    const matchDate = new Date(m.date);
    return matchDate <= now || m.status === 'finished' || m.status === 'ft';
  }).slice(0, 5);

  return (
    <View style={styles.matchesContainer}>
      {upcomingMatches.length > 0 && (
        <View style={styles.matchesSection}>
          <Text style={styles.matchesSectionTitle}>Próximos Partidos</Text>
          {upcomingMatches.map((match, index) => (
            <MatchCard
              key={match.id || index}
              match={match}
              style={styles.matchCard}
            />
          ))}
        </View>
      )}

      {recentMatches.length > 0 && (
        <View style={styles.matchesSection}>
          <Text style={styles.matchesSectionTitle}>Resultados Recientes</Text>
          {recentMatches.map((match, index) => (
            <MatchCard
              key={match.id || index}
              match={match}
              style={styles.matchCard}
            />
          ))}
        </View>
      )}
    </View>
  );
};

// Info Tab Component
const InfoTab = ({ team }) => (
  <View style={styles.infoContainer}>
    <View style={styles.infoSection}>
      <Text style={styles.infoSectionTitle}>Información del Club</Text>
      
      <InfoRow
        icon={<MapPin size={20} color={colors.primary} />}
        label="Estadio"
        value={team.venue?.name || team.stadium || 'No disponible'}
      />
      
      {team.venue?.capacity && (
        <InfoRow
          icon={<Users size={20} color={colors.primary} />}
          label="Capacidad"
          value={`${team.venue.capacity.toLocaleString()} espectadores`}
        />
      )}
      
      {team.city && (
        <InfoRow
          icon={<MapPin size={20} color={colors.primary} />}
          label="Ciudad"
          value={team.city}
        />
      )}
      
      {team.league?.name && (
        <InfoRow
          icon={<Trophy size={20} color={colors.primary} />}
          label="Liga"
          value={team.league.name}
        />
      )}
      
      {(team.coach?.name || team.manager) && (
        <InfoRow
          icon={<UserIcon size={20} color={colors.primary} />}
          label="Entrenador"
          value={team.coach?.name || team.manager}
        />
      )}
      
      {team.president && (
        <InfoRow
          icon={<UserIcon size={20} color={colors.primary} />}
          label="Presidente"
          value={team.president}
        />
      )}
    </View>

    {team.trophies && team.trophies.length > 0 && (
      <View style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>Logros y Trofeos</Text>
        {team.trophies.map((trophy, index) => (
          <View key={index} style={styles.trophyRow}>
            <Trophy size={18} color={colors.primary} />
            <Text style={styles.trophyName}>{trophy.name}</Text>
            <Text style={styles.trophyCount}>{trophy.count || 1}x</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoRowLeft}>
      {icon}
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header Styles
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    marginBottom: spacing.base,
    position: 'relative',
  },

  favoriteButtonContainer: {
    position: 'absolute',
    top: spacing.base,
    right: spacing.base,
    zIndex: 1,
  },

  teamLogo: {
    marginBottom: spacing.base,
  },

  teamName: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },

  teamMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  teamMeta: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },

  teamMetaSeparator: {
    color: colors.text.tertiary,
    marginHorizontal: spacing.sm,
  },

  // Tabs Styles
  tabsContainer: {
    backgroundColor: colors.background.secondary,
    paddingVertical: spacing.sm,
    marginBottom: spacing.base,
  },

  tabsContent: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },

  tabButton: {
    marginRight: spacing.sm,
  },

  tabButtonActive: {
    ...shadows.sm,
  },

  // Tab Content Styles
  tabContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.xl,
  },

  // Squad Tab Styles
  squadContainer: {
    gap: spacing.lg,
  },

  playerGroup: {
    marginBottom: spacing.base,
  },

  playerGroupTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
    paddingLeft: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  playersList: {
    gap: spacing.md,
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },

  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  playerName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
  },

  playerNumber: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },

  playerPosition: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
  },

  // Stats Tab Styles
  statsContainer: {
    gap: spacing.base,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },

  // Matches Tab Styles
  matchesContainer: {
    gap: spacing.lg,
  },

  matchesSection: {
    gap: spacing.md,
  },

  matchesSectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
    paddingLeft: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  matchCard: {
    marginBottom: spacing.sm,
  },

  // Info Tab Styles
  infoContainer: {
    gap: spacing.lg,
  },

  infoSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    ...shadows.sm,
  },

  infoSectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.base,
    paddingLeft: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },

  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },

  infoLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },

  infoValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    textAlign: 'right',
    flex: 1,
  },

  trophyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.sm,
  },

  trophyName: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },

  trophyCount: {
    color: colors.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
  },

  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
    gap: spacing.base,
  },

  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
});

export default TeamDetailScreen;
