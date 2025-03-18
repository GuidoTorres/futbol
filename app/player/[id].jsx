import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { getSofaScorePlayerById } from '../../services/players';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

const PlayerDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleteInfo, setShowCompleteInfo] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const data = await getSofaScorePlayerById(id, showCompleteInfo);
        setPlayer(data.player || data);
      } catch (err) {
        console.error(`Error cargando jugador ${id}:`, err);
        setError('No se pudo cargar la información del jugador');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id, showCompleteInfo]);

  // Renderizar pantalla de carga
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff87" />
        <Text style={styles.loadingText}>Cargando información del jugador...</Text>
      </View>
    );
  }

  // Renderizar pantalla de error
  if (error || !player) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No se encontró información del jugador'}</Text>
      </View>
    );
  }

  // Formatear fecha de nacimiento si está disponible
  const birthDate = player.birthDate ? new Date(player.birthDate) : null;
  const formattedBirthDate = birthDate ? birthDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'No disponible';

  // Preparar datos para el gráfico si están disponibles
  const careerData = player.transfers ? player.transfers.map(t => ({
    season: new Date(t.date).getFullYear().toString(),
    team: t.toTeam?.name || 'Desconocido',
    value: 1 // Solo para visualización
  })) : [];

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{
        title: player.name || 'Detalle del Jugador',
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#fff'
      }} />

      <View style={styles.header}>
        <Image 
          source={{ uri: player.photo || 'https://via.placeholder.com/150' }} 
          style={styles.playerImage} 
        />
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.playerInfo}>
          {player.position || player.positionCategory || 'Jugador'} 
          {player.shirtNumber ? ` • #${player.shirtNumber}` : ''}
        </Text>
        
        {player.TeamId && (
          <TouchableOpacity 
            style={styles.teamButton}
            onPress={() => router.push(`/team/${player.TeamId}`)}
          >
            <Text style={styles.teamButtonText}>{player.Team?.name || 'Ver equipo'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.infoGrid}>
          <InfoItem title="Nombre completo" value={player.fullName || player.name} />
          <InfoItem title="Nacionalidad" value={player.nationality || 'No disponible'} />
          <InfoItem title="Fecha de nacimiento" value={formattedBirthDate} />
          <InfoItem title="Edad" value={player.age ? `${player.age} años` : 'No disponible'} />
          <InfoItem title="Altura" value={player.height ? `${player.height} cm` : 'No disponible'} />
          <InfoItem title="Peso" value={player.weight ? `${player.weight} kg` : 'No disponible'} />
          <InfoItem title="Pie dominante" value={player.foot || 'No disponible'} />
        </View>
      </View>

      {player.statistics && Object.keys(player.statistics).length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsGrid}>
            {Object.entries(player.statistics).map(([key, value], index) => (
              <StatBox key={index} title={key} value={value} />
            ))}
          </View>
        </View>
      )}

      {careerData.length > 0 && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Trayectoria</Text>
          <View style={styles.chartContainer}>
            <VictoryChart width={screenWidth - 32}>
              <VictoryLine
                data={careerData}
                x="season"
                y="value"
                style={{
                  data: { stroke: '#00ff87', strokeWidth: 2 },
                  labels: { fill: 'white' }
                }}
              />
              <VictoryAxis
                style={{
                  axis: { stroke: '#444' },
                  tickLabels: { fill: 'white', fontSize: 10 }
                }}
              />
            </VictoryChart>
          </View>
        </View>
      )}

      {player.transfers && player.transfers.length > 0 && (
        <View style={styles.careerSection}>
          <Text style={styles.sectionTitle}>Historial de Transferencias</Text>
          {player.transfers.map((transfer, index) => (
            <TransferItem key={index} transfer={transfer} />
          ))}
        </View>
      )}

      {!showCompleteInfo && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={() => setShowCompleteInfo(true)}
        >
          <Text style={styles.loadMoreButtonText}>Cargar información completa</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const StatBox = ({ title, value }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

const InfoItem = ({ title, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{title}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const TransferItem = ({ transfer }) => {
  const formattedDate = transfer.date ? 
    new Date(transfer.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) :
    'Fecha desconocida';
    
  return (
    <View style={styles.transferItem}>
      <Text style={styles.transferDate}>{formattedDate}</Text>
      <View style={styles.transferTeams}>
        <Text style={styles.transferTeam}>{transfer.fromTeam?.name || 'Desconocido'}</Text>
        <Text style={styles.transferArrow}>→</Text>
        <Text style={styles.transferTeam}>{transfer.toTeam?.name || 'Desconocido'}</Text>
      </View>
      <Text style={styles.transferFee}>{transfer.fee || 'Tarifa no divulgada'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 16
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
    fontFamily: 'Inter_400Regular'
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  playerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    backgroundColor: '#1a1a1a'
  },
  playerName: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
    textAlign: 'center'
  },
  playerInfo: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8
  },
  teamButton: {
    backgroundColor: '#00ff87',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8
  },
  teamButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold'
  },
  statsContainer: {
    marginBottom: 24,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16
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
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  chartTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold'
  },
  chartSection: {
    marginBottom: 24
  },
  careerSection: {
    marginBottom: 24
  },
  transferItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12
  },
  transferDate: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8
  },
  transferTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  transferTeam: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold'
  },
  transferArrow: {
    color: '#00ff87',
    fontSize: 18,
    marginHorizontal: 8
  },
  transferFee: {
    color: '#00ff87',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold'
  },
  loadMoreButton: {
    backgroundColor: '#00ff87',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30
  },
  loadMoreButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold'
  }
});

export default PlayerDetailScreen;