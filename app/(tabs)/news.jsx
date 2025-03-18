import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchFootballNews, getFallbackNews } from '../../services/newsService';

export default function NewsScreen() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const fetchedNews = await fetchFootballNews();
      if (fetchedNews?.length) {
        setNews(fetchedNews);
      } else {
        setNews(getFallbackNews());
        setError(true);
      }
    } catch (err) {
      console.error('Error cargando noticias:', err);
      setNews(getFallbackNews());
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const openLink = async (item) => {
    const url = item.url;
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Error al abrir el enlace:', err);
    }
  };

  const getDefaultUrl = (source, username) => {
    switch (source) {
      case 'twitter':
        return `https://twitter.com/${username.replace('@', '')}`;
      default:
        return 'https://www.google.com/search?q=football+news';
    }
  };

  const renderPost = (item) => {
    const getSourceIcon = () => {
      if (item.source === 'twitter')
        return 'https://freelogopng.com/images/all_img/1690643777twitter-x-logo-png.png';
      return 'https://via.placeholder.com/20';
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.postCard}
        onPress={() => openLink(item)}
      >
        <View style={styles.postHeader}>
          <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
          <View style={styles.postHeaderText}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Image source={{ uri: getSourceIcon() }} style={styles.socialIcon} />
        </View>
        <Text style={styles.postContent}>{item.content}</Text>

        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        ) : null}
        <View style={styles.postStats}>
          {item.likes ? (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statText}>
                {typeof item.likes === 'number'
                  ? item.likes.toLocaleString()
                  : item.likes}
              </Text>
            </View>
          ) : null}
          {item.source === 'twitter' && item.retweets ? (
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔁</Text>
              <Text style={styles.statText}>
                {typeof item.retweets === 'number'
                  ? item.retweets.toLocaleString()
                  : item.retweets}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Noticias de Fútbol</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#00ff87']}
              tintColor="#00ff87"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00ff87" />
              <Text style={styles.loadingText}>Cargando noticias...</Text>
            </View>
          ) : news.length > 0 ? (
            <>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>
                    Usando datos de muestra. Tira para actualizar.
                  </Text>
                </View>
              )}
              {news.map(renderPost)}
            </>
          ) : (
            <Text style={styles.noNews}>No hay noticias disponibles</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    color: '#00ff87',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 255, 135, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshText: {
    color: '#00ff87',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 87, 51, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 51, 0.3)',
  },
  errorText: {
    color: '#ff5733',
    fontSize: 13,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#1d1d1d',
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  postHeaderText: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  socialIcon: {
    width: 20,
    height: 20,
    opacity: 0.8,
  },
  postContent: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    padding: 12,
    fontFamily: 'Inter_400Regular',
  },
  postDescription: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postStats: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    marginRight: 5,
    fontSize: 14,
  },
  statText: {
    color: '#888',
    fontSize: 13,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  noNews: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
});
