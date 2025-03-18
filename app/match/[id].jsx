import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VictoryPie, VictoryChart, VictoryLine, VictoryAxis, VictoryLegend, VictoryBar, VictoryGroup } from 'victory-native';
import { Svg, Rect, Line, Circle, Path } from 'react-native-svg';
import { useMatches, EXAMPLE_MATCH } from '../../hooks/useMatches';

// Usamos EXAMPLE_MATCH de useMatches.js en lugar de duplicar los datos aquí
const MATCH_DATA = EXAMPLE_MATCH;

const { width: screenWidth } = Dimensions.get('window');

// Componente para el campo de fútbol con las alineaciones
function FootballField({ homeTeam, awayTeam }) {
  const fieldWidth = screenWidth - 32;
  const fieldHeight = fieldWidth * 1.5; // Proporción mejorada del campo
  const playerSize = 28; // Tamaño ligeramente aumentado para mejor visibilidad
  
  // Función para crear líneas de formación - ahora continuas en lugar de punteadas
  const renderFormationLines = (players, isHome) => {
    // Agrupar jugadores por posición general (defensa, mediocampo, delantero)
    const defenders = players.filter(p => p.position.includes('D') || p.position.includes('LI') || p.position.includes('LD'));
    const midfielders = players.filter(p => p.position.includes('M'));
    const forwards = players.filter(p => p.position.includes('E') || p.position === 'DC');
    const goalkeeper = players.find(p => p.position === 'POR');
    
    // Crear líneas para visualizar la formación - ahora continuas y más visibles
    return (
      <>
        {/* Línea de portero */}
        {goalkeeper && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.90 : fieldHeight * 0.10}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.90 : fieldHeight * 0.10}
            stroke={isHome ? "#00ff87aa" : "#ff4d4daa"}
            strokeWidth="1.5"
          />
        )}
        
        {/* Línea de defensa */}
        {defenders.length > 0 && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.75 : fieldHeight * 0.25}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.75 : fieldHeight * 0.25}
            stroke={isHome ? "#00ff87aa" : "#ff4d4daa"}
            strokeWidth="1.5"
          />
        )}
        
        {/* Línea de mediocampo */}
        {midfielders.length > 0 && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.60 : fieldHeight * 0.40}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.60 : fieldHeight * 0.40}
            stroke={isHome ? "#00ff87aa" : "#ff4d4daa"}
            strokeWidth="1.5"
          />
        )}
        
        {/* Línea de delantera */}
        {forwards.length > 0 && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.45 : fieldHeight * 0.55}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.45 : fieldHeight * 0.55}
            stroke={isHome ? "#00ff87aa" : "#ff4d4daa"}
            strokeWidth="1.5"
          />
        )}
      </>
    );
  };

  // Función mejorada para calcular posiciones de jugadores para evitar superposiciones
  const calculatePositions = () => {
    // Crear copias para no modificar los originales
    const homePlayers = JSON.parse(JSON.stringify(homeTeam.players || []));
    const awayPlayers = JSON.parse(JSON.stringify(awayTeam.players || []));
    
    // Posicionar porteros
    const homeGK = homePlayers.find(p => p.position === 'POR');
    if (homeGK) {
      homeGK.x = 50;
      homeGK.y = 88;  // Ligeramente ajustado para mejor alineación
    }
    
    const awayGK = awayPlayers.find(p => p.position === 'POR');
    if (awayGK) {
      awayGK.x = 50;
      awayGK.y = 12;  // Ligeramente ajustado para mejor alineación
    }
    
    // Función mejorada para posicionar jugadores - asegura centrado correcto
    const positionPlayers = (players, yPosition, isHome) => {
      if (!players.length) return;
      
      // Si hay un solo jugador, centrarlo
      if (players.length === 1) {
        players[0].x = 50;
        players[0].y = yPosition;
        return;
      }
      
      // Para múltiples jugadores, centrarlos mejor
      const centeredPositions = [];
      const totalWidth = 70; // Ancho total disponible (%)
      const margin = (100 - totalWidth) / 2; // Margen para centrar (15% a cada lado)
      const increment = totalWidth / (players.length - 1); // Espacio entre jugadores
      
      // Para formaciones con pocos o muchos jugadores, ajustar
      for (let i = 0; i < players.length; i++) {
        let x;
        
        if (players.length === 1) {
          x = 50; // Un solo jugador siempre al centro
        } else if (players.length === 2) {
          x = (i === 0) ? 40 : 60; // Dos jugadores, uno a cada lado del centro
        } else if (players.length === 3) {
          x = margin + (increment * i); // Tres jugadores, distribuidos uniformemente
        } else if (players.length === 4) {
          // Cuatro jugadores con distribución especial para mayor simetría
          const positions = [25, 42, 58, 75];
          x = positions[i];
        } else if (players.length === 5) {
          // Cinco jugadores con distribución especial para mayor simetría
          const positions = [20, 35, 50, 65, 80];
          x = positions[i];
        } else {
          // Distribución genérica para otros casos
          x = margin + (increment * i);
        }
        
        players[i].x = x;
        players[i].y = yPosition;
      }
    };
    
    // Home team positions - con posiciones ajustadas
    const homeDefenders = homePlayers.filter(p => p.position.includes('D') || p.position.includes('LI') || p.position.includes('LD'));
    const homeMidfielders = homePlayers.filter(p => p.position.includes('M'));
    const homeForwards = homePlayers.filter(p => p.position.includes('E') || p.position === 'DC');
    
    positionPlayers(homeDefenders, 75, true);
    positionPlayers(homeMidfielders, 60, true);
    positionPlayers(homeForwards, 45, true);
    
    // Away team positions - con posiciones ajustadas
    const awayDefenders = awayPlayers.filter(p => p.position.includes('D') || p.position.includes('LI') || p.position.includes('LD'));
    const awayMidfielders = awayPlayers.filter(p => p.position.includes('M'));
    const awayForwards = awayPlayers.filter(p => p.position.includes('E') || p.position === 'DC');
    
    positionPlayers(awayDefenders, 25, false);
    positionPlayers(awayMidfielders, 40, false);
    positionPlayers(awayForwards, 55, false);
    
    return { homePlayers, awayPlayers };
  };

  // Calcular posiciones de jugadores
  const { homePlayers, awayPlayers } = calculatePositions();

  const renderPlayer = (player, isHome) => (
    <View
      key={player.id}
      style={{
        position: 'absolute',
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: [
          { translateX: -playerSize / 2 },
          { translateY: -playerSize / 2 }
        ],
        alignItems: 'center',
        zIndex: 10,
      }}>
      <View style={[
        styles.playerCircle,
        { 
          width: playerSize - 6,  // Reducido el tamaño de los círculos
          height: playerSize - 6, // Reducido el tamaño de los círculos
          borderColor: isHome ? '#00ff87' : '#ff4d4d',
          backgroundColor: isHome ? '#00ff8744' : '#ff4d4d44',
          borderWidth: 1.5
        }
      ]}>
        <Text style={[styles.playerNumberText, { fontSize: 11 }]}>{player.number}</Text>
      </View>
      <Text style={[
        styles.playerName,
        {
          backgroundColor: isHome ? '#00ff8788' : '#ff4d4d88',
          paddingHorizontal: 3,
          paddingVertical: 1,
          borderRadius: 3,
          marginTop: 3,
          overflow: 'hidden',
          fontSize: 10
        }
      ]}>
        {player.name}
      </Text>
    </View>
  );

  return (
    <View style={[styles.field, { width: fieldWidth, height: fieldHeight }]}>
      <Svg width={fieldWidth} height={fieldHeight}>
        {/* Fondo del campo mejorado con textura de césped */}
        <Rect
          x="0"
          y="0"
          width={fieldWidth}
          height={fieldHeight}
          fill="#1c5c2e"
          stroke="#fff"
          strokeWidth="2"
        />
        
        {/* Patrón de césped mejorado */}
        {[...Array(20)].map((_, i) => (
          <Rect
            key={`stripe-${i}`}
            x="0"
            y={i * (fieldHeight / 20)}
            width={fieldWidth}
            height={fieldHeight / 40}
            fill="#164a24"
            opacity={0.8}
          />
        ))}
        
        {/* Línea central */}
        <Line
          x1="0"
          y1={fieldHeight / 2}
          x2={fieldWidth}
          y2={fieldHeight / 2}
          stroke="#fff"
          strokeWidth="1.5"
        />
        
        {/* Círculo central */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight / 2}
          r={fieldWidth / 8}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Punto central */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight / 2}
          r={3}
          fill="#fff"
        />
        
        {/* Áreas de penalti más pequeñas y proporcionales */}
        <Rect
          x={fieldWidth * 0.32}
          y="0"
          width={fieldWidth * 0.36}
          height={fieldHeight * 0.12}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        <Rect
          x={fieldWidth * 0.32}
          y={fieldHeight * 0.88}
          width={fieldWidth * 0.36}
          height={fieldHeight * 0.12}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Áreas pequeñas */}
        <Rect
          x={fieldWidth * 0.40}
          y="0"
          width={fieldWidth * 0.20}
          height={fieldHeight * 0.05}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        <Rect
          x={fieldWidth * 0.40}
          y={fieldHeight * 0.95}
          width={fieldWidth * 0.20}
          height={fieldHeight * 0.05}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Puntos de penalti */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight * 0.12}
          r={2.5}
          fill="#fff"
        />
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight * 0.88}
          r={2.5}
          fill="#fff"
        />
        
        {/* Semicírculos del área - reemplazados por arcos correctos */}
        <Path
          d={`M ${fieldWidth * 0.38} ${fieldHeight * 0.12} A ${fieldWidth * 0.12} ${fieldWidth * 0.12} 0 0 1 ${fieldWidth * 0.62} ${fieldHeight * 0.12}`}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d={`M ${fieldWidth * 0.38} ${fieldHeight * 0.88} A ${fieldWidth * 0.12} ${fieldWidth * 0.12} 0 0 0 ${fieldWidth * 0.62} ${fieldHeight * 0.88}`}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Corners con arcos en lugar de círculos completos */}
        <Path
          d={`M 0 ${5} A 5 5 0 0 1 ${5} 0`}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d={`M ${fieldWidth} ${5} A 5 5 0 0 0 ${fieldWidth - 5} 0`}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d={`M 0 ${fieldHeight - 5} A 5 5 0 0 0 ${5} ${fieldHeight}`}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d={`M ${fieldWidth} ${fieldHeight - 5} A 5 5 0 0 1 ${fieldWidth - 5} ${fieldHeight}`}
          stroke="#fff"
          strokeWidth="1.5"
          fill="none"
        />
        
        {/* Líneas de formación mejoradas */}
        {renderFormationLines(homeTeam.players, true)}
        {renderFormationLines(awayTeam.players, false)}
      </Svg>
      
      {/* Jugadores con posiciones calculadas para evitar superposiciones */}
      {homePlayers.map(player => renderPlayer(player, true))}
      {awayPlayers.map(player => renderPlayer(player, false))}
    </View>
  );
}

