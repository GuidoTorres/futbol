import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Users, TrendingUp, BarChart3, Share2 } from "lucide-react-native";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory-native";
import { colors, typography, spacing, borderRadius, shadows } from "../../styles/theme";
import { useResponsiveValue, useScreenDimensions } from "../../utils/responsive";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingState from "../../components/ui/LoadingState";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import StatCard from "../../components/StatCard";
import PlayerAvatar from "../../components/PlayerAvatar";
import TeamLogo from "../../components/TeamLogo";
import { searchPlayersForComparison, comparePlayers } from "../../services/comparison";

// Mock data for preview
const MOCK_PLAYER_1 = {
  id: 1,
  name: "Lionel Messi",
  position: "Delantero",
  team: "Inter Miami",
  photo: "https://cdn.sofifa.net/players/158/023/25_120.png",
};

const MOCK_PLAYER_2 = {
  id: 2,
  name: "Cristiano Ronaldo",
  position: "Delantero",
  team: "Al Nassr",
  photo: "https://cdn.sofifa.net/players/020/801/25_120.png",
};

const MOCK_COMPARISON_DATA = {
  statistics: [
    {
      playerId: 1,
      playerName: "Lionel Messi",
      comparisonMetrics: {
        goals: 28,
        assists: 16,
        passAccuracy: 87.5,
        tackles: 12,
        interceptions: 8,
        shots: 142,
      },
    },
    {
      playerId: 2,
      playerName: "Cristiano Ronaldo",
      comparisonMetrics: {
        goals: 35,
        assists: 11,
        passAccuracy: 82.3,
        tackles: 8,
        interceptions: 5,
        shots: 168,
      },
    },
  ],
  insights: {
    strengths: {
      1: {
        playerId: 1,
        playerName: "Lionel Messi",
        strengths: [
          { metric: "Asistencias", value: "16", advantage: "+5" },
          { metric: "Precisión Pases", value: "87.5%", advantage: "+5.2%" },
          { metric: "Entradas", value: "12", advantage: "+4" },
        ],
      },
      2: {
        playerId: 2,
        playerName: "Cristiano Ronaldo",
        strengths: [
          { metric: "Goles", value: "35", advantage: "+7" },
          { metric: "Tiros", value: "168", advantage: "+26" },
          { metric: "Remates a puerta", value: "92", advantage: "+15" },
        ],
      },
    },
  },
};

const MOCK_SEARCH_RESULTS = [
  {
    id: 3,
    name: "Kylian Mbappé",
    position: "Delantero",
    team: "Real Madrid",
    photo: "https://cdn.sofifa.net/players/231/747/25_120.png",
  },
  {
    id: 4,
    name: "Erling Haaland",
    position: "Delantero",
    team: "Manchester City",
    photo: "https://cdn.sofifa.net/players/239/085/25_120.png",
  },
  {
    id: 5,
    name: "Neymar Jr",
    position: "Delantero",
    team: "Al Hilal",
    photo: "https://cdn.sofifa.net/players/190/871/25_120.png",
  },
];

