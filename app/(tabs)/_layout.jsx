import { Tabs } from 'expo-router';
import { Heart, Chrome as Home, Trophy } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333',
        },
        tabBarActiveTintColor: '#00ff87',
        tabBarInactiveTintColor: '#888',
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Partidos',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leagues"
        options={{
          title: 'Ligas',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}