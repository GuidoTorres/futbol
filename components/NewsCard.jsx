import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card } from "./ui";
import { colors, typography, spacing, borderRadius } from "../styles/theme";

/**
 * NewsCard Component
 * Displays a news item with image, title, summary, date, and source
 */
const NewsCard = ({ item, onPress }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Card
      variant="elevated"
      padding="sm"
      onPress={onPress}
      pressable={true}
      style={styles.card}
    >
      {/* Featured Image */}
      {item.image && !imageError && (
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imagePlaceholder}>
              <View style={styles.placeholderShimmer} />
            </View>
          )}
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            onError={handleImageError}
            onLoad={handleImageLoad}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Header with profile and source */}
        <View style={styles.header}>
          <Image
            source={{ uri: item.profilePic }}
            style={styles.profilePic}
            onError={() => {}}
          />
          <View style={styles.headerText}>
            <Text style={styles.username} numberOfLines={1}>
              {item.username}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        </View>

        {/* Title/Content */}
        <Text style={styles.title} numberOfLines={4}>
          {item.content}
        </Text>

        {/* Stats */}
        {(item.likes || item.retweets) && (
          <View style={styles.stats}>
            {item.likes && (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>❤️</Text>
                <Text style={styles.statText}>
                  {typeof item.likes === "number"
                    ? item.likes.toLocaleString()
                    : item.likes}
                </Text>
              </View>
            )}
            {item.retweets && (
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🔁</Text>
                <Text style={styles.statText}>
                  {typeof item.retweets === "number"
                    ? item.retweets.toLocaleString()
                    : item.retweets}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.base,
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: colors.background.tertiary,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderShimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background.elevated,
    opacity: 0.5,
  },

  content: {
    padding: spacing.md,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  profilePic: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    backgroundColor: colors.background.tertiary,
  },

  headerText: {
    flex: 1,
  },

  username: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: 2,
  },

  timestamp: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.tertiary,
  },

  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
    marginBottom: spacing.sm,
  },

  stats: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.base,
  },

  statIcon: {
    fontSize: typography.fontSize.sm,
    marginRight: spacing.xs,
  },

  statText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.tertiary,
  },
});

export default NewsCard;
