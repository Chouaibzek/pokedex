import { View, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Star } from 'lucide-react-native';
import { Switch } from '@/components/ui/switch'
const SCREEN_OPTIONS = {
  title: 'List of pokemon',
};

export default function AboutScreen() {
  const [listPokemon, setListPokemon] = useState<{ name: string }[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
        setListPokemon(response.data.results);
      } catch (error) {
        console.log('Erreur Axios:', error);
      }
    };

    fetchPokemon();
  }, []);

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const displayedList = showFavoritesOnly
    ? listPokemon.filter(p => favorites[p.name])
    : listPokemon;


  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 bg-background p-4">

        <Switch
          checked={showFavoritesOnly}
          onCheckedChange={(checked) => setShowFavoritesOnly(checked)}
          className="mb-4 self-center"
        >
          <Text>{showFavoritesOnly ? 'Afficher tous les Pokémon' : 'Afficher les favoris'}</Text>
        </Switch>


        <ScrollView>
          {displayedList.map((pokemon, index) => (
            <View key={index} className="flex-row self-center mb-2">
              <Button
                onPress={() => router.push(`../${pokemon.name}`)}
                className="w-40 m-1"
                variant="pokedex"
              >
                <Text>{pokemon.name}</Text>
              </Button>

              <Button
                onPress={() => toggleFavorite(pokemon.name)}
                className="w-10 bg-transparent"
              >
                <Star color={favorites[pokemon.name] ? 'yellow' : 'gray'} size={18} />
              </Button>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}