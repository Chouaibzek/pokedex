import { View, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Star } from 'lucide-react-native';
import { Switch } from '@/components/ui/switch';
import { useValue } from '@legendapp/state/react';

import {
  allPokemon,
  favorite,
  showFavoritesOnly,
  fetchAllPokemon,
  restoreState,
  enablePersistence,
  toggleFavorite,
} from '@/stores/pokemon';

const SCREEN_OPTIONS = {
  title: 'Pokemon list',
};

export default function PokemonListScreen() {
  const list = useValue(allPokemon);
  const fav = useValue(favorite);
  const showFav = useValue(showFavoritesOnly);

  useEffect(() => {
    fetchAllPokemon();
    restoreState();
    enablePersistence();
  }, []);

  const displayedList = showFav
    ? list.filter(pokemon => fav[pokemon.name])
    : list;

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-background p-4">
        <Switch
          checked={showFav}
          onCheckedChange={(checked) => showFavoritesOnly.set(checked)}
          className="mb-4 self-center"
        >
          <Text>
            {showFav ? 'Afficher tous les Pokémon' : 'Afficher les favoris'}
          </Text>
        </Switch>

        <ScrollView>
          {displayedList.map((pokemon) => (
            <View key={pokemon.name} className="flex-row self-center mb-2">
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
                <Star
                  color={fav[pokemon.name] ? 'yellow' : 'gray'}
                  size={18}
                />
              </Button>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
