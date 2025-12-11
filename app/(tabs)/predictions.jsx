import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from 'victory-native';
import {
  getUpcomingPredictions,
  getHighConfidencePredictions,
  getPredictionAccuracy,
} from '../../services/predictions';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

const { width: screenWidth } = Dimensions.get('window');

// Mock data for preview
const MOCK_PREDICTIONS = [
  {
    id: 1,
    matchId: 101,
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeWinProbability: 45,
    drawProbability: 25,
    awayWinProbability: 30,
    confidence: 85,
    predictedScore: '2-1',
    matchDate: new Date(Date.now() + 86400000).toISOString(),
    league: 'La Liga',
  },
  {
    id: 2,
    matchId: 102,
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeWinProbability: 50,
    drawProbability: 30,
    awayWinProbability: 20,
    confidence: 78,
    predictedScore: '2-2',
    matchDate: new Date(Date.now() + 172800000).toISOString(),
    league: 'Premier League',
  },
  {
    id: 3,
    matchId: 103,
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeWinProbability: 60,
    drawProbability: 25,
    awayWinProbability: 15,
    confidence: 82,
    predictedScore: '3-1',
    matchDate: new Date(Date.now() + 259200000).toISOString(),
    league: 'Bundesliga',
  },
];

const MOCK_ACCURACY_STATS = {
  totalPredictions: 150,
  correctPredictions: 98,
  accuracy: 65.3,
  byOutcome: {
    homeWin: { total: 60, correct: 42, accuracy: 70 },
    draw: { total: 30, correct: 15, accuracy: 50 },
    awayWin: { total: 60, correct: 41, accuracy: 68.3 },
  },
};

