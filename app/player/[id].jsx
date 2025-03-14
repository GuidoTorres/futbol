import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';

const PlayerDetailScreen = () => {
  const { id } = useLocalSearchParams();
  
  // Temporary player data - will replace with API data later
  const player = {
    id: 1,
    name: 'Lionel Messi',
    number: 10,
    position: 'Delantero',
    team: 'Paris Saint-Germain',
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=128&h=128&fit=crop',
    stats: {
      matches: 28,
      goals: 15,
      assists: 10,
      rating: 8.7,
      passes: 89,
      tackles: 12
    },
    career: [
      { season: '2022-23', team: 'PSG', matches: 32, goals: 16 },
      { season: '2021-22', team: 'PSG', matches: 26, goals: 11 },
      { season: '2020-21', team: 'Barcelona', matches: 35, goals: 30 }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: player.image }} style={styles.playerImage} />
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerInfo}>{player.position} • #{player.number}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estadísticas Temporada</Text>
        <View style={styles.statsGrid}>
          <StatBox title="Partidos" value={player.stats.matches} />
          <StatBox title="Goles" value={player.stats.goals} />
          <StatBox title="Asistencias" value={player.stats.assists} />
          <StatBox title="Rating" value={player.stats.rating} />
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Rendimiento Histórico</Text>
        <View style={styles.chartContainer}>
          <VictoryChart width={screenWidth - 32}>
            <VictoryLine
              data={player.career}
              x="season"
              y="goals"
              style={{
                data: { stroke: '#00ff87', strokeWidth: 2 },
                labels: { fill: 'white' }
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: '#444' },
                tickLabels: { fill: 'white', fontSize: 10 }
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: '#444' },
                tickLabels: { fill: 'white', fontSize: 10 }
              }}
            />
          </VictoryChart>
        </View>
      </View>

      <View style={styles.careerSection}>
        <Text style={styles.sectionTitle}>Trayectoria</Text>
        {player.career.map((season, index) => (
          <CareerItem key={index} season={season} />
        ))}
      </View>
    </ScrollView>
  );
};

const StatBox = ({ title, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

const CareerItem = ({ season }) => (
  <View style={styles.careerItem}>
    <Text style={styles.seasonText}>{season.season}</Text>
    <Text style={styles.teamText}>{season.team}</Text>
    <View style={styles.careerStats}>
      <Text style={styles.matchText}>{season.matches} PJ</Text>
      <Text style={styles.goalText}>{season.goals} G</Text>
    </View>
  </View>
);

const PlayerListItem = ({ player, isStarter = false }) => (
  <TouchableOpacity style={styles.playerListItem}>
    <View style={styles.playerNumberBox}>
      <Text style={styles.playerNumberBoxText}>{player.number}</Text>
    </View>
    <Image source={{ uri: player.image }} style={styles.playerListImage} />
    <View style={styles.playerListInfo}>
      <Text style={styles.playerListName}>{player.name}</Text>
      <Text style={styles.playerListPosition}>{player.position}</Text>
    </View>
    {isStarter && (
      <View style={styles.starterBadge}>
        <Text style={styles.starterBadgeText}>Titular</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 16
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12
  },
  playerName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4
  },
  playerInfo: {
    color: '#888',
    fontSize: 16
  },
  statsContainer: {
    marginBottom: 24
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statBox: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  statValue: {
    color: '#00ff87',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4
  },
  statLabel: {
    color: '#888',
    fontSize: 14
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '600'
  },
  chartSection: {
    marginBottom: 24
  },
  careerSection: {
    marginBottom: 24
  },
  careerItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  seasonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  teamText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8
  },
  careerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  matchText: {
    color: '#00ff87',
    fontSize: 14
  },
  goalText: {
    color: '#ff4d4d',
    fontSize: 14
  }
});

export default PlayerDetailScreen;