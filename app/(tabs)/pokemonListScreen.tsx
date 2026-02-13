import { View, ScrollView } from 'react-native';
import { Button } from '@/components/ui/button';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Star } from 'lucide-react-native';
import { Switch } from '@/components/ui/switch';
import { usePokemonListService } from '@/services/pokemonListService';

const SCREEN_OPTIONS = {
  title: 'Pokemon list',
};

export default function PokemonListScreen() {
  const {
    displayedList,
    favorites,
    showFavoritesOnly,
    handleToggleFavorite,
    handleNavigateToDetails,
    handleToggleShowFavorites,
  } = usePokemonListService();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-background p-4">
        <Switch
          checked={showFavoritesOnly}
          onCheckedChange={handleToggleShowFavorites}
          className="mb-4 self-center"
        >
          <Text>
            {showFavoritesOnly ? 'Afficher tous les Pokémon' : 'Afficher les favoris'}
          </Text>
        </Switch>

        <ScrollView>
          {displayedList.map((pokemon) => (
            <View key={pokemon.name} className="flex-row self-center mb-2">
              <Button
                onPress={() => handleNavigateToDetails(pokemon.name)}
                className="w-40 m-1"
                variant="pokedex"
              >
                <Text>{pokemon.name}</Text>
              </Button>

              <Button
                onPress={() => handleToggleFavorite(pokemon.name)}
                className="w-10 bg-transparent"
              >
                <Star
                  color={favorites[pokemon.name] ? 'yellow' : 'gray'}
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
