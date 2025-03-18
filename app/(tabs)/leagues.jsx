import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useLeagues } from '../../hooks/useLeagues';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (leagues && leagues.length > 0) {
      // Process leagues to ensure they have the necessary structure
      const processed = leagues.map(league => {
        // Ensure we have a proper logo
        const logo = league.logo || league.image || 'https://placehold.co/100?text=League';
        
        // If there's no topScorer or standings, use defaults
        return {
          ...league,
          logo,
          teams: league.teams || league.teamCount || 20,
          matches: league.matches || league.matchCount || 380,
          topScorer: league.topScorer || FALLBACK_LEAGUES[0].topScorer,
          standings: league.standings || FALLBACK_LEAGUES[0].standings
        };
      });
      
      setProcessedLeagues(processed);
      setDisplayLeagues(processed);
    } else {
      setProcessedLeagues(FALLBACK_LEAGUES);
      setDisplayLeagues(FALLBACK_LEAGUES);
    }
  }, [leagues]);

  // Function to retry loading if error occurs
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff87" />
        <Text style={styles.loadingText}>Loading leagues...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load leagues</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Top Leagues</Text>
      {displayLeagues.map(league => (
        <TouchableOpacity 
          key={league.id} 
          style={styles.leagueSection}
          onPress={() => router.push(`/league/${league.id}`)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#2a2a2a', '#1a1a1a']}
            style={styles.gradientBackground}
          >
            <View style={styles.leagueHeader}>
              <Image 
                source={{ uri: league.logo }} 
                style={styles.leagueLogo} 
                defaultSource={{ uri: 'https://placehold.co/100x100?text=League' }}
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
                  onPress={() => router.push(`/player/${league.topScorer.id || 1}`)}
                >
                  <Image 
                    source={{ uri: league.topScorer.image }} 
                    style={styles.playerImage}
                    defaultSource={{ uri: 'https://placehold.co/100x100?text=Player' }}
                  />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{league.topScorer.name}</Text>
                    <Text style={styles.goalsText}>{league.topScorer.goals} Goals</Text>
                  </View>
                  <View style={styles.viewProfileBadge}>
                    <Text style={styles.viewProfileText}>Perfil</Text>
                  </View>
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
                    onPress={() => router.push(`/team/${team.teamId || index + 1}`)}
                  >
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>#{team.position || index + 1}</Text>
                    </View>
                    <Image 
                      source={{ uri: team.logo }} 
                      style={styles.teamLogo}
                      defaultSource={{ uri: 'https://placehold.co/100x100?text=Team' }}
                    />
                    <Text style={styles.teamName}>{team.team}</Text>
                    <View style={styles.pointsContainer}>
                      <Text style={styles.points}>{team.points}</Text>
                      <Text style={styles.pointsLabel}>pts</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={() => router.push(`/league/${league.id}`)}
                >
                  <Text style={styles.viewMoreText}>View Full Table</Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Inter_500Medium',
  },
  retryButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  pageTitle: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  leagueSection: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradientBackground: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leagueLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#333',
  },
  leagueInfo: {
    marginLeft: 16,
    flex: 1,
  },
  leagueName: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  countryName: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  leagueStats: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  statText: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  topScorerSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    color: '#00ff87',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  topScorerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,135,0.05)',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  viewProfileBadge: {
    backgroundColor: 'rgba(0,255,135,0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  viewProfileText: {
    color: '#00ff87',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#00ff87',
  },
  playerInfo: {
    marginLeft: 12,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  goalsText: {
    color: '#00ff87',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter_500Medium',
  },
  standingsSection: {
    padding: 16,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    borderRadius: 8,
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  positionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  teamLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  teamName: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0,255,135,0.1)',
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  points: {
    color: '#00ff87',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginRight: 2,
  },
  pointsLabel: {
    color: '#00ff87',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    opacity: 0.7,
  },
  viewMoreButton: {
    backgroundColor: 'rgba(0,255,135,0.15)',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#00ff8730',
  },
  viewMoreText: {
    color: '#00ff87',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});