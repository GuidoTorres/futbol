import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.emptyState}>
        <Heart size={64} color="#333" />
        <Text style={styles.emptyTitle}>Sin Favoritos</Text>
        <Text style={styles.emptyDescription}>
          Añade partidos y equipos a tus favoritos para verlos aquí
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Explorar Partidos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    marginTop: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyDescription: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: '#00ff87',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});