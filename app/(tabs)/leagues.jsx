import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useLeagues } from '../../hooks/useLeagues';
import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import PlayerAvatar from '../../components/PlayerAvatar';
import TeamLogo from '../../components/TeamLogo';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';
import { useResponsiveValue, useIsTablet, useGridColumns } from '../../utils/responsive';

const FALLBACK_LEAGUES = [
  {
    id: 1,
    name: 'Premier League',
    country: 'England',
    logo: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=128&h=128&fit=crop',
    teams: 20,
    matches: 380,
    topScorer: {
      name: 'Erling Haaland',
      goals: 28,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop'
    },
    standings: [
      { position: 1, team: 'Arsenal', points: 74, logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop' },
      { position: 2, team: 'Manchester City', points: 73, logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop' },
      { position: 3, team: 'Liverpool', points: 71, logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&h=64&fit=crop' },
    ]
  },
  {
    id: 2,
    name: 'La Liga',
    country: 'Spain',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=128&h=128&fit=crop',
    teams: 20,
    matches: 380,
    topScorer: {
      name: 'Jude Bellingham',
      goals: 21,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop'
    },
    standings: [
      { position: 1, team: 'Real Madrid', points: 72, logo: 'https://images.unsplash.com/photo-1509105494475-358d372e6ade?w=64&h=64&fit=crop' },
      { position: 2, team: 'Barcelona', points: 67, logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop' },
      { position: 3, team: 'Girona', points: 65, logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&h=64&fit=crop' },
    ]
  },
];

export default function LeaguesScreen() {
  const router = useRouter();
  const { leagues, loading, error } = useLeagues();
  const [displayLeagues, setDisplayLeagues] = useState([]);
  const [processedLeagues, setProcessedLeagues] = useState([]);
  
  // Responsive values
  const isTablet = useIsTablet();
  const numColumns = useGridColumns();
  const containerPadding = useResponsiveValue({ base: spacing.base, md: spacing.xl });
  const cardMargin = useResponsiveValue({ base: spacing.base, md: spacing.lg });

  useEffect(() => {
    if (leagues && leagues.length > 0) {
      // Process leagues to ensure they have the necessary structure
      const processed = leagues.map(league => {
        // Ensure we have a proper logo
        const logo = league.logo || league.image || 'https://placehold.co/100?text=League';
        
        // Use real data from backend, don't use fallback data
        return {
          ...league,
          logo,
          teams: league.teams || league.teamCount || 20,
          matches: league.matches || league.matchCount || 380,
          topScorer: league.topScorer || null, // Don't use fallback
          standings: league.standings || [] // Don't use fallback
        };
      });
      
      setProcessedLeagues(processed);
      setDisplayLeagues(processed);
    } else {
      // Only use fallback if no leagues at all
      setProcessedLeagues(FALLBACK_LEAGUES);
      setDisplayLeagues(FALLBACK_LEAGUES);
    }
  }, [leagues]);

  // Function to retry loading if error occurs
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Top Leagues</Text>
        <LoadingState message="Cargando ligas..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Top Leagues</Text>
        <ErrorState
          title="Error al cargar ligas"
          message="No se pudieron cargar las ligas. Por favor, intenta de nuevo."
          onRetry={handleRetry}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.pageTitle, { paddingHorizontal: containerPadding }]}>Top Leagues</Text>
      <View style={[
        styles.leaguesGrid,
        isTablet && styles.leaguesGridTablet,
        { paddingHorizontal: containerPadding }
      ]}>
        {displayLeagues.map(league => (
          <View 
            key={league.id}
            style={[
              styles.leagueCardWrapper,
              isTablet && { width: numColumns === 2 ? '48%' : '31%' }
            ]}
          >
            <Card
              variant="elevated"
              padding="md"
              pressable
              onPress={() => router.push(`/league/${league.id}`)}
              style={[styles.leagueCard, { marginBottom: cardMargin }]}
            >
              <LinearGradient
                colors={['rgba(0, 255, 135, 0.08)', 'rgba(0, 255, 135, 0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientOverlay}
              >
                {/* League Header */}
                <View style={styles.leagueHeader}>
                  <TeamLogo 
                    uri={league.logo}
                    size="lg"
                    rounded
                  />
                  <View style={styles.leagueInfo}>
                    <Text style={styles.leagueName}>{league.name}</Text>
                    <Text style={styles.countryName}>{league.country}</Text>
                  </View>
                  <View style={styles.leagueStats}>
                    <Text style={styles.statText}>{league.teams} Teams</Text>
                    <Text style={styles.statText}>{league.matches} Matches</Text>
                  </View>
                </View>

                {/* Top Scorer Section */}
                {league.topScorer && (
                  <View style={styles.topScorerSection}>
                    <Text style={styles.sectionTitle}>Top Scorer</Text>
                    <TouchableOpacity 
                      style={styles.topScorerContent}
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/player/${league.topScorer.id || 1}`);
                      }}
                      activeOpacity={0.7}
                    >
                      <PlayerAvatar 
                        uri={league.topScorer.image}
                        name={league.topScorer.name}
                        size="md"
                        border
                      />
                      <View style={styles.playerInfo}>
                        <Text style={styles.playerName}>{league.topScorer.name}</Text>
                        <Text style={styles.goalsText}>{league.topScorer.goals} Goals</Text>
                      </View>
                      <Badge variant="success" size="sm" rounded>
                        Perfil
                      </Badge>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Standings Section */}
                {league.standings && league.standings.length > 0 && (
                  <View style={styles.standingsSection}>
                    <Text style={styles.sectionTitle}>Top 3</Text>
                    {league.standings.slice(0, 3).map((team, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.standingRow}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push(`/team/${team.teamId || index + 1}`);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.positionBadge}>
                          <Text style={styles.positionText}>#{team.position || index + 1}</Text>
                        </View>
                        <TeamLogo 
                          uri={team.logo}
                          size="sm"
                          rounded
                        />
                        <Text style={styles.teamName}>{team.team}</Text>
                        <View style={styles.pointsContainer}>
                          <Text style={styles.points}>{team.points}</Text>
                          <Text style={styles.pointsLabel}>pts</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <Button
                      variant="outline"
                      size="md"
                      onPress={(e) => {
                        e?.stopPropagation?.();
                        router.push(`/league/${league.id}`);
                      }}
                      style={styles.viewMoreButton}
                    >
                      View Full Table
                    </Button>
                  </View>
                )}
              </LinearGradient>
            </Card>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: spacing.sm,
  },
  pageTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.base,
    marginTop: spacing.sm,
  },
  leaguesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  leaguesGridTablet: {
    gap: spacing.base,
  },
  leagueCardWrapper: {
    width: '100%',
  },
  leagueCard: {
    overflow: 'hidden',
  },
  gradientOverlay: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  leagueInfo: {
    marginLeft: spacing.base,
    flex: 1,
  },
  leagueName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },
  countryName: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  leagueStats: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.sm,
    borderRadius: borderRadius.base,
  },
  statText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  topScorerSection: {
    paddingTop: spacing.base,
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily.semiBold,
  },
  topScorerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 135, 0.08)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.15)',
  },
  playerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  playerName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
  },
  goalsText: {
    color: colors.primary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily.medium,
  },
  standingsSection: {
    paddingTop: spacing.base,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: spacing.md,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  positionText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
  },
  teamName: {
    color: colors.text.primary,
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    marginLeft: spacing.md,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0, 255, 135, 0.15)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  points: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
    marginRight: 2,
  },
  pointsLabel: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    opacity: 0.8,
  },
  viewMoreButton: {
    marginTop: spacing.md,
  },
});