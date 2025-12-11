import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Svg, Rect, Line, Circle, Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// -- 1) Parsear formaciones, ej: "4-2-3-1" => [4,2,3,1]
function parseFormation(formationString) {
  if (!formationString) return [4,4,2]; // fallback
  return formationString.split('-').map(num => parseInt(num, 10));
}

// -- 2) Asignar jugadores de campo a cada línea, según la formación
function assignPlayersToLines(players, formationArray) {
  const gk = players.find(p => p.position === 'POR');
  const outfield = players.filter(p => p.position !== 'POR');

  let index = 0;
  const lines = formationArray.map(count => {
    const linePlayers = outfield.slice(index, index + count);
    index += count;
    return linePlayers;
  });

  return { gk, lines };
}

// -- 3) Función para distribuir n jugadores horizontalmente (sin márgenes)
function distributeX(count, totalWidth) {
  if (count <= 1) return [totalWidth / 2];
  const spacing = totalWidth / (count + 1);
  const positions = [];
  for (let i = 1; i <= count; i++) {
    positions.push(spacing * i);
  }
  return positions;
}

// -- 4) Posicionar las líneas en un rango vertical, p.ej. 10% -> 45% (local)
function positionLines(lines, startY, endY, fieldWidth, fieldHeight) {
  const totalLines = lines.length;
  if (totalLines === 0) return;

  const step = (endY - startY) / (totalLines - 1 || 1);

  lines.forEach((linePlayers, lineIndex) => {
    const yPercent = startY + lineIndex * step;
    const xPositions = distributeX(linePlayers.length, fieldWidth);

    linePlayers.forEach((p, i) => {
      p.x = xPositions[i];
      p.yPercent = yPercent;
    });
  });
}

// -- 5) Posicionar al portero en una Y% fija, centrado en X
function positionGoalkeeper(gk, yPercent, fieldWidth) {
  if (!gk) return;
  gk.x = fieldWidth / 2;
  gk.yPercent = yPercent;
}

