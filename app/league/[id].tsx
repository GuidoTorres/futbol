import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis, VictoryLegend } from 'victory-native';

const LEAGUE_DATA = {
  id: '1',
  name: 'La Liga',
  country: 'España',
  logo: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?w=128&h=128&fit=crop',
  season: '2023/24',
  standings: [
    { position: 1, team: 'Real Madrid', played: 31, won: 23, drawn: 5, lost: 3, gf: 75, ga: 24, gd: 51, points: 74, form: ['V', 'V', 'E', 'V', 'D'], logo: 'https://images.unsplash.com/photo-1608831540955-35094d48694a?w=64&h=64&fit=crop' },
    { position: 2, team: 'Barcelona', played: 31, won: 22, drawn: 7, lost: 2, gf: 72, ga: 29, gd: 43, points: 73, form: ['V', 'V', 'V', 'E', 'V'], logo: 'https://images.unsplash.com/photo-1610901157620-340856d0a50f?w=64&h=64&fit=crop' },
    { position: 3, team: 'Girona', played: 31, won: 21, drawn: 8, lost: 2, gf: 70, ga: 28, gd: 42, points: 71, form: ['D', 'E', 'V', 'V', 'V'], logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=64&h=64&fit=crop' },
  ],
  stats: {
    totalGoals: 845,
    avgGoalsPerMatch: 2.8,
    cleanSheets: 89,
    penalties: 42,
    cards: { yellow: 984, red: 28 },
  },
  topScorers: [
    { position: 1, player: 'Bellingham', team: 'Real Madrid', goals: 28, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
    { position: 2, player: 'Lewandowski', team: 'Barcelona', goals: 24, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
    { position: 3, player: 'Dovbyk', team: 'Girona', goals: 21, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
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
  const [activeTab, setActiveTab] = useState('estadisticas');

  // Componente de pestaña
  const TabButton = ({ title, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, active && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderFormBadge = (result: string) => {
    const backgroundColor = result === 'V' ? '#00ff87' : result === 'E' ? '#ffd700' : '#ff4d4d';
    return (
      <View style={[styles.formBadge, { backgroundColor }]}>
        <Text style={styles.formText}>{result}</Text>
      </View>
    );
  };

  // Renderiza el contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'estadisticas':
        return (
          <View style={styles.tabContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{league.stats.totalGoals}</Text>
                <Text style={styles.statLabel}>Goles Totales</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{league.stats.avgGoalsPerMatch}</Text>
                <Text style={styles.statLabel}>Goles por Partido</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{league.stats.cleanSheets}</Text>
                <Text style={styles.statLabel}>Porterías a Cero</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{league.stats.penalties}</Text>
                <Text style={styles.statLabel}>Penaltis</Text>
              </View>
            </View>

            {/* Cards Distribution */}
            <View style={styles.cardsChart}>
              <Text style={styles.chartTitle}>Distribución de Tarjetas</Text>
              <VictoryPie
                data={[
                  { x: 'Amarillas', y: league.stats.cards.yellow },
                  { x: 'Rojas', y: league.stats.cards.red },
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
        );
      case 'tendencias':
        return (
          <View style={styles.tabContent}>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Goles por Jornada</Text>
              <VictoryChart width={screenWidth - 40} height={200}>
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
          </View>
        );
      case 'goleadores':
        return (
          <View style={styles.tabContent}>
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
        );
      case 'clasificacion':
        return (
          <View style={styles.tabContent}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.positionCell]}>#</Text>
              <Text style={[styles.tableCell, styles.teamCell]}>Equipo</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>PJ</Text>
              <Text style={[styles.tableCell, styles.statsCell]}>DG</Text>
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
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* League Header - siempre visible */}
      <View style={styles.header}>
        <Image source={{ uri: league.logo }} style={styles.leagueLogo} />
        <View style={styles.headerInfo}>
          <Text style={styles.leagueName}>{league.name}</Text>
          <Text style={styles.seasonText}>{league.season}</Text>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabsContainer}>
        <TabButton 
          title="Estadísticas" 
          active={activeTab === 'estadisticas'} 
          onPress={() => setActiveTab('estadisticas')}
        />
        <TabButton 
          title="Tendencias" 
          active={activeTab === 'tendencias'} 
          onPress={() => setActiveTab('tendencias')}
        />
        <TabButton 
          title="Goleadores" 
          active={activeTab === 'goleadores'} 
          onPress={() => setActiveTab('goleadores')}
        />
        <TabButton 
          title="Clasificación" 
          active={activeTab === 'clasificacion'} 
          onPress={() => setActiveTab('clasificacion')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
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
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 50,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#00ff87',
  },
  tabButtonText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  activeTabButtonText: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
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
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginHorizontal: 'auto',
  },
  cardsChart: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginHorizontal: 'auto',
  },
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
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
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    width: '100%',
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