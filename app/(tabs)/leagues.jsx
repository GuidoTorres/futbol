import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const LEAGUES = [
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

  return (
    <ScrollView style={styles.container}>
      {LEAGUES.map(league => (
        <View key={league.id} style={styles.leagueSection}>
          <TouchableOpacity 
            style={styles.leagueHeader}
            onPress={() => router.push(`/league/${league.id}`)}
          >
            <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
            <View style={styles.leagueInfo}>
              <Text style={styles.leagueName}>{league.name}</Text>
              <Text style={styles.countryName}>{league.country}</Text>
            </View>
            <View style={styles.leagueStats}>
              <Text style={styles.statText}>{league.teams} Teams</Text>
              <Text style={styles.statText}>{league.matches} Matches</Text>
            </View>
          </TouchableOpacity>

          {/* Top Scorer Section */}
          <View style={styles.topScorerSection}>
            <Text style={styles.sectionTitle}>Top Scorer</Text>
            <View style={styles.topScorerContent}>
              <Image source={{ uri: league.topScorer.image }} style={styles.playerImage} />
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{league.topScorer.name}</Text>
                <Text style={styles.goalsText}>{league.topScorer.goals} Goals</Text>
              </View>
            </View>
          </View>

          {/* Standings Section */}
          <View style={styles.standingsSection}>
            <Text style={styles.sectionTitle}>Top 3</Text>
            {league.standings.map((team) => (
              <View key={team.position} style={styles.standingRow}>
                <Text style={styles.position}>#{team.position}</Text>
                <Image source={{ uri: team.logo }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{team.team}</Text>
                <Text style={styles.points}>{team.points} pts</Text>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => router.push(`/league/${league.id}`)}
            >
              <Text style={styles.viewMoreText}>View Full Table</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  leagueSection: {
    marginBottom: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leagueLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  leagueInfo: {
    marginLeft: 16,
    flex: 1,
  },
  leagueName: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  countryName: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  leagueStats: {
    alignItems: 'flex-end',
  },
  statText: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  topScorerSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  topScorerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  playerInfo: {
    marginLeft: 12,
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  goalsText: {
    color: '#00ff87',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  standingsSection: {
    padding: 16,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  position: {
    color: '#888',
    width: 30,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  teamName: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  points: {
    color: '#00ff87',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  viewMoreButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});