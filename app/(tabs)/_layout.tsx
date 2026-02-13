import { Tabs } from 'expo-router';
import { Home, LayoutList, Torus, } from 'lucide-react-native';
import { useUniwind } from 'uniwind';

export default function TabLayout() {
  const headerColor = useUniwind().theme === 'dark' ? '#000' : '#305CDE';
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: useUniwind().theme === 'dark' ? '#000000' : '#305CDE' },
      tabBarActiveTintColor: 'yellow',
      tabBarInactiveTintColor: 'white',
    }}>
      <Tabs.Screen name="index" options={{
        title: 'Home', tabBarIcon: ({ color, size }) => (
          <Home color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="pokemonListScreen" options={{
        title: 'pokemon list', tabBarIcon: ({ color, size }) => (
          <LayoutList color={color} size={size} />
        ),
      }} />
      <Tabs.Screen name="pokedexScreen" options={{
        title: 'pokedex', tabBarIcon: ({ color, size }) => (
          <Torus color={color} size={size} />
        ),
      }} />
    </Tabs>
  );
}
