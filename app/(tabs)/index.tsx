import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { format, eachDayOfInterval, addDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { useMatches } from '../../hooks/useMatches';

export default function MatchesScreen() {
  const router = useRouter();
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const { getMatchesForDate } = useMatches();
  
  // Obtener los próximos 14 días para el calendario
  const dates = eachDayOfInterval({
    start: today,
    end: addDays(today, 14),
  });
  
  // Obtener partidos para la fecha seleccionada
  const matchesForSelectedDate = getMatchesForDate(selectedDate);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Tira de Calendario */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
          {dates.map((date) => {
            const isSelected = date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
            
            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.dateItem,
                  isSelected && styles.dateItemActive,
                ]}
                onPress={() => setSelectedDate(date)}>
                <Text style={[styles.dayName, isSelected && styles.activeText]}>
                  {format(date, 'EEE', { locale: es })}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.activeText]}>
                  {format(date, 'd')}
                </Text>
                <Text style={[styles.monthName, isSelected && styles.activeText]}>
                  {format(date, 'MMM', { locale: es })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lista de Partidos */}
        <View style={styles.matchesContainer}>
          <Text style={styles.dateHeader}>
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
          </Text>
          
          {matchesForSelectedDate.length > 0 ? (
            matchesForSelectedDate.map(match => (
              <TouchableOpacity 
                key={match.id} 
                style={styles.matchCard}
                onPress={() => router.push(`/match/${match.id}`)}
              >
                <View style={styles.leagueHeader}>
                  <Text style={styles.leagueText}>{match.league}</Text>
                </View>
                
                <View style={styles.matchInfo}>
                  <View style={styles.team}>
                    <Image source={{ uri: match.homeTeam.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.homeTeam.name}</Text>
                  </View>
                  
                  <View style={styles.scoreContainer}>
                    <Text style={styles.score}>
                      {match.homeTeam.score} - {match.awayTeam.score}
                    </Text>
                    <Text style={styles.status}>{match.status}</Text>
                  </View>
                  
                  <View style={styles.team}>
                    <Image source={{ uri: match.awayTeam.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{match.awayTeam.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noMatches}>No hay partidos programados para este día</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  dateList: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
  },
  dateItem: {
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  dateItemActive: {
    backgroundColor: '#00ff87',
  },
  dayName: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textTransform: 'capitalize',
  },
  dayNumber: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 4,
    fontFamily: 'Inter_700Bold',
  },
  monthName: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textTransform: 'capitalize',
  },
  activeText: {
    color: '#000',
  },
  matchesContainer: {
    padding: 16,
  },
  dateHeader: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'capitalize',
  },
  matchCard: {
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  leagueHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leagueText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  status: {
    color: '#00ff87',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  noMatches: {
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});