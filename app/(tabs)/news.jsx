import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import { LoadingState, EmptyState, ErrorState, Button } from '../../components/ui';
import NewsCard from '../../components/NewsCard';
import { fetchFootballNews, getFallbackNews } from '../../services/newsService';
import { colors, typography, spacing } from '../../styles/theme';
import { Newspaper } from 'lucide-react-native';
import { useResponsiveValue, useGridColumns, useIsTablet } from '../../utils/responsive';

// Category mapping for filtering
const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'GOLPERUoficial', label: 'GOL Perú' },
  { id: 'Mercado_Ingles', label: 'Mercado' },
  { id: 'goal', label: 'Goal' },
  { id: 'FabrizioRomano', label: 'Fabrizio' },
  { id: 'Fichajes_futbol', label: 'Fichajes' },
  { id: 'TransferMarket es', label: 'Transfermarkt' },
];

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Responsive values
  const isTablet = useIsTablet();
  const numColumns = useGridColumns();
  const containerPadding = useResponsiveValue({ base: spacing.base, md: spacing.xl });

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [selectedCategory, news]);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNews = await fetchFootballNews();
      if (fetchedNews?.length) {
        setNews(fetchedNews);
      } else {
        setNews(getFallbackNews());
      }
    } catch (err) {
      console.error('Error cargando noticias:', err);
      setError('No se pudieron cargar las noticias');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    if (selectedCategory === 'all') {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(item => 
        item.username.includes(selectedCategory)
      );
      setFilteredNews(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const handleRetry = () => {
    loadNews();
  };

  const openLink = async (item) => {
    const url = item.url;
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Error al abrir el enlace:', err);
    }
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const renderNewsItem = ({ item }) => (
    <View style={[
      styles.newsItemWrapper,
      isTablet && { width: numColumns === 2 ? '48%' : '31%' }
    ]}>
      <NewsCard item={item} onPress={() => openLink(item)} />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            onPress={() => handleCategoryPress(category.id)}
            style={styles.filterButton}
          >
            {category.label}
          </Button>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Noticias</Text>
        </View>

        {/* Loading State */}
        {loading && !refreshing && (
          <LoadingState message="Cargando noticias..." />
        )}

        {/* Error State */}
        {!loading && error && (
          <ErrorState
            title="Error al cargar noticias"
            message={error}
            onRetry={handleRetry}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredNews.length === 0 && (
          <EmptyState
            icon={<Newspaper size={64} color={colors.text.tertiary} />}
            title="No hay noticias"
            message={
              selectedCategory === 'all'
                ? 'No se encontraron noticias disponibles'
                : 'No hay noticias en esta categoría'
            }
            action={
              selectedCategory !== 'all' && (
                <Button
                  variant="primary"
                  size="md"
                  onPress={() => setSelectedCategory('all')}
                >
                  Ver todas las noticias
                </Button>
              )
            }
          />
        )}

        {/* News List */}
        {!loading && !error && filteredNews.length > 0 && (
          <FlatList
            data={filteredNews}
            renderItem={renderNewsItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={[
              styles.listContent,
              isTablet && styles.listContentTablet,
              { paddingHorizontal: containerPadding }
            ]}
            numColumns={isTablet ? numColumns : 1}
            key={isTablet ? `grid-${numColumns}` : 'list'}
            columnWrapperStyle={isTablet ? styles.columnWrapper : null}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  filterContainer: {
    marginBottom: spacing.base,
  },
  filterScrollContent: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  filterButton: {
    marginRight: spacing.sm,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  listContentTablet: {
    paddingHorizontal: 0,
  },
  newsItemWrapper: {
    width: '100%',
    marginBottom: spacing.base,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
});