export default function ComparisonScreen() {
  const [entityType, setEntityType] = useState("players"); // "players" or "teams"
  const [entity1, setEntity1] = useState(null);
  const [entity2, setEntity2] = useState(null);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [searchResults1, setSearchResults1] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [showSearch1, setShowSearch1] = useState(false);
  const [showSearch2, setShowSearch2] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { width } = useScreenDimensions();
  const padding = useResponsiveValue({ base: spacing.base, md: spacing.xl });

  // Function to load mock data for preview
  const loadMockData = () => {
    setEntity1(MOCK_PLAYER_1);
    setEntity2(MOCK_PLAYER_2);
    setComparisonData(MOCK_COMPARISON_DATA);
  };

  // Load comparison when both entities are selected
  useEffect(() => {
    if (entity1 && entity2) {
      loadComparison();
    } else {
      setComparisonData(null);
    }
  }, [entity1, entity2]);

  const loadComparison = async () => {
    try {
      setLoading(true);
      setError(null);

      if (entityType === "players") {
        const response = await comparePlayers([entity1.id, entity2.id]);
        setComparisonData(response.data);
      }
      // Add team comparison logic here when available
    } catch (err) {
      console.error("Error loading comparison:", err);
      setError(err.message || "Error al cargar la comparación");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch1 = async (query) => {
    setSearchQuery1(query);

    if (query.length < 2) {
      setSearchResults1([]);
      return;
    }

    try {
      const response = await searchPlayersForComparison(query);
      setSearchResults1(response.data || response || []);
    } catch (err) {
      console.error("Error searching:", err);
      // Use mock data on error for preview
      setSearchResults1(MOCK_SEARCH_RESULTS);
    }
  };

  const handleSearch2 = async (query) => {
    setSearchQuery2(query);

    if (query.length < 2) {
      setSearchResults2([]);
      return;
    }

    try {
      const response = await searchPlayersForComparison(query);
      setSearchResults2(response.data || response || []);
    } catch (err) {
      console.error("Error searching:", err);
      // Use mock data on error for preview
      setSearchResults2(MOCK_SEARCH_RESULTS);
    }
  };

  const selectEntity1 = (entity) => {
    setEntity1(entity);
    setSearchQuery1("");
    setSearchResults1([]);
    setShowSearch1(false);
  };

  const selectEntity2 = (entity) => {
    setEntity2(entity);
    setSearchQuery2("");
    setSearchResults2([]);
    setShowSearch2(false);
  };

  const clearEntity1 = () => {
    setEntity1(null);
    setSearchQuery1("");
    setSearchResults1([]);
  };

  const clearEntity2 = () => {
    setEntity2(null);
    setSearchQuery2("");
    setSearchResults2([]);
  };

  const handleShare = async () => {
    if (!entity1 || !entity2 || !comparisonData) return;

    try {
      // Build detailed comparison message
      const stats1 = comparisonData.statistics?.[0]?.comparisonMetrics || {};
      const stats2 = comparisonData.statistics?.[1]?.comparisonMetrics || {};

      const message = `⚽ Comparación de Jugadores\n\n${entity1.name} vs ${entity2.name}\n\n` +
        `Goles: ${stats1.goals || 0} - ${stats2.goals || 0}\n` +
        `Asistencias: ${stats1.assists || 0} - ${stats2.assists || 0}\n` +
        `Precisión Pases: ${(stats1.passAccuracy || 0).toFixed(1)}% - ${(stats2.passAccuracy || 0).toFixed(1)}%\n\n` +
        `Compara más jugadores en nuestra app!`;
      
      if (Platform.OS === "web") {
        // Web share API
        if (navigator.share) {
          await navigator.share({
            title: "Comparación de Jugadores",
            text: message,
          });
        } else {
          // Fallback for browsers without share API
          await navigator.clipboard.writeText(message);
          alert("Comparación copiada al portapapeles");
        }
      } else {
        // Native share
        await Share.share({
          message,
          title: "Comparación de Jugadores",
        });
      }
    } catch (err) {
      if (err.message !== "User did not share") {
        console.error("Error sharing:", err);
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>Comparación</Text>
          <Text style={styles.subtitle}>Compara jugadores o equipos lado a lado</Text>
        </View>
        <Button
          variant="ghost"
          size="sm"
          onPress={loadMockData}
          style={styles.previewButton}
        >
          Vista Previa
        </Button>
      </View>
    </View>
  );

  const renderComparisonHeader = () => (
    <View style={styles.comparisonHeader}>
      <View style={styles.comparisonHeaderEntity}>
        <PlayerAvatar uri={entity1.photo} name={entity1.name} size="lg" border />
        <Text style={styles.comparisonHeaderName}>{entity1.name}</Text>
      </View>

      <View style={styles.comparisonHeaderVs}>
        <Text style={styles.comparisonHeaderVsText}>VS</Text>
      </View>

      <View style={styles.comparisonHeaderEntity}>
        <PlayerAvatar uri={entity2.photo} name={entity2.name} size="lg" border />
        <Text style={styles.comparisonHeaderName}>{entity2.name}</Text>
      </View>
    </View>
  );

  const renderStatisticsComparison = () => {
    if (!comparisonData?.statistics) return null;

    const stats1 = comparisonData.statistics[0]?.comparisonMetrics || {};
    const stats2 = comparisonData.statistics[1]?.comparisonMetrics || {};

    const statKeys = [
      { key: "goals", label: "Goles" },
      { key: "assists", label: "Asistencias" },
      { key: "passAccuracy", label: "Precisión Pases", isPercentage: true },
      { key: "tackles", label: "Entradas" },
      { key: "interceptions", label: "Intercepciones" },
      { key: "shots", label: "Tiros" },
    ];

    return (
      <View style={styles.statisticsSection}>
        <Text style={styles.sectionTitle}>Estadísticas Clave</Text>

        <View style={styles.statsGrid}>
          {statKeys.map(({ key, label, isPercentage }) => {
            const value1 = stats1[key] || 0;
            const value2 = stats2[key] || 0;
            const better1 = value1 > value2;
            const better2 = value2 > value1;

            return (
              <View key={key} style={styles.statRow}>
                <View style={[styles.statValue, better1 && styles.statValueBetter]}>
                  <Text style={[styles.statNumber, better1 && styles.statNumberBetter]}>
                    {isPercentage ? `${value1.toFixed(1)}%` : value1.toFixed(1)}
                  </Text>
                </View>

                <Text style={styles.statLabel}>{label}</Text>

                <View style={[styles.statValue, better2 && styles.statValueBetter]}>
                  <Text style={[styles.statNumber, better2 && styles.statNumberBetter]}>
                    {isPercentage ? `${value2.toFixed(1)}%` : value2.toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderComparisonCharts = () => {
    if (!comparisonData?.statistics) return null;

    const stats1 = comparisonData.statistics[0]?.comparisonMetrics || {};
    const stats2 = comparisonData.statistics[1]?.comparisonMetrics || {};

    const chartData = [
      {
        category: "Goles",
        player1: stats1.goals || 0,
        player2: stats2.goals || 0,
      },
      {
        category: "Asist.",
        player1: stats1.assists || 0,
        player2: stats2.assists || 0,
      },
      {
        category: "Tiros",
        player1: stats1.shots || 0,
        player2: stats2.shots || 0,
      },
      {
        category: "Entradas",
        player1: stats1.tackles || 0,
        player2: stats2.tackles || 0,
      },
    ];

    return (
      <View style={styles.chartsSection}>
        <Text style={styles.sectionTitle}>Comparación Visual</Text>

        <View style={styles.chartContainer}>
          <VictoryChart
            width={width - padding * 2}
            height={250}
            domainPadding={{ x: 30 }}
            theme={VictoryTheme.material}
          >
            <VictoryAxis
              style={{
                axis: { stroke: colors.border.light },
                tickLabels: {
                  fill: colors.text.secondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.regular,
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: colors.border.light },
                tickLabels: {
                  fill: colors.text.secondary,
                  fontSize: 12,
                  fontFamily: typography.fontFamily.regular,
                },
                grid: { stroke: colors.border.light, strokeDasharray: "4,4" },
              }}
            />
            <VictoryBar
              data={chartData}
              x="category"
              y="player1"
              style={{
                data: { fill: colors.primary },
              }}
              barWidth={15}
            />
            <VictoryBar
              data={chartData}
              x="category"
              y="player2"
              style={{
                data: { fill: colors.info },
              }}
              barWidth={15}
            />
          </VictoryChart>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>{entity1.name}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colors.info }]} />
              <Text style={styles.legendText}>{entity2.name}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderStrengthsWeaknesses = () => {
    if (!comparisonData?.insights?.strengths) return null;

    const strengths = comparisonData.insights.strengths;
    const player1Strengths = Object.values(strengths).find(
      (s) => s.playerId === entity1.id
    );
    const player2Strengths = Object.values(strengths).find(
      (s) => s.playerId === entity2.id
    );

    return (
      <View style={styles.strengthsSection}>
        <Text style={styles.sectionTitle}>Fortalezas y Debilidades</Text>

        <View style={styles.strengthsGrid}>
          <View style={styles.strengthsColumn}>
            <Text style={styles.strengthsColumnTitle}>{entity1.name}</Text>
            {player1Strengths?.strengths?.slice(0, 3).map((strength, index) => (
              <View key={index} style={styles.strengthItem}>
                <TrendingUp size={16} color={colors.success} />
                <Text style={styles.strengthText}>{strength.metric}</Text>
                <Text style={styles.strengthValue}>{strength.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.strengthsColumn}>
            <Text style={styles.strengthsColumnTitle}>{entity2.name}</Text>
            {player2Strengths?.strengths?.slice(0, 3).map((strength, index) => (
              <View key={index} style={styles.strengthItem}>
                <TrendingUp size={16} color={colors.success} />
                <Text style={styles.strengthText}>{strength.metric}</Text>
                <Text style={styles.strengthValue}>{strength.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderEntityTypeSelector = () => (
    <View style={styles.entityTypeSelector}>
      <Button
        variant={entityType === "players" ? "primary" : "secondary"}
        size="md"
        onPress={() => setEntityType("players")}
        style={styles.entityTypeButton}
      >
        <Users size={18} color={entityType === "players" ? "#000" : colors.text.primary} />
        <Text
          style={[
            styles.entityTypeText,
            { color: entityType === "players" ? "#000" : colors.text.primary },
          ]}
        >
          Jugadores
        </Text>
      </Button>

      <Button
        variant={entityType === "teams" ? "primary" : "secondary"}
        size="md"
        onPress={() => setEntityType("teams")}
        style={styles.entityTypeButton}
      >
        <Users size={18} color={entityType === "teams" ? "#000" : colors.text.primary} />
        <Text
          style={[
            styles.entityTypeText,
            { color: entityType === "teams" ? "#000" : colors.text.primary },
          ]}
        >
          Equipos
        </Text>
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding }]}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderEntityTypeSelector()}

        {/* Entity Selectors */}
        <View style={styles.selectorsContainer}>
          {renderEntitySelector(
            1,
            entity1,
            searchQuery1,
            searchResults1,
            showSearch1,
            handleSearch1,
            selectEntity1,
            clearEntity1,
            () => setShowSearch1(!showSearch1)
          )}

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {renderEntitySelector(
            2,
            entity2,
            searchQuery2,
            searchResults2,
            showSearch2,
            handleSearch2,
            selectEntity2,
            clearEntity2,
            () => setShowSearch2(!showSearch2)
          )}
        </View>

        {/* Comparison Display */}
        {entity1 && entity2 && !loading && !error && comparisonData && (
          <View style={styles.comparisonContainer}>
            {renderComparisonHeader()}
            {renderStatisticsComparison()}
            {renderComparisonCharts()}
            {renderStrengthsWeaknesses()}
          </View>
        )}

        {/* Loading State */}
        {loading && <LoadingState message="Cargando comparación..." />}

        {/* Error State */}
        {error && (
          <ErrorState
            title="Error al cargar"
            message={error}
            onRetry={loadComparison}
          />
        )}

        {/* Empty State */}
        {!entity1 && !entity2 && !loading && (
          <EmptyState
            icon={<Users size={64} color={colors.text.tertiary} />}
            title="Comienza a comparar"
            message={`Selecciona dos ${entityType === "players" ? "jugadores" : "equipos"} para ver una comparación detallada`}
          />
        )}
      </ScrollView>

      {/* Share Button */}
      {entity1 && entity2 && comparisonData && (
        <View style={styles.shareButtonContainer}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleShare}
            icon={<Share2 size={20} color="#000" />}
          >
            Compartir Comparación
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const renderEntitySelector = (
  number,
  entity,
  searchQuery,
  searchResults,
  showSearch,
  onSearch,
  onSelect,
  onClear,
  toggleSearch
) => {
  return (
    <View style={styles.entitySelector}>
      <Text style={styles.selectorLabel}>
        {number === 1 ? "Primer" : "Segundo"} {entity ? "seleccionado" : "selector"}
      </Text>

      {!entity ? (
        <>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={toggleSearch}
            accessible={true}
            accessibilityLabel={`Seleccionar ${number === 1 ? "primer" : "segundo"} jugador`}
            accessibilityRole="button"
          >
            <Users size={32} color={colors.text.tertiary} />
            <Text style={styles.selectButtonText}>
              Buscar {number === 1 ? "primer" : "segundo"} jugador
            </Text>
          </TouchableOpacity>

          {showSearch && (
            <View style={styles.searchContainer}>
              <Input
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChangeText={onSearch}
                clearable
                autoFocus
              />

              {searchResults.length > 0 && (
                <ScrollView
                  style={styles.searchResults}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {searchResults.slice(0, 5).map((result) => (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.searchResultItem}
                      onPress={() => onSelect(result)}
                      accessible={true}
                      accessibilityLabel={`Seleccionar ${result.name}`}
                      accessibilityRole="button"
                    >
                      <PlayerAvatar uri={result.photo} name={result.name} size="sm" />
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultName}>{result.name}</Text>
                        <Text style={styles.searchResultDetails}>
                          {result.position} • {result.team}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.selectedEntity}>
          <PlayerAvatar uri={entity.photo} name={entity.name} size="xl" border />
          <Text style={styles.selectedEntityName}>{entity.name}</Text>
          <Text style={styles.selectedEntityDetails}>
            {entity.position} • {entity.team}
          </Text>
          <Button
            variant="outline"
            size="sm"
            onPress={onClear}
            style={styles.changeButton}
          >
            Cambiar
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingBottom: spacing["2xl"],
  },

  header: {
    marginBottom: spacing.xl,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  previewButton: {
    marginTop: spacing.xs,
  },

  title: {
    fontSize: typography.fontSize["3xl"],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  subtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },

  entityTypeSelector: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  entityTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },

  entityTypeText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    marginLeft: spacing.xs,
  },

  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["3xl"],
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },

  placeholderText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },

  selectorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  entitySelector: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    ...shadows.base,
  },

  selectorLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  selectButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: "dashed",
    borderRadius: borderRadius.md,
    minHeight: 120,
  },

  selectButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  searchContainer: {
    marginTop: spacing.md,
  },

  searchResults: {
    maxHeight: 250,
    marginTop: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },

  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: borderRadius.base,
    marginBottom: spacing.xs,
  },

  searchResultInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  searchResultName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },

  searchResultDetails: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  selectedEntity: {
    alignItems: "center",
    paddingVertical: spacing.base,
  },

  selectedEntityName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
    textAlign: "center",
  },

  selectedEntityDetails: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: "center",
  },

  changeButton: {
    marginTop: spacing.md,
    minWidth: 100,
  },

  vsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },

  vsText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: "#000",
  },

  shareButtonContainer: {
    padding: spacing.base,
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  comparisonContainer: {
    marginBottom: spacing.xl,
  },

  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.base,
  },

  comparisonHeaderEntity: {
    flex: 1,
    alignItems: "center",
  },

  comparisonHeaderName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginTop: spacing.sm,
    textAlign: "center",
  },

  comparisonHeaderVs: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.md,
    ...shadows.lg,
  },

  comparisonHeaderVsText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: "#000",
  },

  statisticsSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.base,
  },

  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },

  statsGrid: {
    gap: spacing.md,
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },

  statValue: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.base,
    backgroundColor: colors.background.tertiary,
  },

  statValueBetter: {
    backgroundColor: colors.primary,
  },

  statNumber: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },

  statNumberBetter: {
    color: "#000",
  },

  statLabel: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    textAlign: "center",
    marginHorizontal: spacing.sm,
  },

  chartsSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.base,
  },

  chartContainer: {
    alignItems: "center",
  },

  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xl,
    marginTop: spacing.md,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  legendText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },

  strengthsSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.base,
  },

  strengthsGrid: {
    flexDirection: "row",
    gap: spacing.md,
  },

  strengthsColumn: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },

  strengthsColumnTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },

  strengthText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },

  strengthValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
  },
});