export default function LineupDisplay({ homeTeam, awayTeam }) {
  // Ajustar si quieres menos/más margen
  const fieldWidth = screenWidth - 32;
  const fieldHeight = fieldWidth * 2.1;

  // Parsear formaciones
  const homeFormationArr = parseFormation(homeTeam.formation);
  const awayFormationArr = parseFormation(awayTeam.formation);

  // Asignar jugadores a líneas
  const { gk: homeGK, lines: homeLines } = assignPlayersToLines(homeTeam.players, homeFormationArr);
  const { gk: awayGK, lines: awayLines } = assignPlayersToLines(awayTeam.players, awayFormationArr);

  // Posicionar porteros
  positionGoalkeeper(homeGK, 5, fieldWidth);   // y=5% para el local
  positionGoalkeeper(awayGK, 95, fieldWidth);  // y=95% para el visitante

  // Posicionar las líneas del local (10% -> 45%)
  positionLines(homeLines, 15, 45, fieldWidth, fieldHeight);
  // Posicionar las líneas del visitante (90% -> 55%)
  positionLines(awayLines, 90, 55, fieldWidth, fieldHeight);

  // -- 6) Render de cada jugador con imagen, nombre debajo, rating al costado
  const playerSize = 50;
  function renderPlayer(player, isHome) {
    if (!player) return null;
    const top = (player.yPercent / 100) * fieldHeight;
    const left = player.x;

    return (
      <View
        key={`${isHome ? 'home' : 'away'}-${player.id}`} // Evitar keys duplicadas
        style={[
          styles.playerContainer,
          {
            left: left - playerSize / 2,
            top: top - playerSize / 2,
            width: playerSize,
            height: playerSize,
          },
        ]}
      >
        {/* Contenedor circular para la foto */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: player.imageUrl }}
            style={styles.playerImage}
            resizeMode="cover"
          />
          {/* Rating en un recuadro al costado derecho (a mitad de altura) */}
          {player.rating != null && (
            <View style={[styles.ratingContainer, { backgroundColor: isHome ? '#00ff8744' : '#ff4d4d44' }]}>
              <Text style={styles.ratingText}>
                {player.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        {/* Nombre debajo */}
        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>
      </View>
    );
  }

  const topArc = (() => {
    const centerX = fieldWidth / 2;
    const centerY = fieldHeight / 6; // Punto de penalti superior
    const arcRadius = fieldWidth / 10; // Radio ajustable
    // Usamos 30° a 150° (en radianes: π/6 a 5π/6)
    const startAngle = Math.PI / 230;      // 30°
    const endAngle = (5 * Math.PI) / 5;    // 150°
    const startX = centerX + arcRadius * Math.cos(startAngle);
    const startY = centerY + arcRadius * Math.sin(startAngle);
    const endX = centerX + arcRadius * Math.cos(endAngle);
    const endY = centerY + arcRadius * Math.sin(endAngle);
    const path = `M${startX},${startY} A${arcRadius},${arcRadius} 0 0,1 ${endX},${endY}`;
    return <Path d={path} stroke="#fff" strokeWidth={2} fill="none" />;
  })();

  // Para el lado inferior (visitante):
  const bottomArc = (() => {
    const centerX = fieldWidth / 2;
    const centerY = fieldHeight - fieldHeight / 6; // Punto de penalti inferior
    const arcRadius = fieldWidth / 10; // Radio ajustable
    const startAngle = (7 * Math.PI) / 6;   // 210°
    const endAngle = (11 * Math.PI) / 6;    // 330°
    const startX = centerX + arcRadius * Math.cos(startAngle);
    const startY = centerY + arcRadius * Math.sin(startAngle);
    const endX = centerX + arcRadius * Math.cos(endAngle);
    const endY = centerY + arcRadius * Math.sin(endAngle);
    const path = `M${startX},${startY} A${arcRadius},${arcRadius} 0 0,1 ${endX},${endY}`;
    return <Path d={path} stroke="#fff" strokeWidth={2} fill="none" />;
  })();
  

  // Path corners con arcos
  const cornersPath = `
    M10,0 A10,10 0 0,1 0,10
    M${fieldWidth - 10},0 A10,10 0 0,0 ${fieldWidth},10
    M0,${fieldHeight - 10} A10,10 0 0,0 10,${fieldHeight}
    M${fieldWidth - 10},${fieldHeight} A10,10 0 0,1 ${fieldWidth},${fieldHeight - 10}
  `;

  return (
    <View style={styles.container}>
      {/* Marcador (ejemplo) */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          {homeTeam.name} {homeTeam.score || 0} - {awayTeam.score || 0} {awayTeam.name}
        </Text>
      </View>

      {/* Campo */}
      <View style={[styles.field, { width: fieldWidth, height: fieldHeight }]}>
        <Svg style={{ width: '100%', height: '100%' }}>
          {/* Fondo oscuro */}
          <Rect
            x={0}
            y={0}
            width={fieldWidth}
            height={fieldHeight}
            fill="#000"
            stroke="#fff"
            strokeWidth={2}
          />
          {/* Líneas de corte */}
          <Path
            d={`
              M0,${fieldHeight / 6} h${fieldWidth}
              M0,${(fieldHeight / 6) * 2} h${fieldWidth}
              M0,${(fieldHeight / 6) * 3} h${fieldWidth}
              M0,${(fieldHeight / 6) * 4} h${fieldWidth}
              M0,${(fieldHeight / 6) * 5} h${fieldWidth}
            `}
            stroke="#333"
            strokeWidth={1}
          />

          {/* Línea central */}
          <Line
            x1={0}
            y1={fieldHeight / 2}
            x2={fieldWidth}
            y2={fieldHeight / 2}
            stroke="#fff"
            strokeWidth={2}
          />

          {/* Círculo central */}
          <Circle
            cx={fieldWidth / 2}
            cy={fieldHeight / 2}
            r={fieldWidth / 5}
            stroke="#fff"
            strokeWidth={2}
            fill="none"
          />
          <Circle
            cx={fieldWidth / 2}
            cy={fieldHeight / 2}
            r={4}
            fill="#fff"
          />

          {/* Áreas */}
          <Rect
            x={fieldWidth / 6}
            y={0}
            width={(fieldWidth / 3) * 2}
            height={fieldHeight / 6}
            stroke="#fff"
            strokeWidth={2}
            fill="none"
          />
          <Rect
            x={fieldWidth / 3}
            y={0}
            width={fieldWidth / 3}
            height={fieldHeight / 12}
            stroke="#fff"
            strokeWidth={2}
            fill="none"
          />
          <Rect
            x={fieldWidth / 6}
            y={fieldHeight - fieldHeight / 6}
            width={(fieldWidth / 3) * 2}
            height={fieldHeight / 6}
            stroke="#fff"
            strokeWidth={2}
            fill="none"
          />
          <Rect
            x={fieldWidth / 3}
            y={fieldHeight - fieldHeight / 12}
            width={fieldWidth / 3}
            height={fieldHeight / 12}
            stroke="#fff"
            strokeWidth={2}
            fill="none"
          />

          {/* Puntos de penalti */}
          <Circle cx={fieldWidth / 2} cy={fieldHeight / 6} r={4} fill="#fff" />
          <Circle
            cx={fieldWidth / 2}
            cy={fieldHeight - fieldHeight / 6}
            r={4}
            fill="#fff"
          />

          {/* Corners */}
          <Path
            d={cornersPath}
            stroke="#fff"
            strokeWidth={2}
            fill="none"
          />

            {/* Penalty arcs */}
            {topArc}
          {bottomArc}
        </Svg>

        {/* Jugadores local */}
        {homeGK && renderPlayer(homeGK, true)}
        {homeLines.map(line => line.map(p => renderPlayer(p, true)))}

        {/* Jugadores visitante */}
        {awayGK && renderPlayer(awayGK, false)}
        {awayLines.map(line => line.map(p => renderPlayer(p, false)))}
      </View>

      {/* Formaciones (opcional) */}
      <View style={styles.formationContainer}>
        <Text style={styles.formationText}>
          {homeTeam.formation} - {awayTeam.formation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    marginBottom: 8,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  field: {
    position: 'relative',
  },
  formationContainer: {
    marginTop: 8,
  },
  formationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // -- Estilos para el jugador
  playerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#555',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: -22, // para que aparezca “al costado” derecho
    top: '50%',
    transform: [{ translateY: -10 }],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerName: {
    marginTop: 4,
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    maxWidth: 60,
    textAlign: 'center',
  },
});
