import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { 
  comparePlayers, 
  generateRadarChart, 
  generateVisualization,
  exportComparison,
  generateShareableReport
} from '../../services/comparison';

const { width } = Dimensions.get('window');

export default function ComparisonResultsScreen() {
  const params = useLocalSearchParams();
  const [comparisonData, setComparisonData] = useState(null);
  const [radarData, setRadarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('radar');

  const playerIds = JSON.parse(params.playerIds || '[]');
  const playerNames = JSON.parse(params.playerNames || '[]');

  useEffect(() => {
    loadComparisonData();
  }, []);

  const loadComparisonData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        season: '2024-2025',
        normalizeByPosition: true
      };

      // Load comparison data
      const comparisonResponse = await comparePlayers(playerIds, filters);
      setComparisonData(comparisonResponse.data);

      // Load radar chart data
      const radarResponse = await generateRadarChart(playerIds, filters);
      setRadarData(radarResponse.data);

    } catch (error) {
      console.error('Error loading comparison data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos de comparación');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      if (!comparisonData) {
        Alert.alert('Error', 'No hay datos de comparación para exportar');
        return;
      }

      const exportResult = await exportComparison(comparisonData, format);
      
      if (format === 'json') {
        Alert.alert('Exportación Exitosa', 'Los datos se han exportado en formato JSON');
      } else {
        Alert.alert('Exportación Preparada', `El reporte en formato ${format.toUpperCase()} está listo`);
      }
    } catch (error) {
      console.error('Error exporting comparison:', error);
      Alert.alert('Error', 'No se pudo exportar la comparación');
    }
  };

  const handleShare = async () => {
    try {
      if (!comparisonData) {
        Alert.alert('Error', 'No hay datos de comparación para compartir');
        return;
      }

      const shareableReport = await generateShareableReport(comparisonData);
      
      Alert.alert(
        'Compartir Comparación',
        shareableReport.data.summary,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Compartir', onPress: () => {
            // In a real app, you would use the Share API here
            console.log('Sharing:', shareableReport.data);
          }}
        ]
      );
    } catch (error) {
      console.error('Error generating shareable report:', error);
      Alert.alert('Error', 'No se pudo generar el reporte para compartir');
    }
  };

  const showExportOptions = () => {
    Alert.alert(
      'Exportar Comparación',
      'Selecciona el formato de exportación',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'JSON', onPress: () => handleExport('json') },
        { text: 'PDF', onPress: () => handleExport('pdf') },
        { text: 'PNG', onPress: () => handleExport('png') }
      ]
    );
  };

  const renderStatCard = (label, value, isPercentage = false) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {typeof value === 'number' ? 
          (isPercentage ? `${value.toFixed(1)}%` : value.toFixed(1)) : 
          value || '0'
        }
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderPlayerOverview = (playerData, index) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const color = colors[index % colors.length];

    return (
      <View key={playerData.playerId} style={[styles.playerOverview, { borderLeftColor: color }]}>
        <View style={styles.playerHeader}>
          <View style={[styles.playerColorIndicator, { backgroundColor: color }]} />
          <View>
            <Text style={styles.playerOverviewName}>{playerData.playerName}</Text>
            <Text style={styles.playerOverviewDetails}>
              {playerData.position} • {playerData.team}
            </Text>
          </View>
        </View>

        <View style={styles.playerStats}>
          {renderStatCard('Goles', playerData.comparisonMetrics?.goals)}
          {renderStatCard('Asistencias', playerData.comparisonMetrics?.assists)}
          {renderStatCard('Precisión Pases', playerData.comparisonMetrics?.passAccuracy, true)}
          {renderStatCard('Entradas', playerData.comparisonMetrics?.tackles)}
        </View>
      </View>
    );
  };

  const renderRadarChart = () => {
    if (!radarData || !radarData.players) {
      return (
        <View style={styles.chartPlaceholder}>
          <Ionicons name="analytics-outline" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>Gráfico radar no disponible</Text>
        </View>
      );
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

    return (
      <View style={styles.radarContainer}>
        <Text style={styles.chartTitle}>Comparación por Métricas</Text>
        
        {/* Radar Chart Placeholder - In a real app, you'd use a chart library like react-native-chart-kit */}
        <View style={styles.radarChartPlaceholder}>
          <View style={styles.radarCenter}>
            <Text style={styles.radarCenterText}>Gráfico Radar</Text>
            <Text style={styles.radarSubtext}>
              {radarData.metrics?.length || 0} métricas
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.radarLegend}>
          {radarData.players.map((player, index) => (
            <View key={player.playerId} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors[index] }]} />
              <Text style={styles.legendText}>{player.playerName}</Text>
            </View>
          ))}
        </View>

        {/* Metrics List */}
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>Métricas Analizadas:</Text>
          <View style={styles.metricsList}>
            {radarData.metrics?.map((metric, index) => (
              <View key={index} style={styles.metricItem}>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricCategory}>{metric.category}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderInsights = () => {
    if (!comparisonData?.insights) {
      return (
        <View style={styles.chartPlaceholder}>
          <Ionicons name="bulb-outline" size={48} color="#ccc" />
          <Text style={styles.placeholderText}>Análisis no disponible</Text>
        </View>
      );
    }

    const insights = comparisonData.insights;

    return (
      <View style={styles.insightsContainer}>
        <Text style={styles.chartTitle}>Análisis de Rendimiento</Text>

        {/* Top Performers */}
        {insights.topPerformers && (
          <View style={styles.insightSection}>
            <Text style={styles.insightSectionTitle}>Mejores en cada métrica:</Text>
            {Object.entries(insights.topPerformers).slice(0, 5).map(([metric, data]) => (
              <View key={metric} style={styles.topPerformerItem}>
                <Text style={styles.topPerformerMetric}>
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Text>
                <Text style={styles.topPerformerPlayer}>
                  {data.playerName} ({data.value})
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Player Strengths */}
        {insights.strengths && (
          <View style={styles.insightSection}>
            <Text style={styles.insightSectionTitle}>Fortalezas por jugador:</Text>
            {Object.entries(insights.strengths).map(([playerId, data]) => (
              <View key={playerId} style={styles.strengthItem}>
                <Text style={styles.strengthPlayer}>{data.playerName}</Text>
                {data.strengths?.slice(0, 2).map((strength, index) => (
                  <Text key={index} style={styles.strengthText}>
                    • {strength.metric}: {strength.value} ({strength.advantage})
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Overall Summary */}
        {insights.overall?.summary && (
          <View style={styles.insightSection}>
            <Text style={styles.insightSectionTitle}>Resumen:</Text>
            <Text style={styles.summaryText}>{insights.overall.summary}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {comparisonData?.statistics?.map((playerData, index) => 
              renderPlayerOverview(playerData, index)
            )}
          </View>
        );
      case 'radar':
        return renderRadarChart();
      case 'insights':
        return renderInsights();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Cargando comparación...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Comparación</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={showExportOptions} style={styles.headerButton}>
            <Ionicons name="download-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Player Names Header */}
      <View style={styles.playersHeader}>
        <Text style={styles.playersHeaderText}>
          {playerNames.join(' vs ')}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Resumen
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'radar' && styles.activeTab]}
          onPress={() => setActiveTab('radar')}
        >
          <Text style={[styles.tabText, activeTab === 'radar' && styles.activeTabText]}>
            Radar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
            Análisis
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  playersHeader: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  playersHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  playerOverview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  playerOverviewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  playerOverviewDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  radarContainer: {
    padding: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  radarChartPlaceholder: {
    height: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  radarCenter: {
    alignItems: 'center',
  },
  radarCenterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  radarSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  radarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  metricsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  metricsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  metricCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  insightsContainer: {
    padding: 20,
  },
  insightSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  insightSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  topPerformerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  topPerformerMetric: {
    fontSize: 14,
    color: '#666',
  },
  topPerformerPlayer: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  strengthItem: {
    marginBottom: 15,
  },
  strengthPlayer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  strengthText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chartPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
  },
});