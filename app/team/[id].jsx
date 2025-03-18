import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getTeamDetails, getTeamPlayers } from '../../services/teams';

const TeamDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        // Cargar detalles del equipo y jugadores en paralelo
        const [teamResponse, playersResponse] = await Promise.all([
          getTeamDetails(id),
          getTeamPlayers(id)
        ]);
        
        setTeam(teamResponse.team || teamResponse);
        setPlayers(playersResponse.players || []);
      } catch (err) {
        console.error(`Error cargando equipo ${id}:`, err);
        setError('No se pudo cargar la información del equipo');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [id]);

  // Renderizar pantalla de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff87" />
        <Text style={styles.loadingText}>Cargando información del equipo...</Text>
      </View>
    );
  }

  // Renderizar pantalla de error
  if (error || !team) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No se encontró información del equipo'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        title: team.name || 'Detalle del Equipo',
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#fff'
      }} />
      
      <ScrollView style={styles.container}>
        {/* Cabecera del equipo */}
        <View style={styles.header}>
          <Image 
            source={{ uri: team.logo || 'https://via.placeholder.com/150' }} 
            style={styles.teamLogo} 
            resizeMode="contain"
          />
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamInfo}>
            {team.country || 'País no disponible'} • {team.founded ? `Fundado en ${team.founded}` : 'Año de fundación no disponible'}
          </Text>
        </View>
        
        {/* Información del equipo */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información del Club</Text>
          <View style={styles.infoGrid}>
            <InfoItem title="Estadio" value={team.venue?.name || 'No disponible'} />
            <InfoItem title="Capacidad" value={team.venue?.capacity ? `${team.venue.capacity.toLocaleString()} espectadores` : 'No disponible'} />
            <InfoItem title="Ciudad" value={team.city || 'No disponible'} />
            <InfoItem title="Liga" value={team.league?.name || 'No disponible'} />
            <InfoItem title="Entrenador" value={team.coach?.name || 'No disponible'} />
            <InfoItem title="Presidente" value={team.president || 'No disponible'} />
          </View>
        </View>
        
        {/* Estadísticas del equipo (si están disponibles) */}
        {team.statistics && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            <View style={styles.statsGrid}>
              {Object.entries(team.statistics).map(([key, value], index) => (
                <StatBox key={index} title={key} value={value} />
              ))}
            </View>
          </View>
        )}
        
        {/* Plantilla de jugadores */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Plantilla ({players.length})</Text>
          
          {players.length > 0 ? (
            <>
              {/* Porteros */}
              <PlayerGroup 
                title="Porteros" 
                players={players.filter(p => p.position === 'Portero' || p.position === 'POR')}
                onPlayerPress={(playerId) => router.push(`/player/${playerId}`)}
              />
              
              {/* Defensas */}
              <PlayerGroup 
                title="Defensas" 
                players={players.filter(p => 
                  p.position === 'Defensa' || 
                  p.position === 'DEF' ||
                  ['LI', 'LD', 'DFC', 'CAD', 'CAI'].includes(p.position)
                )}
                onPlayerPress={(playerId) => router.push(`/player/${playerId}`)}
              />
              
              {/* Mediocampistas */}
              <PlayerGroup 
                title="Mediocampistas" 
                players={players.filter(p => 
                  p.position === 'Mediocampista' || 
                  p.position === 'MED' ||
                  ['MC', 'MCD', 'MCO', 'MI', 'MD'].includes(p.position)
                )}
                onPlayerPress={(playerId) => router.push(`/player/${playerId}`)}
              />
              
              {/* Delanteros */}
              <PlayerGroup 
                title="Delanteros" 
                players={players.filter(p => 
                  p.position === 'Delantero' || 
                  p.position === 'DEL' ||
                  ['DC', 'EI', 'ED', 'SD'].includes(p.position)
                )}
                onPlayerPress={(playerId) => router.push(`/player/${playerId}`)}
              />
              
              {/* Otros (jugadores sin posición definida) */}
              {players.filter(p => !p.position).length > 0 && (
                <PlayerGroup 
                  title="Otros" 
                  players={players.filter(p => !p.position)}
                  onPlayerPress={(playerId) => router.push(`/player/${playerId}`)}
                />
              )}
            </>
          ) : (
            <Text style={styles.noPlayersText}>No hay información de jugadores disponible</Text>
          )}
        </View>
        
        {/* Logros del equipo (si están disponibles) */}
        {team.trophies && team.trophies.length > 0 && (
          <View style={styles.trophiesSection}>
            <Text style={styles.sectionTitle}>Logros y Trofeos</Text>
            {team.trophies.map((trophy, index) => (
              <View key={index} style={styles.trophyItem}>
                <Text style={styles.trophyName}>{trophy.name}</Text>
                <Text style={styles.trophyCount}>{trophy.count || 1}x</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

// Componente para mostrar un grupo de jugadores
const PlayerGroup = ({ title, players, onPlayerPress }) => {
  if (!players || players.length === 0) return null;
  
  return (
    <View style={styles.playerGroup}>
      <Text style={styles.playerGroupTitle}>{title}</Text>
      <FlatList
        data={players}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.playerCard}
            onPress={() => onPlayerPress(item.id)}
          >
            <Image 
              source={{ uri: item.photo || 'https://via.placeholder.com/100' }} 
              style={styles.playerImage}
            />
            <Text style={styles.playerCardName}>{item.name || 'Jugador'}</Text>
            <Text style={styles.playerCardNumber}>
              {item.shirtNumber ? `#${item.shirtNumber}` : ''}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Componente para mostrar estadísticas
const StatBox = ({ title, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

// Componente para items de información
const InfoItem = ({ title, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontFamily: 'Inter_400Regular'
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    marginBottom: 20
  },
  backButton: {
    backgroundColor: '#00ff87',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  backButtonText: {
    color: '#000',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16
  },
  teamLogo: {
    width: 120,
    height: 120,
    marginBottom: 16
  },
  teamName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  teamInfo: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center'
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff87'
  },
  infoGrid: {
    width: '100%'
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    width: '40%'
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    width: '60%',
    textAlign: 'right'
  },
  statsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statBox: {
    width: '48%',
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  statValue: {
    color: '#00ff87',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular'
  },
  playersSection: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  playerGroup: {
    marginBottom: 20
  },
  playerGroupTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12
  },
  playerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 100,
    marginRight: 12
  },
  playerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: '#222'
  },
  playerCardName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginBottom: 2
  },
  playerCardNumber: {
    color: '#00ff87',
    fontSize: 12,
    fontFamily: 'Inter_700Bold'
  },
  noPlayersText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    padding: 20
  },
  trophiesSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24
  },
  trophyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  trophyName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular'
  },
  trophyCount: {
    color: '#00ff87',
    fontSize: 14,
    fontFamily: 'Inter_700Bold'
  }
});

export default TeamDetailScreen;