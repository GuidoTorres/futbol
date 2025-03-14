const MATCH_DATA = {
  homeTeam: {
    name: 'Real Madrid',
    score: 1,
    formation: '4-3-3',
    coach: {
      name: 'Hansi ',
      image: 'https://images.unsplash.com/photo-1615572768141-290c2d38c0b5?w=64&h=64&fit=crop',
      nationality: 'Italia',
      age: 64
    },
    players: [
      // Portero
      { id: 1, name: 'Ter Stegen', number: 1, position: 'POR', x: 50, y: 10, image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop' },
      // Defensa - 4 defensas
      { id: 2, name: 'Koundé', number: 23, position: 'LD', x: 20, y: 25, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 3, name: 'Araújo', number: 4, position: 'DFC', x: 40, y: 25, image: 'https://images.unsplash.com/photo-1507038732509-8b1a9623223a?w=64&h=64&fit=crop' },
      { id: 4, name: 'Christensen', number: 15, position: 'DFC', x: 60, y: 25, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 5, name: 'Baldé', number: 3, position: 'LI', x: 80, y: 25, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      // Mediocampo - 3 centrocampistas
      { id: 6, name: 'Pedri', number: 8, position: 'MC', x: 30, y: 40, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
      { id: 7, name: 'Busquets', number: 5, position: 'MCD', x: 50, y: 40, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop' },
      { id: 8, name: 'De Jong', number: 21, position: 'MC', x: 70, y: 40, image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=64&h=64&fit=crop' },
      // Delanteros - 3 delanteros
      { id: 9, name: 'Ferran', number: 11, position: 'EI', x: 30, y: 50, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
      { id: 10, name: 'Lewandowski', number: 9, position: 'DC', x: 50, y: 50, image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=64&h=64&fit=crop' },
      { id: 11, name: 'Dembélé', number: 7, position: 'ED', x: 70, y: 50, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop' },
    ],
    substitutes: [
      { id: 12, name: 'Iñaki Peña', number: 13, position: 'POR', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64&h=64&fit=crop' },
      { id: 13, name: 'Eric García', number: 24, position: 'DFC', image: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=64&h=64&fit=crop' },
      { id: 14, name: 'Jordi Alba', number: 18, position: 'LI', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop' },
      { id: 15, name: 'Gavi', number: 6, position: 'MC', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop' },
      { id: 16, name: 'Kessié', number: 19, position: 'MCD', image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop' },
      { id: 17, name: 'Pablo Torre', number: 20, position: 'MC', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=64&h=64&fit=crop' },
      { id: 18, name: 'Ansu Fati', number: 10, position: 'EI', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop' },
      { id: 19, name: 'Raphinha', number: 22, position: 'ED', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=64&h=64&fit=crop' },
      { id: 20, name: 'Memphis', number: 14, position: 'DC', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' }
    ],
    staffMembers: [
      { name: 'Óscar Hernández', role: 'Asistente', image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop' },
      { name: 'Sergio Alegre', role: 'Preparador Físico', image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=64&h=64&fit=crop' },
      { name: 'José Ramón de la Fuente', role: 'Entrenador de Porteros', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop' }
    ]
  },
  stats: {
    possession: { home: 55, away: 45 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    corners: { home: 6, away: 4 },
    fouls: { home: 10, away: 12 },
    yellowCards: { home: 2, away: 1 },
    redCards: { home: 0, away: 0 },
    offsides: { home: 3, away: 2 },
    saves: { home: 2, away: 3 },
    passes: { home: 423, away: 389 },
    passAccuracy: { home: 86, away: 83 },
  },
  events: [
    { time: '23', type: 'goal', team: 'home', player: 'Vinicius Jr.', player: 'Modric', description: 'Disparo desde fuera del área' },
    { time: '31', type: 'substitution', team: 'away', playerOut: 'Christensen', playerIn: 'Eric García', reason: 'Lesión' },
    { time: '45+2', type: 'yellow', team: 'away', player: 'Araújo', description: 'Falta táctica sobre Vinicius' },
    { time: '52', type: 'yellow', team: 'home', player: 'Casemiro', description: 'Falta sobre Pedri' },
    { time: '67', type: 'goal', team: 'away', player: 'Lewandowski', assist: 'De Jong', description: 'Remate de cabeza tras centro' },
    { time: '72', type: 'substitution', team: 'home', playerOut: 'Kroos', playerIn: 'Camavinga', reason: 'Táctica' },
    { time: '75', type: 'substitution', team: 'away', playerOut: 'Pedri', playerIn: 'Gavi', reason: 'Táctica' },
    { time: '81', type: 'substitution', team: 'home', playerOut: 'Rodrygo', playerIn: 'Asensio', reason: 'Táctica' },
    { time: '84', type: 'yellow', team: 'away', player: 'Busquets', description: 'Protestar' },
    { time: '89', type: 'goal', team: 'home', player: 'Bellingham', assist: 'Vinicius Jr.', description: 'Contraataque' },
    { time: '90+3', type: 'yellow', team: 'home', player: 'Mendy', description: 'Pérdida de tiempo' }
  ]
};

const { width: screenWidth } = Dimensions.get('window');

// Componente para el campo de fútbol con las alineaciones
function FootballField({ homeTeam, awayTeam }) {
  const fieldWidth = screenWidth - 32;
  const fieldHeight = fieldWidth * 1.5; // Reduced from 1.8 for better proportions
  const playerSize = 25; // Reduced from 30 for better scaling
  
  // Función para crear líneas de formación
  const renderFormationLines = (players, isHome) => {
    // Agrupar jugadores por posición general (defensa, mediocampo, delantero)
    const defenders = players.filter(p => p.position.includes('D') || p.position.includes('LI') || p.position.includes('LD'));
    const midfielders = players.filter(p => p.position.includes('M'));
    const forwards = players.filter(p => p.position.includes('E') || p.position === 'DC');
    const goalkeeper = players.find(p => p.position === 'POR');
    
    // Crear líneas para visualizar la formación
    return (
      <>
        {/* Línea de portero */}
        {goalkeeper && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.90 : fieldHeight * 0.10}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.90 : fieldHeight * 0.10}
            stroke={isHome ? "#00ff8755" : "#ff4d4d55"}
            strokeWidth="1"
            strokeDasharray="5,3"
          />
        )}
        
        {/* Línea de defensa */}
        {defenders.length > 0 && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.75 : fieldHeight * 0.25}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.75 : fieldHeight * 0.25}
            stroke={isHome ? "#00ff8755" : "#ff4d4d55"}
            strokeWidth="1"
            strokeDasharray="5,3"
          />
        )}
        
        {/* Línea de mediocampo */}
        {midfielders.length > 0 && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.60 : fieldHeight * 0.40}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.60 : fieldHeight * 0.40}
            stroke={isHome ? "#00ff8755" : "#ff4d4d55"}
            strokeWidth="1"
            strokeDasharray="5,3"
          />
        )}
        
        {/* Línea de delantera - la misma para ambos equipos en el centro */}
        {forwards.length > 0 && (
          <Line
            x1={fieldWidth * 0.05}
            y1={isHome ? fieldHeight * 0.50 : fieldHeight * 0.50}
            x2={fieldWidth * 0.95}
            y2={isHome ? fieldHeight * 0.50 : fieldHeight * 0.50}
            stroke={isHome ? "#00ff8755" : "#ff4d4d55"}
            strokeWidth="1"
            strokeDasharray="5,3"
          />
        )}
      </>
    );
  };

  // Función para calcular posiciones de jugadores según su rol
  const calculatePlayerPositions = (players, isHome) => {
    // Agrupar jugadores por posición
    const goalkeeper = players.find(p => p.position === 'POR');
    const defenders = players.filter(p => p.position.includes('D') || p.position.includes('LI') || p.position.includes('LD'));
    const midfielders = players.filter(p => p.position.includes('M'));
    const forwards = players.filter(p => p.position.includes('E') || p.position === 'DC');
    
    // Actualizar posición del portero
    if (goalkeeper) {
      goalkeeper.x = 50; // Centrado horizontalmente
      goalkeeper.y = isHome ? 90 : 10; // Posición vertical según equipo
    }
    
    // Distribuir defensas uniformemente
    defenders.forEach((player, index) => {
      const totalPlayers = defenders.length;
      // Calcular posición horizontal (distribuidos uniformemente entre 20% y 80%)
      player.x = 20 + (60 / (totalPlayers + 1)) * (index + 1);
      // Posición vertical según equipo
      player.y = isHome ? 75 : 25;
    });
    
    // Distribuir centrocampistas uniformemente
    midfielders.forEach((player, index) => {
      const totalPlayers = midfielders.length;
      // Calcular posición horizontal (distribuidos uniformemente entre 20% y 80%)
      player.x = 20 + (60 / (totalPlayers + 1)) * (index + 1);
      // Posición vertical según equipo
      player.y = isHome ? 60 : 40;
    });
    
    // Distribuir delanteros uniformemente
    forwards.forEach((player, index) => {
      const totalPlayers = forwards.length;
      // Calcular posición horizontal (distribuidos uniformemente entre 20% y 80%)
      player.x = 20 + (60 / (totalPlayers + 1)) * (index + 1);
      // Posición vertical - ambos equipos en el centro
      player.y = 50;
    });
    
    return players;
  };

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
          width: playerSize, 
          height: playerSize, 
          borderColor: isHome ? '#00ff87' : '#ff4d4d',
          backgroundColor: isHome ? '#00ff8722' : '#ff4d4d22' 
        }
      ]}>
        <Text style={styles.playerNumberText}>{player.number}</Text>
      </View>
      <Text style={[
        styles.playerName,
        {
          backgroundColor: isHome ? '#00ff8766' : '#ff4d4d66',
        }
      ]}>
        {player.name}
      </Text>
      <Text style={styles.playerPosition}>{player.position}</Text>
    </View>
  );

  return (
    <View style={[styles.field, { width: fieldWidth, height: fieldHeight }]}>
      <TouchableOpacity>
      <Svg width={fieldWidth} height={fieldHeight}>
        {/* Field outline */}
        <Rect
          x="0"
          y="0"
          width={fieldWidth}
          height={fieldHeight}
          fill="#1a4728"
          stroke="#fff"
          strokeWidth="2"
        />
        
        {/* Field stripes pattern */}
        {[...Array(15)].map((_, i) => (
          <Rect
            key={`stripe-${i}`}
            x="0"
            y={i * (fieldHeight / 15)}
            width={fieldWidth}
            height={fieldHeight / 30}
            fill="#19421f"
            opacity={0.7}
          />
        ))}
        
        {/* Center line */}
        <Line
          x1="0"
          y1={fieldHeight / 2}
          x2={fieldWidth}
          y2={fieldHeight / 2}
          stroke="#fff"
          strokeWidth="2"
        />
        
        {/* Center circle */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight / 2}
          r={fieldWidth / 5}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Center spot */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight / 2}
          r={4}
          fill="#fff"
        />
        
        {/* Penalty areas */}
        <Rect
          x={fieldWidth * 0.25}
          y="0"
          width={fieldWidth * 0.5}
          height={fieldHeight * 0.15}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <Rect
          x={fieldWidth * 0.25}
          y={fieldHeight * 0.85}
          width={fieldWidth * 0.5}
          height={fieldHeight * 0.15}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Goal boxes */}
        <Rect
          x={fieldWidth * 0.35}
          y="0"
          width={fieldWidth * 0.3}
          height={fieldHeight * 0.06}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <Rect
          x={fieldWidth * 0.35}
          y={fieldHeight * 0.94}
          width={fieldWidth * 0.3}
          height={fieldHeight * 0.06}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Penalty spots */}
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight * 0.15}
          r={3}
          fill="#fff"
        />
        <Circle
          cx={fieldWidth / 2}
          cy={fieldHeight * 0.85}
          r={3}
          fill="#fff"
        />
        
        {/* Corner arcs */}
        <Circle
          cx={0}
          cy={0}
          r={10}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx={fieldWidth}
          cy={0}
          r={10}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx={0}
          cy={fieldHeight}
          r={10}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx={fieldWidth}
          cy={fieldHeight}
          r={10}
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Formation lines */}
        {renderFormationLines(homeTeam.players, true)}
        {renderFormationLines(awayTeam.players, false)}
      </Svg>
      
      {/* Players */}
      {homeTeam.players.map(player => renderPlayer(player, true))}
      {awayTeam.players.map(player => renderPlayer(player, false))}
    </TouchableOpacity>
    </View>
  );
}

export default function MatchDetailScreen() {
    const match = MATCH_DATA;
  const [activeTab, setActiveTab] = useState('alineaciones');
  // Hook para el sub-tab de alineaciones
  const [activeSubTab, setActiveSubTab] = useState('campo');
  // State para la vista de equipo en la lista de jugadores
  const [teamView, setTeamView] = useState('home');

  const statsData = [
    { x: 'Posesión', home: match.stats.possession.home, away: match.stats.possession.away },
    { x: 'Tiros', home: match.stats.shots.home, away: match.stats.shots.away },
    { x: 'A Puerta', home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away },
    { x: 'Córners', home: match.stats.corners.home, away: match.stats.corners.away },
    { x: 'Pases', home: match.stats.passes.home, away: match.stats.passes.away },
  ];

  // Traducción para estadísticas detalladas
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
        // Crea un nuevo conjunto de datos más completo
        const keyStats = [
          { 
            title: 'Posesión', 
            home: match.stats.possession.home, 
            away: match.stats.possession.away,
            unit: '%',
            icon: '⚽' 
          },
          { 
            title: 'Tiros', 
            home: match.stats.shots.home, 
            away: match.stats.shots.away,
            unit: 'tiros',
            icon: '🎯' 
          },
          { 
            title: 'Tiros a Puerta', 
            home: match.stats.shotsOnTarget.home, 
            away: match.stats.shotsOnTarget.away,
            unit: 'tiros',
            icon: '🥅' 
          },
          { 
            title: 'Precisión de Pases', 
            home: match.stats.passAccuracy.home, 
            away: match.stats.passAccuracy.away,
            unit: '%',
            icon: '🦶' 
          }
        ];
        
        // Función para renderizar barras de progreso
        const renderProgressBar = (stat) => {
          const total = stat.home + stat.away;
          const homePercent = total === 0 ? 50 : (stat.home / total) * 100;
          
          return (
            <View style={styles.progressBarContainer} key={stat.title}>
              <View style={styles.progressBarLabels}>
                <Text style={styles.progressBarValue}>{stat.home}{stat.unit}</Text>
                <Text style={styles.progressBarTitle}>{stat.icon} {stat.title}</Text>
                <Text style={styles.progressBarValue}>{stat.away}{stat.unit}</Text>
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
                    { width: `${100 - homePercent}%` }
                  ]} 
                />
              </View>
            </View>
          );
        };
        
        return (
          <View style={styles.tabContent}>
            {/* Estadísticas clave con barras de progreso */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Estadísticas Clave</Text>
              <View style={styles.statsContainer}>
                {keyStats.map(renderProgressBar)}
              </View>
            </View>
            
            {/* Gráfico de barras */}
            <View style={styles.statsSection}>
              <Text style={styles.statsSectionTitle}>Comparación de Estadísticas</Text>
              <View style={styles.statsContainer}>
                <VictoryChart
                  height={300}
                  padding={{ top: 40, bottom: 60, left: 40, right: 40 }}
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
                  />
                  <VictoryGroup offset={20}>
                    <VictoryBar
                      data={statsData}
                      y="home"
                      style={{ data: { fill: '#00ff87' } }}
                    />
                    <VictoryBar
                      data={statsData}
                      y="away"
                      style={{ data: { fill: '#ff4d4d' } }}
                    />
                  </VictoryGroup>
                  <VictoryAxis
                    style={{
                      axis: { stroke: '#333' },
                      tickLabels: { fill: '#888', fontSize: 12, angle: -45 }
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    style={{
                      axis: { stroke: '#333' },
                      tickLabels: { fill: '#888', fontSize: 12 }
                    }}
                  />
                </VictoryChart>
              </View>
            </View>
          </View>
        );
      case 'detalles':
        // Agrupar estadísticas por categorías
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
        
        // Añadir algunos datos adicionales de interés
        const matchInfo = [
          { label: "Fecha", value: "11 de Marzo, 2025" },
          { label: "Competición", value: match.league },
          { label: "Estadio", value: "Santiago Bernabéu" },
          { label: "Asistencia", value: "78,435 espectadores" },
          { label: "Árbitro", value: "Mateu Lahoz" },
        ];
        
        // Renderizar una categoría de estadísticas
        const renderStatCategory = (category) => (
          <View key={category.title} style={styles.statCategoryContainer}>
            <View style={styles.statCategoryHeader}>
              <Text style={styles.statCategoryIcon}>{category.icon}</Text>
              <Text style={styles.statCategoryTitle}>{category.title}</Text>
            </View>
            <View style={styles.detailedStats}>
              {category.stats.map(stat => {
                const value = match.stats[stat.key];
                if (!value) return null;
                
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
              {statCategories.map(renderStatCategory)}
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
    <View style={styles.container}>
      {/* Match Header - siempre visible */}
      <View style={styles.header}>
        <View style={styles.team}>
          <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.homeTeam.name}</Text>
        </View>
        
        <View style={styles.score}>
          <Text style={styles.scoreText}>
            {match.homeTeam.score} - {match.awayTeam.score}
          </Text>
        </View>
        
        <View style={styles.team}>
          <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
          <Text style={styles.teamName}>{match.awayTeam.name}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  score: {
    paddingHorizontal: 20,
  },
  scoreText: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 50,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#00ff87',
  },
  tabButtonText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  activeTabButtonText: {
    color: '#fff',
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
  },
  progressBarAway: {
    backgroundColor: '#ff4d4d',
    height: '100%',
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