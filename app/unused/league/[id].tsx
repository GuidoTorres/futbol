import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';

const LEAGUE_DATA = {
  id: '1',
  name: 'Premier League',
  country: 'England',
  logo: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=128&h=128&fit=crop',
  season: '2023/24',
  standings: [
    { position: 1, team: 'Arsenal', played: 31, won: 23, drawn: 5, lost: 3, gf: 75, ga: 24, gd: 51, points: 74, form: ['W', 'W', 'D', 'W', 'L'], logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop' },
    { position: 2, team: 'Manchester City', played: 31, won: 22, drawn: 7, lost: 2, gf: 72, ga: 29, gd: 43, points: 73, form: ['W', 'W', 'W', 'D', 'W'], logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop' },
    { position: 3, team: 'Liverpool', played: 31, won: 21, drawn: 8, lost: 2, gf: 70, ga: 28, gd: 42, points: 71, form: ['L', 'D', 'W', 'W', 'W'], logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&h=64&fit=crop' },
  ],
  stats: {
    totalGoals: 845,
    avgGoalsPerMatch: 2.8,
    cleanSheets: 89,
    penalties: 42,
    cards: { yellow: 984, red: 28 },
  },
  topScorers: [
    { position: 1, player: 'Erling Haaland', team: 'Manchester City', goals: 28, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
    { position: 2, player: 'Ollie Watkins', team: 'Aston Villa', goals: 24, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
    { position: 3, player: 'Mohamed Salah', team: 'Liverpool', goals: 21, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
  ],
  form: [
    { matchday: 1, avgGoals: 2.4 },
    { matchday: 2, avgGoals: 2.8 },
    { matchday: 3, avgGoals: 2.6 },
    { matchday: 4, avgGoals: 3.1 },
    { matchday: 5, avgGoals: 2.9 },
  ],
};

const { width: screenWidth } = Dimensions.get('window');

export default function LeagueDetailScreen() {
  const { id } = useLocalSearchParams();
  const league = LEAGUE_DATA;

  const renderFormBadge = (result: string) => {
    const backgroundColor = result === 'W' ? '#00ff87' : result === 'D' ? '#ffd700' : '#ff4d4d';
    return (
      <View style={[styles.formBadge, { backgroundColor }]}>
        <Text style={styles.formText}>{result}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* League Header */}
      <View style={styles.header}>
        <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
        <View style={styles.headerInfo}>
          <Text style={styles.leagueName}>{league.name}</Text>
          <Text style={styles.seasonText}>{league.season}</Text>
        </View>
      </View>

      {/* League Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>League Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{league.stats.totalGoals}</Text>
            <Text style={styles.statLabel}>Total Goals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{league.stats.avgGoalsPerMatch}</Text>
            <Text style={styles.statLabel}>Goals per Match</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{league.stats.cleanSheets}</Text>
            <Text style={styles.statLabel}>Clean Sheets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{league.stats.penalties}</Text>
            <Text style={styles.statLabel}>Penalties</Text>
          </View>
        </View>

        {/* Cards Distribution */}
        <View style={styles.cardsChart}>
          <VictoryPie
            data={[
              { x: 'Yellow', y: league.stats.cards.yellow },
              { x: 'Red', y: league.stats.cards.red },
            ]}
            colorScale={['#ffd700', '#ff4d4d']}
            width={200}
            height={200}
            innerRadius={50}
            labels={({ datum }) => `${datum.x}\n${datum.y}`}
            style={{ labels: { fill: 'white', fontSize: 12 } }}
          />
        </View>
      </View>

      {/* Goals Trend */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals per Matchday</Text>
        <VictoryChart width={screenWidth - 32} height={200}>
          <VictoryLine
            data={league.form}
            x="matchday"
            y="avgGoals"
            style={{
              data: { stroke: '#00ff87' },
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: '#333' },
              tickLabels: { fill: '#888', fontSize: 12 }
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: '#333' },
              tickLabels: { fill: '#888', fontSize: 12 }
            }}
          />
        </VictoryChart>
      </View>

      {/* Top Scorers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Scorers</Text>
        {league.topScorers.map((scorer) => (
          <View key={scorer.position} style={styles.scorerRow}>
            <Text style={styles.position}>#{scorer.position}</Text>
            <Image source={{ uri: scorer.image }} style={styles.playerImage} />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{scorer.player}</Text>
              <Text style={styles.teamName}>{scorer.team}</Text>
            </View>
            <Text style={styles.goals}>{scorer.goals}</Text>
          </View>
        ))}
      </View>

      {/* League Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Standings</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.positionCell]}>#</Text>
          <Text style={[styles.tableCell, styles.teamCell]}>Team</Text>
          <Text style={[styles.tableCell, styles.statsCell]}>P</Text>
          <Text style={[styles.tableCell, styles.statsCell]}>GD</Text>
          <Text style={[styles.tableCell, styles.statsCell]}>Pts</Text>
        </View>
        {league.standings.map((team) => (
          <View key={team.position} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.positionCell]}>{team.position}</Text>
            <View style={styles.teamCell}>
              <Image source={{ uri: team.logo }} style={styles.teamLogo} />
              <Text style={styles.teamNameText}>{team.team}</Text>
            </View>
            <Text style={[styles.tableCell, styles.statsCell]}>{team.played}</Text>
            <Text style={[styles.tableCell, styles.statsCell]}>{team.gd}</Text>
            <Text style={[styles.tableCell, styles.statsCell]}>{team.points}</Text>
            <View style={styles.formContainer}>
              {team.form.map((result, index) => (
                <View key={index} style={{ marginLeft: 4 }}>
                  {renderFormBadge(result)}
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  leagueLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  headerInfo: {
    marginLeft: 16,
  },
  leagueName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  seasonText: {
    color: '#888',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    color: '#00ff87',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  cardsChart: {
    alignItems: 'center',
    marginTop: 16,
  },
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  position: {
    color: '#888',
    width: 30,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  teamName: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  goals: {
    color: '#00ff87',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tableCell: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  positionCell: {
    width: 30,
  },
  teamCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCell: {
    width: 40,
    textAlign: 'center',
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  teamNameText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  formContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  formBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formText: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});