export default function PredictionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [upcomingPredictions, setUpcomingPredictions] = useState([]);
  const [highConfidencePredictions, setHighConfidencePredictions] = useState([]);
  const [accuracyStats, setAccuracyStats] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Function to load mock data
  const loadMockData = () => {
    setUseMockData(true);
    setUpcomingPredictions(MOCK_PREDICTIONS);
    setHighConfidencePredictions(MOCK_PREDICTIONS);
    setAccuracyStats(MOCK_ACCURACY_STATS);
    setLoading(false);
    setError(null);
  };

  const loadData = async () => {
    if (useMockData) {
      setUpcomingPredictions(MOCK_PREDICTIONS);
      setHighConfidencePredictions(MOCK_PREDICTIONS);
      setAccuracyStats(MOCK_ACCURACY_STATS);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [upcomingData, highConfData, accuracyData] = await Promise.all([
        getUpcomingPredictions(20),
        getHighConfidencePredictions(70, 10),
        getPredictionAccuracy(30),
      ]);

      setUpcomingPredictions(upcomingData.data?.predictions || []);
      setHighConfidencePredictions(highConfData.data?.predictions || []);
      setAccuracyStats(accuracyData.data || null);
    } catch (error) {
      console.error('Error loading predictions:', error);
      setError(error.message || 'Error al cargar las predicciones');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getConfidenceBadgeVariant = (confidence) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'info';
    if (confidence >= 40) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 80) return 'Muy Alta';
    if (confidence >= 60) return 'Alta';
    if (confidence >= 40) return 'Media';
    return 'Baja';
  };

  const getProbabilityColor = (probability, isHighest) => {
    if (isHighest) return colors.primary;
    if (probability >= 40) return colors.text.primary;
    return colors.text.tertiary;
  };

  const getMostLikelyOutcome = (prediction) => {
    const probs = {
      home: prediction.homeWinProbability,
      draw: prediction.drawProbability,
      away: prediction.awayWinProbability,
    };
    return Object.keys(probs).reduce((a, b) => (probs[a] > probs[b] ? a : b));
  };

  const getOutcomeLabel = (outcome, homeTeam, awayTeam) => {
    if (outcome === 'home') return `Victoria ${homeTeam}`;
    if (outcome === 'away') return `Victoria ${awayTeam}`;
    return 'Empate';
  };

  const renderPredictionCard = (prediction) => {
    const mostLikely = getMostLikelyOutcome(prediction);
    const outcomeLabel = getOutcomeLabel(
      mostLikely,
      prediction.homeTeam?.name,
      prediction.awayTeam?.name
    );

    return (
      <Card
        key={prediction.matchId}
        variant="elevated"
        padding="md"
        pressable
        onPress={() => router.push(`/match/${prediction.matchId}`)}
        style={styles.predictionCard}
      >
        <View style={styles.predictionHeader}>
          <View style={styles.teamsContainer}>
            <Text style={styles.teamName}>{prediction.homeTeam?.name}</Text>
            <Text style={styles.vs}>vs</Text>
            <Text style={styles.teamName}>{prediction.awayTeam?.name}</Text>
          </View>
          <Badge
            variant={getConfidenceBadgeVariant(prediction.confidence)}
            size="md"
            rounded
          >
            {getConfidenceLabel(prediction.confidence)}
          </Badge>
        </View>

        <View style={styles.predictionBody}>
          <View style={styles.probabilitiesContainer}>
            <View style={styles.probabilityItem}>
              <Text style={styles.probabilityLabel}>Local</Text>
              <Text
                style={[
                  styles.probabilityValue,
                  { color: getProbabilityColor(prediction.homeWinProbability, mostLikely === 'home') },
                ]}
              >
                {prediction.homeWinProbability}%
              </Text>
            </View>
            <View style={styles.probabilityItem}>
              <Text style={styles.probabilityLabel}>Empate</Text>
              <Text
                style={[
                  styles.probabilityValue,
                  { color: getProbabilityColor(prediction.drawProbability, mostLikely === 'draw') },
                ]}
              >
                {prediction.drawProbability}%
              </Text>
            </View>
            <View style={styles.probabilityItem}>
              <Text style={styles.probabilityLabel}>Visitante</Text>
              <Text
                style={[
                  styles.probabilityValue,
                  { color: getProbabilityColor(prediction.awayWinProbability, mostLikely === 'away') },
                ]}
              >
                {prediction.awayWinProbability}%
              </Text>
            </View>
          </View>

          <View style={styles.expectedGoalsContainer}>
            <Text style={styles.expectedGoalsLabel}>Goles Esperados:</Text>
            <Text style={styles.expectedGoalsValue}>
              {prediction.expectedGoalsHome?.toFixed(1)} - {prediction.expectedGoalsAway?.toFixed(1)}
            </Text>
          </View>

          <View style={styles.outcomeContainer}>
            <Text style={styles.outcomeLabel}>Resultado más probable:</Text>
            <Text style={styles.outcomeValue}>{outcomeLabel}</Text>
          </View>
        </View>
      </Card>
    );
  };

  const renderAccuracyStats = () => {
    if (!accuracyStats) return null;

    const chartData = [
      { x: 'Alta', y: accuracyStats.accuracyByConfidence?.high?.accuracy || 0 },
      { x: 'Media', y: accuracyStats.accuracyByConfidence?.medium?.accuracy || 0 },
      { x: 'Baja', y: accuracyStats.accuracyByConfidence?.low?.accuracy || 0 },
    ];

    return (
      <View style={styles.accuracySection}>
        <Text style={styles.sectionTitle}>Precisión de Predicciones (30 días)</Text>
        
        <View style={styles.accuracyOverview}>
          <Card variant="elevated" padding="md" style={styles.accuracyCard}>
            <Text style={styles.accuracyLabel}>Precisión General</Text>
            <Text style={styles.accuracyValue}>
              {accuracyStats.overallAccuracy?.toFixed(1)}%
            </Text>
          </Card>
          <Card variant="elevated" padding="md" style={styles.accuracyCard}>
            <Text style={styles.accuracyLabel}>Total Predicciones</Text>
            <Text style={styles.accuracyValue}>{accuracyStats.totalPredictions}</Text>
          </Card>
          <Card variant="elevated" padding="md" style={styles.accuracyCard}>
            <Text style={styles.accuracyLabel}>Correctas</Text>
            <Text style={styles.accuracyValue}>{accuracyStats.correctPredictions}</Text>
          </Card>
        </View>

        <Card variant="elevated" padding="md" style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Precisión por Nivel de Confianza</Text>
          <VictoryChart
            width={screenWidth - 72}
            height={250}
            theme={VictoryTheme.material}
            domainPadding={{ x: 40 }}
          >
            <VictoryAxis
              style={{
                axis: { stroke: colors.border.medium },
                tickLabels: { fill: colors.text.tertiary, fontSize: 12 },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: colors.border.medium },
                tickLabels: { fill: colors.text.tertiary, fontSize: 12 },
                grid: { stroke: colors.border.light, strokeDasharray: '3,3' },
              }}
              tickFormat={(t) => `${t}%`}
            />
            <VictoryBar
              data={chartData}
              style={{
                data: {
                  fill: ({ datum }) => {
                    if (datum.x === 'Alta') return colors.primary;
                    if (datum.x === 'Media') return colors.warning;
                    return colors.error;
                  },
                },
              }}
              cornerRadius={{ top: 5 }}
            />
          </VictoryChart>
        </Card>
      </View>
    );
  };

  const TabButton = ({ title, active, onPress }) => (
    <Button
      variant={active ? 'primary' : 'secondary'}
      size="sm"
      onPress={onPress}
      style={styles.tabButton}
    >
      {title}
    </Button>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Predicciones</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={loadMockData}
            style={styles.previewButton}
          >
            Vista Previa
          </Button>
        </View>
        <LoadingState message="Cargando predicciones..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Predicciones</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={loadMockData}
            style={styles.previewButton}
          >
            Vista Previa
          </Button>
        </View>
        <ErrorState
          title="Error al cargar predicciones"
          message={error}
          onRetry={loadData}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Predicciones</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={loadMockData}
            style={styles.previewButton}
          >
            Vista Previa
          </Button>
        </View>

        <View style={styles.tabsContainer}>
          <TabButton
            title="Próximos"
            active={activeTab === 'upcoming'}
            onPress={() => setActiveTab('upcoming')}
          />
          <TabButton
            title="Alta Confianza"
            active={activeTab === 'highConfidence'}
            onPress={() => setActiveTab('highConfidence')}
          />
          <TabButton
            title="Precisión"
            active={activeTab === 'accuracy'}
            onPress={() => setActiveTab('accuracy')}
          />
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {activeTab === 'upcoming' && (
            <View style={styles.predictionsContainer}>
              {upcomingPredictions.length > 0 ? (
                upcomingPredictions.map(renderPredictionCard)
              ) : (
                <EmptyState
                  title="No hay predicciones"
                  message="No hay predicciones disponibles para próximos partidos"
                />
              )}
            </View>
          )}

          {activeTab === 'highConfidence' && (
            <View style={styles.predictionsContainer}>
              <Text style={styles.sectionDescription}>
                Predicciones con nivel de confianza superior al 70%
              </Text>
              {highConfidencePredictions.length > 0 ? (
                highConfidencePredictions.map(renderPredictionCard)
              ) : (
                <EmptyState
                  title="No hay predicciones de alta confianza"
                  message="No hay predicciones de alta confianza disponibles en este momento"
                />
              )}
            </View>
          )}

          {activeTab === 'accuracy' && renderAccuracyStats()}
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
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  previewButton: {
    minWidth: 44,
    minHeight: 44,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.sm,
  },
  tabButton: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  predictionsContainer: {
    padding: spacing.base,
  },
  sectionDescription: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.base,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  predictionCard: {
    marginBottom: spacing.base,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  teamsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  teamName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.semiBold,
  },
  vs: {
    color: colors.text.disabled,
    fontSize: typography.fontSize.sm,
    marginHorizontal: spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  predictionBody: {
    gap: spacing.md,
  },
  probabilitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  probabilityItem: {
    alignItems: 'center',
  },
  probabilityLabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  probabilityValue: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
  },
  expectedGoalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.base,
  },
  expectedGoalsLabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
  },
  expectedGoalsValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
  },
  outcomeContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  outcomeLabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  outcomeValue: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.bold,
  },
  accuracySection: {
    padding: spacing.base,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.base,
  },
  accuracyOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  accuracyCard: {
    flex: 1,
    alignItems: 'center',
  },
  accuracyLabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  accuracyValue: {
    color: colors.primary,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
  },
  chartContainer: {
    marginTop: spacing.base,
  },
  chartTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
});
