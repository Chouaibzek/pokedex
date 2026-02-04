import { Tabs } from 'expo-router'; 
import { useUniwind } from 'uniwind';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
    tabBarStyle: { backgroundColor:  useUniwind().theme === 'dark' ? '#000000' : '#305CDE'},
    tabBarActiveTintColor: 'yellow',
    tabBarInactiveTintColor: 'white',
  }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="about" options={{ title: 'List of pokemon'}} />
    </Tabs>
  );
}
