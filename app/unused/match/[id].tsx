import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryGroup, VictoryLegend } from 'victory-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

const MATCH_DATA = {
  id: '1',
  league: 'Premier League',
  homeTeam: {
    name: 'Manchester United',
    logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop',
    score: 2,
    formation: '4-3-3',
    players: [
      { id: 1, name: 'De Gea', number: 1, position: 'GK', x: 50, y: 90, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 2, name: 'Wan-Bissaka', number: 29, position: 'RB', x: 85, y: 70, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 3, name: 'Varane', number: 19, position: 'CB', x: 65, y: 70, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      { id: 4, name: 'Martinez', number: 6, position: 'CB', x: 35, y: 70, image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=64&h=64&fit=crop' },
      { id: 5, name: 'Shaw', number: 23, position: 'LB', x: 15, y: 70, image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&h=64&fit=crop' },
    ]
  },
  awayTeam: {
    name: 'Liverpool',
    logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop',
    score: 1,
    formation: '4-2-3-1',
    players: [
      { id: 1, name: 'Alisson', number: 1, position: 'GK', x: 50, y: 10, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop' },
      { id: 2, name: 'Alexander-Arnold', number: 66, position: 'RB', x: 85, y: 30, image: 'https://images.unsplash.com/photo-1507038732509-8b1a9623223a?w=64&h=64&fit=crop' },
      { id: 3, name: 'Van Dijk', number: 4, position: 'CB', x: 65, y: 30, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 4, name: 'Konate', number: 5, position: 'CB', x: 35, y: 30, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 5, name: 'Robertson', number: 26, position: 'LB', x: 15, y: 30, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
    ]
  },
  stats: {
    possession: { home: 55, away: 45 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 10, away: 12 },
    yellowCards: { home: 2, away: 1 },
    redCards: { home: 0, away: 0 },
    offsides: { home: 3, away: 2 },
    saves: { home: 2, away: 3 },
    passes: { home: 423, away: 389 },
    passAccuracy: { home: 86, away: 83 },
  },
  events: [
    { time: '23', type: 'goal', team: 'home', player: 'Rashford' },
    { time: '45+2', type: 'yellow', team: 'away', player: 'Van Dijk' },
    { time: '67', type: 'goal', team: 'away', player: 'Salah' },
    { time: '89', type: 'goal', team: 'home', player: 'Fernandes' },
  ]
};

const { width: screenWidth } = Dimensions.get('window');

function FootballField({ homeTeam, awayTeam }) {
  const fieldWidth = screenWidth - 32;
  const fieldHeight = fieldWidth * 1.5;
  const playerSize = 40;

  const renderPlayer = (player, isHome) => (
    <View
      key={player.id}
      style={{
        position: 'absolute',
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: [
          { translateX: -playerSize / 2 },
          { translateY: -playerSize / 2 }
        ],
        alignItems: 'center',
      }}>
      <Image
        source={{ uri: player.image }}
        style={{
          width: playerSize,
          height: playerSize,
          borderRadius: playerSize / 2,
          borderWidth: 2,
          borderColor: isHome ? '#00ff87' : '#ff4d4d',
        }}
      />
      <View style={styles.playerNumber}>
        <Text style={styles.playerNumberText}>{player.number}</Text>
      </View>
      <Text style={styles.playerName}>{player.name}</Text>
    </View>
  );

  return (
    <View style={[styles.field, { width: fieldWidth, height: fieldHeight }]}>
      <Svg width={fieldWidth} height={fieldHeight}>
        {/* Field outline */}
        <Rect
          x="0"
          y="0"
          width={fieldWidth}
          height={fieldHeight}
          fill="#1a4728"
          stroke="#fff"
          strokeWidth="2"
        />
        
        {/* Center line */}
        <Line
          x1="0"
          y1={fieldHeight / 2}
          x2={fieldWidth}
          y2={fieldHeight / 2}
          stroke="#fff"
          strokeWidth="2"
        />
        
        {/* Center circle */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight / 2}
          r={fieldWidth / 5}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Penalty areas */}
        <Rect
          x={fieldWidth * 0.15}
          y="0"
          width={fieldWidth * 0.7}
          height={fieldHeight * 0.2}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <Rect
          x={fieldWidth * 0.15}
          y={fieldHeight * 0.8}
          width={fieldWidth * 0.7}
          height={fieldHeight * 0.2}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
      </Svg>
      
      {/* Players */}
      {homeTeam.players.map(player => renderPlayer(player, true))}
      {awayTeam.players.map(player => renderPlayer(player, false))}
    </View>
  );
}

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams();
  const match = MATCH_DATA;

  const statsData = [
    { x: 'Possession', home: match.stats.possession.home, away: match.stats.possession.away },
    { x: 'Shots', home: match.stats.shots.home, away: match.stats.shots.away },
    { x: 'On Target', home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away },
    { x: 'Corners', home: match.stats.corners.home, away: match.stats.corners.away },
    { x: 'Passes', home: match.stats.passes.home / 10, away: match.stats.passes.away / 10 },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Match Header */}
      <View style={styles.header}>
        <View style={styles.team}>
          <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.homeTeam.name}</Text>
        </View>
        
        <View style={styles.score}>
          <Text style={styles.scoreText}>
            {match.homeTeam.score} - {match.awayTeam.score}
          </Text>
        </View>
        
        <View style={styles.team}>
          <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.awayTeam.name}</Text>
        </View>
      </View>

      {/* Match Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Events</Text>
        <View style={styles.events}>
          {match.events.map((event, index) => (
            <View key={index} style={styles.event}>
              <Text style={styles.eventTime}>{event.time}'</Text>
              <View style={[
                styles.eventIndicator,
                { backgroundColor: event.type === 'goal' ? '#00ff87' : '#ffdd00' }
              ]} />
              <Text style={styles.eventText}>
                {event.player} ({event.type === 'goal' ? '⚽' : '🟨'})
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Match Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Match Stats</Text>
        <View style={styles.statsContainer}>
          <VictoryChart
            height={300}
            padding={{ top: 40, bottom: 40, left: 40, right: 40 }}
            domainPadding={{ x: 30 }}>
            <VictoryLegend
              x={125}
              y={0}
              orientation="horizontal"
              gutter={20}
              data={[
                { name: match.homeTeam.name, symbol: { fill: '#00ff87' } },
                { name: match.awayTeam.name, symbol: { fill: '#ff4d4d' } },
              ]}
            />
            <VictoryGroup offset={20}>
              <VictoryBar
                data={statsData}
                y="home"
                style={{ data: { fill: '#00ff87' } }}
              />
              <VictoryBar
                data={statsData}
                y="away"
                style={{ data: { fill: '#ff4d4d' } }}
              />
            </VictoryGroup>
            <VictoryAxis
              style={{
                axis: { stroke: '#333' },
                tickLabels: { fill: '#888', fontSize: 12, angle: -45 }
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
      </View>

      {/* Detailed Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detailed Statistics</Text>
        <View style={styles.detailedStats}>
          {Object.entries(match.stats).map(([key, value]) => (
            <View key={key} style={styles.statRow}>
              <Text style={styles.statValue}>{value.home}</Text>
              <View style={styles.statLabel}>
                <Text style={styles.statLabelText}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </View>
              <Text style={styles.statValue}>{value.away}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lineups */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lineups</Text>
        <View style={styles.formations}>
          <Text style={styles.formation}>{match.homeTeam.formation}</Text>
          <Text style={styles.formation}>{match.awayTeam.formation}</Text>
        </View>
        <FootballField homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
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
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  score: {
    paddingHorizontal: 20,
  },
  scoreText: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  events: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTime: {
    color: '#888',
    width: 40,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  eventText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  detailedStats: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
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
  formations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  formation: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  field: {
    backgroundColor: '#1a4728',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  playerName: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#000c',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playerNumber: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#000',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerNumberText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
});