const MatchDetailScreen = () => {
    const params = useLocalSearchParams();
    const { id } = params;
    const [match, setMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getMatchById } = useMatches();
    const [activeTab, setActiveTab] = useState('alineaciones');
    // Hook para el sub-tab de alineaciones
    const [activeSubTab, setActiveSubTab] = useState('campo');
    // State para la vista de equipo en la lista de jugadores
    const [teamView, setTeamView] = useState('home');
    // Hook para el submenu de estadísticas (debe estar aquí para evitar errores de hooks)
    const [statsSubTab, setStatsSubTab] = useState('resumen');
    
    // Efecto para cargar los datos del partido específico
    useEffect(() => {
      const fetchMatchData = async () => {
        setIsLoading(true);
        try {
          // Ahora getMatchById ya devuelve datos completos con EXAMPLE_MATCH como respaldo
          const matchData = await getMatchById(id);
          console.log('Datos completos del partido:', matchData);
          setMatch(matchData);
        } catch (error) {
          console.error('Error al cargar los datos del partido:', error);
          // En caso de error, usar los datos de ejemplo
          setMatch(EXAMPLE_MATCH);
        } finally {
          setIsLoading(false);
        }
      };

      fetchMatchData();
    }, [id, getMatchById]);
    
    // Verificar si se están cargando los datos
    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212'}}>
          <ActivityIndicator size="large" color="#00ff87" />
          <Text style={{color: 'white', fontSize: 16, marginTop: 12}}>Cargando datos del partido...</Text>
        </View>
      );
    }
    
    // Verificar si match tiene datos de homeTeam y awayTeam antes de renderizar
    if (!match || !match.homeTeam || !match.awayTeam) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212'}}>
          <Text style={{color: 'white', fontSize: 16}}>No se pudieron cargar los datos del partido</Text>
        </View>
      );
    }

  // Aseguramos que existan las propiedades antes de usarlas
  const statsData = [
    { 
      x: 'Posesión', 
      home: match.stats?.possession?.home || 0, 
      away: match.stats?.possession?.away || 0 
    },
    { 
      x: 'Tiros', 
      home: match.stats?.shots?.home || 0, 
      away: match.stats?.shots?.away || 0 
    },
    { 
      x: 'A Puerta', 
      home: match.stats?.shotsOnTarget?.home || 0, 
      away: match.stats?.shotsOnTarget?.away || 0 
    },
    { 
      x: 'Córners', 
      home: match.stats?.corners?.home || 0, 
      away: match.stats?.corners?.away || 0 
    },
    { 
      x: 'Pases', 
      home: match.stats?.passes?.home || 0, 
      away: match.stats?.passes?.away || 0 
    },
  ];
  
  // Traducción para estadísticas detalladas - movido aquí arriba para que esté disponible en todas las secciones
  const statTranslations = {
    possession: 'Posesión',
    shots: 'Tiros',
    shotsOnTarget: 'Tiros a Puerta',
    corners: 'Córners',
    fouls: 'Faltas',
    yellowCards: 'Tarjetas Amarillas',
    redCards: 'Tarjetas Rojas',
    offsides: 'Fueras de Juego',
    saves: 'Paradas',
    passes: 'Pases',
    passAccuracy: 'Precisión de Pases %'
  };

  // Para visualizar la formación táctica
  const renderFormationVisualizer = (formation, isHome = true) => {
    const parts = formation.split('-');
    return (
      <View style={styles.formationVisualizer}>
        {parts.map((count, index) => (
          <View key={index} style={styles.formationRow}>
            {[...Array(parseInt(count, 10))].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.formationDot, 
                  { backgroundColor: isHome ? '#00ff87' : '#ff4d4d' }
                ]} 
              />
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Componente de pestaña
  const TabButton = ({ title, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, active && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
  
  // SubTab button component
  const SubTabButton = ({ title, active, onPress }) => (
    <TouchableOpacity
      style={[styles.subTabButton, active && styles.activeSubTabButton]}
      onPress={onPress}
    >
      <Text style={[styles.subTabButtonText, active && styles.activeSubTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Render player list item component
  const PlayerListItem = ({ player, isStarter = false }) => (
    <TouchableOpacity style={styles.playerListItem}>
      <View style={styles.playerNumberBox}>
        <Text style={styles.playerNumberBoxText}>{player.number}</Text>
      </View>
      <Image source={{ uri: player.image }} style={styles.playerListImage} />
      <View style={styles.playerListInfo}>
        <Text style={styles.playerListName}>{player.name}</Text>
        <Text style={styles.playerListPosition}>{player.position}</Text>
      </View>
      {isStarter && (
        <View style={styles.starterBadge}>
          <Text style={styles.starterBadgeText}>Titular</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  const CoachCard = ({ coach, teamName }) => (
    <TouchableOpacity style={styles.coachCard}>
      <Image source={{ uri: coach.image }} style={styles.coachImage} />
      <View style={styles.coachInfo}>
        <Text style={styles.coachName}>{coach.name}</Text>
        <Text style={styles.coachTeam}>{teamName}</Text>
        <Text style={styles.coachDetails}>{coach.nationality}, {coach.age} años</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render staff member component
  const StaffMember = ({ member }) => (
    <View style={styles.staffMember}>
      <Image source={{ uri: member.image }} style={styles.staffImage} />
      <Text style={styles.staffName}>{member.name}</Text>
      <Text style={styles.staffRole}>{member.role}</Text>
    </View>
  );
  
  
  // Render content based on active sub-tab
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'campo':
        return (
          <>
            <FootballField homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
          </>
        );
      case 'jugadores':
        return (
          <>
            <View style={styles.teamSelectorContainer}>
              <TouchableOpacity 
                style={[
                  styles.teamSelectorButton, 
                  { backgroundColor: teamView === 'home' ? '#00ff87' : '#333' }
                ]}
                onPress={() => setTeamView('home')}
              >
                <Text style={[
                  styles.teamSelectorText,
                  { color: teamView === 'home' ? '#000' : '#fff' }
                ]}>
                  {match.homeTeam.name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.teamSelectorButton, 
                  { backgroundColor: teamView === 'away' ? '#ff4d4d' : '#333' }
                ]}
                onPress={() => setTeamView('away')}
              >
                <Text style={[
                  styles.teamSelectorText,
                  { color: teamView === 'away' ? '#000' : '#fff' }
                ]}>
                  {match.awayTeam.name}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.playerListContainer}>
              <Text style={styles.playerListHeader}>Titulares</Text>
              {(teamView === 'home' ? match.homeTeam.players : match.awayTeam.players).map(player => (
                <PlayerListItem key={player.id} player={player} isStarter={true} />
              ))}
              
              <Text style={styles.playerListHeader}>Suplentes</Text>
              {(teamView === 'home' ? match.homeTeam.substitutes : match.awayTeam.substitutes).map(player => (
                <PlayerListItem key={player.id} player={player} />
              ))}
            </View>
          </> 
                 );
      case 'entrenadores':
        return (
          <View style={styles.coachesContainer}>
          <Text style={styles.coachesHeader}>Entrenadores</Text>
          <View style={styles.coachCardsContainer}>
            <CoachCard coach={match.homeTeam.coach} teamName={match.homeTeam.name} />
            <CoachCard coach={match.awayTeam.coach} teamName={match.awayTeam.name} />
          </View>

          <Text style={styles.coachesHeader}>Staff Técnico - {match.homeTeam.name}</Text>
          <View style={styles.staffContainer}>
            {match.homeTeam.staffMembers.map((member, index) => (
              <StaffMember key={index} member={member} />
            ))}
          </View>

          <Text style={styles.coachesHeader}>Staff Técnico - {match.awayTeam.name}</Text>
          <View style={styles.staffContainer}>
            {match.awayTeam.staffMembers.map((member, index) => (
              <StaffMember key={index} member={member} />
            ))}
          </View>
        </View>
        );
      default:
        return null;
    }
  };

  // Renderiza el contenido basado en la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'eventos':
        const getEventIcon = (type) => {
          switch (type) {
            case 'goal': return '⚽';
            case 'yellow': return '🟨';
            case 'red': return '🟥';
            case 'substitution': return '🔄';
            default: return '•';
          }
        };
        
        const getEventColor = (type, team) => {
          if (type === 'goal') return team === 'home' ? '#00ff87' : '#ff4d4d';
          if (type === 'yellow') return '#ffdd00';
          if (type === 'red') return '#ff0000';
          if (type === 'substitution') return '#64b5f6';
          return '#ffffff';
        };
        
        // Agrupar eventos por mitad de tiempo
        const firstHalfEvents = match.events.filter(e => {
          const minutes = parseInt(e.time.split('+')[0], 10);
          return minutes <= 45;
        });
        
        const secondHalfEvents = match.events.filter(e => {
          const minutes = parseInt(e.time.split('+')[0], 10);
          return minutes > 45;
        });

        // Renderizar un evento individual
        const renderEvent = (event, index) => {
          return (
            <View key={index} style={styles.event}>
              <Text style={styles.eventTime}>{event.time}'</Text>
              <View style={[
                styles.eventIndicator,
                { backgroundColor: getEventColor(event.type, event.team) }
              ]} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventPlayer}>
                    {event.type === 'substitution' 
                      ? <Text>{event.playerOut} <Text style={{color: '#64b5f6'}}>↔</Text> <Text style={{color: '#4CAF50'}}>{event.playerIn}</Text></Text>
                      : event.player}
                  </Text>
                  <Text style={styles.eventIcon}>
                    {getEventIcon(event.type)}
                  </Text>
                  <View style={styles.eventTeamIndicator}>
                    <View style={[
                      styles.teamDot, 
                      {backgroundColor: event.team === 'home' ? '#00ff87' : '#ff4d4d'}
                    ]} />
                    <Text style={styles.eventTeamName}>
                      {event.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                    </Text>
                  </View>
                </View>
  
                {event.type === 'goal' && event.assist && (
                  <Text style={styles.eventDetail}>Asistencia: {event.assist}</Text>
                )}
                
                {event.type === 'substitution' && event.reason && (
                  <Text style={styles.eventDetail}>Razón: {event.reason}</Text>
                )}
                
                {event.description && (
                  <Text style={styles.eventDescription}>{event.description}</Text>
                )}
              </View>
            </View>
          );
        };
        
        return (
          <View style={styles.tabContent}>
            <View style={styles.eventPeriodContainer}>
              <View style={styles.eventPeriodHeader}>
                <View style={styles.eventPeriodDot} />
                <Text style={styles.eventPeriodTitle}>Primera Mitad</Text>
              </View>
              <View style={styles.events}>
                {firstHalfEvents.length > 0 ? (
                  firstHalfEvents.map(renderEvent)
                ) : (
                  <Text style={styles.noEventsText}>No hay eventos en la primera mitad</Text>
                )}
              </View>
            </View>
            
            <View style={styles.eventPeriodContainer}>
              <View style={styles.eventPeriodHeader}>
                <View style={styles.eventPeriodDot} />
                <Text style={styles.eventPeriodTitle}>Segunda Mitad</Text>
              </View>
              <View style={styles.events}>
                {secondHalfEvents.length > 0 ? (
                  secondHalfEvents.map(renderEvent)
                ) : (
                  <Text style={styles.noEventsText}>No hay eventos en la segunda mitad</Text>
                )}
              </View>
            </View>
          </View>
        );
      case 'estadisticas':
        // Ya estamos usando el state definido al inicio del componente
        
        // Categorías de estadísticas para la pestañas 'avanzado'
        const statCategories = [
          {
            title: "Ataque",
            icon: "⚔️",
            stats: [
              { key: "possession", icon: "⚽" },
              { key: "shots", icon: "🎯" },
              { key: "shotsOnTarget", icon: "🥅" },
              { key: "corners", icon: "🚩" },
              { key: "offsides", icon: "🚫" },
            ]
          },
          {
            title: "Pases",
            icon: "🦶",
            stats: [
              { key: "passes", icon: "🔄" },
              { key: "passAccuracy", icon: "📊" },
            ]
          },
          {
            title: "Disciplina",
            icon: "🧠",
            stats: [
              { key: "fouls", icon: "👊" },
              { key: "yellowCards", icon: "🟨" },
              { key: "redCards", icon: "🟥" },
            ]
          },
          {
            title: "Portería",
            icon: "🧤",
            stats: [
              { key: "saves", icon: "🛡️" },
            ]
          }
        ];
        
        // Función para renderizar una categoría de estadísticas
        const renderStatCategory = (category) => {
          return (
            <View key={category.title} style={styles.statCategoryContainer}>
              <View style={styles.statCategoryHeader}>
                <Text style={styles.statCategoryIcon}>{category.icon}</Text>
                <Text style={styles.statCategoryTitle}>{category.title}</Text>
              </View>
              <View style={styles.detailedStats}>
                {category.stats.map(stat => {
                  // Verificación adicional para evitar error si stats[stat.key] es undefined
                  const value = match.stats && match.stats[stat.key];
                  if (!value) return null;
                  
                  // Verificar si el valor existe
                  if (!value || typeof value !== 'object' || !('home' in value) || !('away' in value)) {
                    return null;
                  }
                  
                  // Calcular la diferencia para destacar mejor equipo
                  const diff = value.home - value.away;
                  const homeBetter = diff > 0;
                  const awayBetter = diff < 0;
                  
                  // Para stats donde número menor es mejor (faltas, tarjetas)
                  const reversedStat = ['fouls', 'yellowCards', 'redCards', 'offsides'].includes(stat.key);
                  
                  return (
                    <View key={stat.key} style={styles.statRow}>
                      <Text style={[
                        styles.statValue,
                        (!reversedStat && homeBetter) || (reversedStat && !homeBetter) ? styles.statValueHighlighted : null
                      ]}>
                        {value.home}
                      </Text>
                      <View style={styles.statLabel}>
                        <Text style={styles.statIcon}>{stat.icon}</Text>
                        <Text style={styles.statLabelText}>
                          {statTranslations[stat.key] || stat.key}
                        </Text>
                      </View>
                      <Text style={[
                        styles.statValue, 
                        (!reversedStat && awayBetter) || (reversedStat && !awayBetter) ? styles.statValueHighlighted : null
                      ]}>
                        {value.away}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        };
        
        // Crea un nuevo conjunto de datos más completo
        const keyStats = [
          { 
            title: 'Posesión', 
            home: match.stats?.possession?.home || 0, 
            away: match.stats?.possession?.away || 0,
            unit: '%',
            icon: '⚽' 
          },
          { 
            title: 'Tiros', 
            home: match.stats?.shots?.home || 0, 
            away: match.stats?.shots?.away || 0,
            unit: '',
            icon: '🎯' 
          },
          { 
            title: 'Tiros a Puerta', 
            home: match.stats?.shotsOnTarget?.home || 0, 
            away: match.stats?.shotsOnTarget?.away || 0,
            unit: '',
            icon: '🥅' 
          },
          { 
            title: 'Precisión de Pases', 
            home: match.stats?.passAccuracy?.home || 0, 
            away: match.stats?.passAccuracy?.away || 0,
            unit: '%',
            icon: '🦶' 
          },
          {
            title: 'Córners',
            home: match.stats?.corners?.home || 0,
            away: match.stats?.corners?.away || 0,
            unit: '',
            icon: '🚩'
          },
          {
            title: 'Faltas',
            home: match.stats?.fouls?.home || 0,
            away: match.stats?.fouls?.away || 0,
            unit: '',
            icon: '👊'
          }
        ];
        
        // Función para renderizar barras de progreso mejoradas
        const renderProgressBar = (stat) => {
          const total = stat.home + stat.away;
          // Asegurar que siempre tengamos al menos un 10% de barra para cada equipo
          const homePercent = total === 0 ? 50 : Math.max(10, Math.min(90, (stat.home / total) * 100));
          const awayPercent = 100 - homePercent;
          
          return (
            <View style={styles.progressBarContainer} key={stat.title}>
              <View style={styles.progressBarLabels}>
                <View style={styles.teamStatValue}>
                  <Text style={[styles.progressBarValue, {color: '#00ff87', textAlign: 'center'}]}>
                    {stat.home}{stat.unit}
                  </Text>
                  <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ff87', marginLeft: 4}} />
                </View>
                <Text style={styles.progressBarTitle}>{stat.icon} {stat.title}</Text>
                <View style={styles.teamStatValue}>
                  <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff4d4d', marginRight: 4}} />
                  <Text style={[styles.progressBarValue, {color: '#ff4d4d', textAlign: 'center'}]}>
                    {stat.away}{stat.unit}
                  </Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressBarHome,
                    { width: `${homePercent}%` }
                  ]} 
                />
                <View 
                  style={[
                    styles.progressBarAway,
                    { width: `${awayPercent}%` }
                  ]} 
                />
              </View>
            </View>
          );
        };
        
        // SubTabs para estadísticas
        const StatsSubTab = ({ title, active, onPress }) => (
          <TouchableOpacity
            style={[styles.statsSubTabButton, active && styles.activeStatsSubTabButton]}
            onPress={onPress}
          >
            <Text style={[styles.statsSubTabText, active && styles.activeStatsSubTabText]}>
              {title}
            </Text>
          </TouchableOpacity>
        );
        
        // Renderizar el contenido según el subtab activo
        const renderStatsContent = () => {
          switch (statsSubTab) {
            case 'resumen':
              return (
                <>
                  {/* Estadísticas clave con barras de progreso */}
                  <View style={styles.statsSection}>
                    <View style={styles.statsHeader}>
                      <View style={styles.teamHeaderItem}>
                        <Image source={{ uri: match.homeTeam.logo }} style={styles.statsTeamLogo} />
                        <Text style={styles.statsTeamName}>{match.homeTeam.name}</Text>
                      </View>
                      <View style={{width: 40}} />
                      <View style={styles.teamHeaderItem}>
                        <Image source={{ uri: match.awayTeam.logo }} style={styles.statsTeamLogo} />
                        <Text style={styles.statsTeamName}>{match.awayTeam.name}</Text>
                      </View>
                    </View>
                    <View style={styles.statsContainer}>
                      {keyStats.map(renderProgressBar)}
                    </View>
                  </View>
                </>
              );
              
            case 'grafico':
              return (
                <>
                  {/* Gráfico de barras mejorado */}
                  <View style={styles.statsSection}>
                    <View style={styles.statsHeader}>
                      <View style={styles.teamHeaderItem}>
                        <Image source={{ uri: match.homeTeam.logo }} style={styles.statsTeamLogo} />
                        <Text style={styles.statsTeamName}>{match.homeTeam.name}</Text>
                      </View>
                      <View style={{width: 40}} />
                      <View style={styles.teamHeaderItem}>
                        <Image source={{ uri: match.awayTeam.logo }} style={styles.statsTeamLogo} />
                        <Text style={styles.statsTeamName}>{match.awayTeam.name}</Text>
                      </View>
                    </View>
                    <View style={styles.statsContainer}>
                      <VictoryChart
                        height={350}
                        padding={{ top: 40, bottom: 80, left: 40, right: 40 }}
                        domainPadding={{ x: 30 }}>
                        <VictoryLegend
                          x={125}
                          y={0}
                          orientation="horizontal"
                          gutter={20}
                          data={[
                            { name: match.homeTeam.name, symbol: { fill: '#00ff87' } },
                            { name: match.awayTeam.name, symbol: { fill: '#ff4d4d' } },
                          ]}
                          style={{
                            labels: { fill: '#fff', fontSize: 12 }
                          }}
                        />
                        <VictoryGroup offset={20}>
                          <VictoryBar
                            data={statsData}
                            y="home"
                            style={{ data: { fill: '#00ff87' } }}
                            cornerRadius={{ top: 3 }}
                            barWidth={20}
                          />
                          <VictoryBar
                            data={statsData}
                            y="away"
                            style={{ data: { fill: '#ff4d4d' } }}
                            cornerRadius={{ top: 3 }}
                            barWidth={20}
                          />
                        </VictoryGroup>
                        <VictoryAxis
                          style={{
                            axis: { stroke: '#444' },
                            tickLabels: { fill: '#999', fontSize: 12, angle: -45, padding: 5 }
                          }}
                        />
                        <VictoryAxis
                          dependentAxis
                          style={{
                            axis: { stroke: '#444' },
                            tickLabels: { fill: '#999', fontSize: 12 },
                            grid: { stroke: '#333', strokeWidth: 0.5 }
                          }}
                        />
                      </VictoryChart>
                    </View>
                  </View>
                </>
              );
              
            case 'avanzado':
              return (
                <View style={styles.statsDetailsContainer}>
                  {/* Categorías de estadísticas - usar las definidas en este contexto */}
                  {statCategories.map(renderStatCategory)}
                </View>
              );
              
            default:
              return null;
          }
        };
        
        return (
          <View style={styles.tabContent}>
            {/* Sub-tabs para estadísticas */}
            <View style={styles.statsSubTabsContainer}>
              <StatsSubTab 
                title="Resumen" 
                active={statsSubTab === 'resumen'} 
                onPress={() => setStatsSubTab('resumen')}
              />
              <StatsSubTab 
                title="Gráfico" 
                active={statsSubTab === 'grafico'} 
                onPress={() => setStatsSubTab('grafico')}
              />
              <StatsSubTab 
                title="Avanzado" 
                active={statsSubTab === 'avanzado'} 
                onPress={() => setStatsSubTab('avanzado')}
              />
            </View>
            
            {/* Contenido del subtab activo */}
            {renderStatsContent()}
          </View>
        );
      case 'detalles':
        // Verificar si las estadísticas están disponibles
        const hasStats = match.stats && typeof match.stats === 'object';
        
        // Usamos la misma estructura de categorías que en estadísticas, pero con otro nombre para evitar conflictos
        const detailsCategories = [
          {
            title: "Ataque",
            icon: "⚔️",
            stats: [
              { key: "possession", icon: "⚽" },
              { key: "shots", icon: "🎯" },
              { key: "shotsOnTarget", icon: "🥅" },
              { key: "corners", icon: "🚩" },
              { key: "offsides", icon: "🚫" },
            ]
          },
          {
            title: "Pases",
            icon: "🦶",
            stats: [
              { key: "passes", icon: "🔄" },
              { key: "passAccuracy", icon: "📊" },
            ]
          },
          {
            title: "Disciplina",
            icon: "🧠",
            stats: [
              { key: "fouls", icon: "👊" },
              { key: "yellowCards", icon: "🟨" },
              { key: "redCards", icon: "🟥" },
            ]
          },
          {
            title: "Portería",
            icon: "🧤",
            stats: [
              { key: "saves", icon: "🛡️" },
            ]
          }
        ];
        
        // Añadir algunos datos adicionales de interés
        const matchInfo = [
          { label: "Fecha", value: "11 de Marzo, 2025" },
          { label: "Competición", value: match.league },
          { label: "Estadio", value: "Santiago Bernabéu" },
          { label: "Asistencia", value: "78,435 espectadores" },
          { label: "Árbitro", value: "Mateu Lahoz" },
        ];
        
        // Renderizar una categoría de estadísticas (versión para detalles)
        const renderDetailCategory = (category) => (
          <View key={category.title} style={styles.statCategoryContainer}>
            <View style={styles.statCategoryHeader}>
              <Text style={styles.statCategoryIcon}>{category.icon}</Text>
              <Text style={styles.statCategoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.detailedStats}>
              {category.stats.map(stat => {
                // Verificación adicional para evitar error si stats[stat.key] es undefined
                const value = match.stats && match.stats[stat.key];
                if (!value) return null;
                
                // Verificar si el valor existe
                if (!value || typeof value !== 'object' || !('home' in value) || !('away' in value)) {
                  return null;
                }
                
                // Calcular la diferencia para destacar mejor equipo
                const diff = value.home - value.away;
                const homeBetter = diff > 0;
                const awayBetter = diff < 0;
                
                // Para stats donde número menor es mejor (faltas, tarjetas)
                const reversedStat = ['fouls', 'yellowCards', 'redCards', 'offsides'].includes(stat.key);
                
                return (
                  <View key={stat.key} style={styles.statRow}>
                    <Text style={[
                      styles.statValue,
                      (!reversedStat && homeBetter) || (reversedStat && !homeBetter) ? styles.statValueHighlighted : null
                    ]}>
                      {value.home}
                    </Text>
                    <View style={styles.statLabel}>
                      <Text style={styles.statIcon}>{stat.icon}</Text>
                      <Text style={styles.statLabelText}>
                        {statTranslations[stat.key] || stat.key}
                      </Text>
                    </View>
                    <Text style={[
                      styles.statValue, 
                      (!reversedStat && awayBetter) || (reversedStat && !awayBetter) ? styles.statValueHighlighted : null
                    ]}>
                      {value.away}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
        
        return (
          <View style={styles.tabContent}>
            {/* Información del partido */}
            <View style={styles.matchInfoContainer}>
              <Text style={styles.matchInfoTitle}>Información del Partido</Text>
              {matchInfo.map((info, index) => (
                <View key={index} style={styles.matchInfoRow}>
                  <Text style={styles.matchInfoLabel}>{info.label}:</Text>
                  <Text style={styles.matchInfoValue}>{info.value}</Text>
                </View>
              ))}
            </View>
            
            {/* Estadísticas agrupadas por categorías */}
            <View style={styles.matchInfoContainer}>
              <Text style={styles.matchInfoTitle}>Estadísticas Detalladas</Text>
              {detailsCategories.map(renderDetailCategory)}
            </View>
          </View>
        );
      case 'alineaciones':
        return (
          <View style={styles.tabContent}>
            {/* Sub-tabs for alineaciones */}
            <View style={styles.subTabsContainer}>
              <SubTabButton 
                title="Campo" 
                active={activeSubTab === 'campo'} 
                onPress={() => setActiveSubTab('campo')}
              />
              <SubTabButton 
                title="Jugadores" 
                active={activeSubTab === 'jugadores'} 
                onPress={() => setActiveSubTab('jugadores')}
              />
              <SubTabButton 
                title="Entrenadores" 
                active={activeSubTab === 'entrenadores'} 
                onPress={() => setActiveSubTab('entrenadores')}
              />
            </View>
            
            {/* Content for the active sub-tab */}
            {renderSubTabContent()}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Match Header - siempre visible */}
        <View style={styles.header}>
          <View style={styles.team}>
            <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName} numberOfLines={1}>{match.homeTeam.name}</Text>
          </View>
          
          <View style={styles.score}>
            <Text style={styles.scoreText}>
              {match.homeTeam.score} - {match.awayTeam.score}
            </Text>
          </View>
          
          <View style={styles.team}>
            <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
            <Text style={styles.teamName} numberOfLines={1}>{match.awayTeam.name}</Text>
          </View>
        </View>

      {/* Tabs Navigation */}
      <View style={styles.tabsContainer}>
        <TabButton 
          title="Eventos" 
          active={activeTab === 'eventos'} 
          onPress={() => setActiveTab('eventos')}
        />
        <TabButton 
          title="Estadísticas" 
          active={activeTab === 'estadisticas'} 
          onPress={() => setActiveTab('estadisticas')}
        />
        <TabButton 
          title="Detalles" 
          active={activeTab === 'detalles'} 
          onPress={() => setActiveTab('detalles')}
        />
        <TabButton 
          title="Alineaciones" 
          active={activeTab === 'alineaciones'} 
          onPress={() => setActiveTab('alineaciones')}
        />
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default MatchDetailScreen;

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
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  teamLogo: {
    width: 50,
    height: 50,
    // Eliminado el borderRadius para mostrar los logos en su forma original
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    maxWidth: '100%',
    borderWidth: "1px"
  },
  score: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 255, 135, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 135, 0.3)',
  },
  scoreText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textShadowColor: 'rgba(0, 255, 135, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 52,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#00ff87',
    backgroundColor: '#292929',
  },
  tabButtonText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  activeTabButtonText: {
    color: '#00ff87',
    fontFamily: 'Inter_600SemiBold',
  },
  // Sub-tabs styling for alineaciones
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 16,
    height: 40,
    padding: 3,
  },
  subTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSubTabButton: {
    backgroundColor: '#3a3a3a',
  },
  subTabButtonText: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  activeSubTabButtonText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  events: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  event: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTime: {
    color: '#888',
    width: 40,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  eventIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  eventText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  statsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  detailedStats: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    width: 50,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  statLabel: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statLabelText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  formationsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
  },
  formationTeam: {
    alignItems: 'center',
  },
  formationLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  formationTeamName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 5,
  },
  formationBox: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#00ff87',
  },
  formationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  field: {
    backgroundColor: '#1a4728',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  playerName: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  playerPosition: {
    color: '#ddd',
    fontSize: 8,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    backgroundColor: '#0008',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  playerCircle: {
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  playerNumberText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  noEventsText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 20,
  },
  // Team selector styles
  teamSelectorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
  teamSelectorButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamSelectorText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // Player list styles
  playerListContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  playerListHeader: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  playerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playerNumberBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00ff87',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerNumberBoxText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  playerListImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerListInfo: {
    flex: 1,
  },
  playerListName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  playerListPosition: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  starterBadge: {
    backgroundColor: '#00ff8733',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  starterBadgeText: {
    color: '#00ff87',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  // Coaches styles
  coachesContainer: {
    width: '100%',
  },
  coachesHeader: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
    marginTop: 20,
  },
  coachCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  coachCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  coachImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#00ff87',
  },
  coachInfo: {
    alignItems: 'center',
  },
  coachName: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  coachTeam: {
    color: '#00ff87',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
  },
  coachDetails: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  // Staff styles
  staffContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  staffMember: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 16,
  },
  staffImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  staffName: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  staffRole: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  // Formación táctica visualización
  formationVisualizer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  formationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  formationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  
  // Eventos mejorados
  eventPeriodContainer: {
    marginBottom: 20,
  },
  eventPeriodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventPeriodDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  eventPeriodTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventPlayer: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  eventIcon: {
    fontSize: 16,
    marginHorizontal: 6,
  },
  eventTeamIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  eventTeamName: {
    color: '#888',
    fontSize: 12,
  },
  eventDetail: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  eventDescription: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Inter_400Regular',
  },
  
  // Estadísticas mejoradas
  statsSection: {
    marginBottom: 24,
  },
  statsSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBarTitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  progressBarValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    width: 60,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressBarHome: {
    backgroundColor: '#00ff87',
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  progressBarAway: {
    backgroundColor: '#ff4d4d',
    height: '100%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  
  // Nuevos estilos para el submenú de estadísticas
  statsSubTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 16,
    height: 40,
    padding: 3,
  },
  statsSubTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  activeStatsSubTabButton: {
    backgroundColor: '#3a3a3a',
  },
  statsSubTabText: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  activeStatsSubTabText: {
    color: '#00ff87',
    fontFamily: 'Inter_600SemiBold',
  },
  teamStatValue: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    justifyContent: 'center',
  },
  statsTeamLogo: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  statsTeamName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  teamHeaderItem: {
    alignItems: 'center',
  },
  statsDetailsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  
  // Detalles del partido
  matchInfoContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  matchInfoTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  matchInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  matchInfoLabel: {
    color: '#888',
    fontSize: 14,
    width: 100,
    fontFamily: 'Inter_400Regular',
  },
  matchInfoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
  },
  statCategoryContainer: {
    marginBottom: 16,
  },
  statCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCategoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  statCategoryTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  statIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  statValueHighlighted: {
    color: '#00ff87',
    fontWeight: 'bold',
  },
});