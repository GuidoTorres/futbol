import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import TeamLogo from "./TeamLogo";
import Badge from "./ui/Badge";
import { colors, typography, spacing, borderRadius, shadows } from "../styles/theme";

/**
 * MatchCard Component
 * Displays match information with team logos, score, status, and league
 */
const MatchCard = ({
  match,
  variant = "detailed",
  onPress,
  style,
  ...props
}) => {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      onPress(match);
    } else if (match?.id) {
      router.push(`/match/${match.id}`);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
      case "en vivo":
      case "in_play":
        return "error";
      case "finished":
      case "finalizado":
      case "ft":
        return "default";
      case "scheduled":
      case "próximo":
      case "upcoming":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
      case "in_play":
        return "En Vivo";
      case "finished":
      case "ft":
        return "Finalizado";
      case "scheduled":
      case "upcoming":
        return "Próximo";
      default:
        return status || "Próximo";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      // Handle if dateString is already a Date object
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      });
    } catch (error) {
      return "";
    }
  };

  if (!match) return null;

  const {
    homeTeam,
    awayTeam,
    homeScore,
    awayScore,
    status,
    league,
    competition,
    date,
    time,
  } = match;

  const isCompact = variant === "compact";
  const statusText = getStatusText(status);
  const statusVariant = getStatusBadgeVariant(status);
  const leagueName = league?.name || competition?.name || "";
  const matchDate = formatDate(date) || "";

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Partido: ${homeTeam?.name || "Equipo local"} vs ${awayTeam?.name || "Equipo visitante"}`}
        style={[styles.container, isCompact && styles.compactContainer, style]}
        {...props}
      >
        {/* League/Competition */}
        {leagueName && !isCompact && (
          <View style={styles.leagueContainer}>
            <Text style={styles.leagueText} numberOfLines={1}>
              {leagueName}
            </Text>
            {statusText && (
              <Badge variant={statusVariant} size="sm">
                {statusText}
              </Badge>
            )}
          </View>
        )}

        {/* Match Content */}
        <View style={styles.matchContent}>
          {/* Home Team */}
          <View style={styles.teamContainer}>
            <TeamLogo
              uri={homeTeam?.logo || homeTeam?.logoUrl}
              size={isCompact ? "sm" : "md"}
              rounded
            />
            <Text
              style={[styles.teamName, isCompact && styles.compactTeamName]}
              numberOfLines={isCompact ? 1 : 2}
            >
              {homeTeam?.name || homeTeam?.shortName || "TBD"}
            </Text>
          </View>

          {/* Score or Time */}
          <View style={styles.scoreContainer}>
            {status === "finished" || status === "live" || status === "in_play" ? (
              <View style={styles.scoreBox}>
                <Text style={styles.scoreText}>
                  {homeScore ?? 0} - {awayScore ?? 0}
                </Text>
              </View>
            ) : (
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{String(time || matchDate || "")}</Text>
              </View>
            )}
          </View>

          {/* Away Team */}
          <View style={styles.teamContainer}>
            <TeamLogo
              uri={awayTeam?.logo || awayTeam?.logoUrl}
              size={isCompact ? "sm" : "md"}
              rounded
            />
            <Text
              style={[styles.teamName, isCompact && styles.compactTeamName]}
              numberOfLines={isCompact ? 1 : 2}
            >
              {awayTeam?.name || awayTeam?.shortName || "TBD"}
            </Text>
          </View>
        </View>

        {/* Compact Status Badge */}
        {isCompact && statusText && (
          <View style={styles.compactStatusContainer}>
            <Badge variant={statusVariant} size="sm">
              {statusText}
            </Badge>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    ...shadows.base,
  },

  compactContainer: {
    padding: spacing.md,
  },

  leagueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },

  leagueText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },

  matchContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  teamContainer: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
  },

  teamName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    textAlign: "center",
  },

  compactTeamName: {
    fontSize: typography.fontSize.xs,
  },

  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.md,
  },

  scoreBox: {
    backgroundColor: colors.background.elevated,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.base,
    minWidth: 70,
  },

  scoreText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
    textAlign: "center",
  },

  timeBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  timeText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.secondary,
    textAlign: "center",
  },

  compactStatusContainer: {
    marginTop: spacing.sm,
    alignItems: "center",
  },
});

// Memoize component to prevent unnecessary re-renders
export default React.memo(MatchCard, (prevProps, nextProps) => {
  // Only re-render if match data actually changed
  return (
    prevProps.match?.id === nextProps.match?.id &&
    prevProps.match?.status === nextProps.match?.status &&
    prevProps.match?.homeScore === nextProps.match?.homeScore &&
    prevProps.match?.awayScore === nextProps.match?.awayScore &&
    prevProps.variant === nextProps.variant
  );
});
