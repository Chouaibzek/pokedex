import { Tabs } from 'expo-router'; 
import { useUniwind } from 'uniwind';

export default function TabLayout() {
  const headerColor = useUniwind().theme === 'dark' ? '#000' : '#305CDE';
  return (
    <Tabs screenOptions={{
    tabBarStyle: { backgroundColor:  useUniwind().theme === 'dark' ? '#000000' : '#305CDE'},
    tabBarActiveTintColor: 'yellow',
    tabBarInactiveTintColor: 'white',
  }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="pokemonListScreen" options={{ title: 'pokemon list'}} />
      <Tabs.Screen name="pokedexScreen" options={{ title: 'pokedex'}} />
    </Tabs>
  );
}
