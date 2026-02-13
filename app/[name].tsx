import { View} from 'react-native';
import { useEffect } from 'react';
import axios from 'axios';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Text } from '@/components/ui/text'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';


const pokemonP = observable<PokemonDetail | null> (null);
const loadingP = observable(true);

type  PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
}

export default function PokemonDetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const pokemon = useValue(pokemonP);
  const loading = useValue(loadingP)

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);

        const pokemonData: PokemonDetail = {
          id: response.data.id,
          name: response.data.name,
          height: response.data.height,
          weight: response.data.weight
        };
        
        pokemonP.set(pokemonData);
      } catch (error) {
        console.log('Erreur Axios:', error);
      } finally {
        loadingP.set(false);
      }
    };
    fetchPokemon();
  }, [name]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Progress value={33} />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Pokémon non trouvé</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: name.toUpperCase() }} />
      <View className="flex-1 justify-center items-center">
        <Badge variant="destructive">
          <Text>#{pokemon.id}</Text>
        </Badge>
        <Text>{pokemon.name}</Text>
        <Text className="text-lg">Taille: {pokemon.height / 10}m</Text>
        <Text className="text-lg">Poids: {pokemon.weight / 10}kg</Text>
      </View >
    </>
  );
}