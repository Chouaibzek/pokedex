import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Text } from '@/components/ui/text'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
}

export default function PokemonDetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const drag = Gesture.Pan().onChange(event => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));


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


        setPokemon(pokemonData);
      } catch (error) {
        console.log('Erreur Axios:', error);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchPokemon();
    }
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
      <Stack.Screen options={{ title: pokemon.name.toUpperCase() }} />
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