import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { getMatchPrediction, getHeadToHeadAnalysis } from '../services/predictions';

const { width: screenWidth } = Dimensions.get('window');

export default function PredictionDetail({ matchId, homeTeam, awayTeam }) {
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [h2hAnalysis, setH2hAnalysis] = useState(null);

  useEffect(() => {
    loadPredictionData();
  }, [matchId]);

  const loadPredictionData = async () => {
    setLoading(true);
    try {
      const predictionData = await getMatchPrediction(matchId);
      setPrediction(predictionData.data);

      if (homeTeam?.id && awayTeam?.id) {
        try {
          const h2hData = await getHeadToHeadAnalysis(homeTeam.id, awayTeam.id);
          setH2hAnalysis(h2hData.data?.analysis);
        } catch (error) {
          console.log('H2H data not available');
        }
      }
    } catch (error) {
      console.error('Error loading prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#00ff87';
    if (confidence >= 60) return '#4CAF50';
    if (confidence >= 40) return '#FFC107';
    return '#FF5722';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 80) return 'Muy Alta';
    if (confidence >= 60) return 'Alta';
    if (confidence >= 40) return 'Media';
    return 'Baja';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff87" />
        <Text style={styles.loadingText}>Cargando predicción...</Text>
      </View>
    );
  }

  if (!prediction) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar la predicción</Text>
      </View>
    );
  }

  const pieData = [
    { x: 'Local', y: prediction.homeWinProbability, fill: '#00ff87' },
    { x: 'Empate', y: prediction.drawProbability, fill: '#FFC107' },
    { x: 'Visitante', y: prediction.awayWinProbability, fill: '#ff4d4d' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Confidence Badge */}
      <View style={styles.confidenceSection}>
        <Text style={styles.sectionTitle}>Nivel de Confianza</Text>
        <View
          style={[
            styles.confidenceBadge,
            { backgroundColor: getConfidenceColor(prediction.confidence) },
          ]}
        >
          <Text style={styles.confidenceValue}>{prediction.confidence}%</Text>
          <Text style={styles.confidenceLabel}>
            {getConfidenceLabel(prediction.confidence)}
          </Text>
        </View>
      </View>

      {/* Probability Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Probabilidades</Text>
        <View style={styles.chartContainer}>
          <VictoryPie
            data={pieData}
            width={screenWidth - 80}
            height={250}
            colorScale={['#00ff87', '#FFC107', '#ff4d4d']}
            innerRadius={60}
            labelRadius={90}
            style={{
              labels: { fill: '#fff', fontSize: 14, fontWeight: 'bold' },
            }}
            labels={({ datum }) => `${datum.x}\n${datum.y}%`}
          />
        </View>
        <View style={styles.probabilitiesLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#00ff87' }]} />
            <Text style={styles.legendText}>
              {homeTeam?.name || 'Local'}: {prediction.homeWinProbability}%
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Empate: {prediction.drawProbability}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff4d4d' }]} />
            <Text style={styles.legendText}>
              {awayTeam?.name || 'Visitante'}: {prediction.awayWinProbability}%
            </Text>
          </View>
        </View>
      </View>

      {/* Expected Goals */}
      <View style={styles.expectedGoalsSection}>
        <Text style={styles.sectionTitle}>Goles Esperados (xG)</Text>
        <View style={styles.expectedGoalsContainer}>
          <View style={styles.expectedGoalItem}>
            <Text style={styles.teamNameSmall}>{homeTeam?.name || 'Local'}</Text>
            <Text style={styles.expectedGoalValue}>
              {prediction.expectedGoalsHome?.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.expectedGoalSeparator}>-</Text>
          <View style={styles.expectedGoalItem}>
            <Text style={styles.teamNameSmall}>{awayTeam?.name || 'Visitante'}</Text>
            <Text style={styles.expectedGoalValue}>
              {prediction.expectedGoalsAway?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Key Factors */}
      {prediction.keyFactors && prediction.keyFactors.length > 0 && (
        <View style={styles.keyFactorsSection}>
          <Text style={styles.sectionTitle}>Factores Clave</Text>
          {prediction.keyFactors.map((factor, index) => (
            <View key={index} style={styles.factorItem}>
              <Text style={styles.factorBullet}>•</Text>
              <Text style={styles.factorText}>{factor}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Head to Head Analysis */}
      {h2hAnalysis && h2hAnalysis.totalMatches > 0 && (
        <View style={styles.h2hSection}>
          <Text style={styles.sectionTitle}>Historial de Enfrentamientos</Text>
          <View style={styles.h2hStats}>
            <View style={styles.h2hStatItem}>
              <Text style={styles.h2hStatValue}>{h2hAnalysis.homeTeamWins}</Text>
              <Text style={styles.h2hStatLabel}>Victorias Local</Text>
            </View>
            <View style={styles.h2hStatItem}>
              <Text style={styles.h2hStatValue}>{h2hAnalysis.draws}</Text>
              <Text style={styles.h2hStatLabel}>Empates</Text>
            </View>
            <View style={styles.h2hStatItem}>
              <Text style={styles.h2hStatValue}>{h2hAnalysis.awayTeamWins}</Text>
              <Text style={styles.h2hStatLabel}>Victorias Visitante</Text>
            </View>
          </View>
          <View style={styles.h2hGoals}>
            <Text style={styles.h2hGoalsText}>
              Promedio de goles: {h2hAnalysis.avgGoalsHome?.toFixed(1)} -{' '}
              {h2hAnalysis.avgGoalsAway?.toFixed(1)}
            </Text>
          </View>
          {h2hAnalysis.matches && h2hAnalysis.matches.length > 0 && (
            <View style={styles.recentMatches}>
              <Text style={styles.recentMatchesTitle}>Últimos Enfrentamientos</Text>
              {h2hAnalysis.matches.map((match, index) => (
                <View key={index} style={styles.recentMatchItem}>
                  <Text style={styles.recentMatchDate}>
                    {new Date(match.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.recentMatchScore}>
                    {match.homeTeam} {match.homeScore} - {match.awayScore} {match.awayTeam}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Model Info */}
      <View style={styles.modelInfo}>
        <Text style={styles.modelInfoText}>
          Modelo: {prediction.modelVersion || 'v1.0'}
        </Text>
        <Text style={styles.modelInfoText}>
          Generado: {new Date(prediction.generatedAt || prediction.calculatedAt).toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 14,
  },
  confidenceSection: {
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confidenceBadge: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confidenceValue: {
    color: '#000',
    fontSize: 32,
    fontWeight: 'bold',
  },
  confidenceLabel: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  chartSection: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginVertical: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  probabilitiesLegend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
  },
  expectedGoalsSection: {
    padding: 20,
  },
  expectedGoalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
  },
  expectedGoalItem: {
    alignItems: 'center',
  },
  teamNameSmall: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },
  expectedGoalValue: {
    color: '#00ff87',
    fontSize: 28,
    fontWeight: 'bold',
  },
  expectedGoalSeparator: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
  },
  keyFactorsSection: {
    padding: 20,
    backgroundColor: '#1a1a1a',
    marginVertical: 8,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  factorBullet: {
    color: '#00ff87',
    fontSize: 16,
    marginRight: 8,
  },
  factorText: {
    color: '#ddd',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  h2hSection: {
    padding: 20,
  },
  h2hStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  h2hStatItem: {
    alignItems: 'center',
  },
  h2hStatValue: {
    color: '#00ff87',
    fontSize: 24,
    fontWeight: 'bold',
  },
  h2hStatLabel: {
    color: '#999',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  h2hGoals: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  h2hGoalsText: {
    color: '#ddd',
    fontSize: 13,
  },
  recentMatches: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
  },
  recentMatchesTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentMatchItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  recentMatchDate: {
    color: '#999',
    fontSize: 11,
    marginBottom: 4,
  },
  recentMatchScore: {
    color: '#ddd',
    fontSize: 13,
  },
  modelInfo: {
    padding: 20,
    alignItems: 'center',
  },
  modelInfoText: {
    color: '#666',
    fontSize: 11,
    marginBottom: 4,
  },
});
