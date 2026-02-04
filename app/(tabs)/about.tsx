import { View, ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { router, Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Star } from 'lucide-react-native';
import { Switch } from '@/components/ui/switch'
import { observable, observe } from "@legendapp/state"
import { useValue } from "@legendapp/state/react"
import AsyncStorage from '@react-native-async-storage/async-storage'

type Pokemon = { name: string };
const listePokemon = observable<Pokemon[]>([]);
const favorite = observable<Record<string, boolean>>({});
const showFavoritesOnly = observable(false);

const STORAGE_KEYS = {
  LISTE: 'pokemon_list',
  FAVORITE: 'pokemon_favorites',
  SHOW_FAV: 'show_favorites_only',
};

async function restoreState() {
  try {
    const [listData, favData, showFavData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.LISTE),
      AsyncStorage.getItem(STORAGE_KEYS.FAVORITE),
      AsyncStorage.getItem(STORAGE_KEYS.SHOW_FAV),
    ]);

    if (listData) listePokemon.set(JSON.parse(listData));
    if (favData) favorite.set(JSON.parse(favData));
    if (showFavData) showFavoritesOnly.set(JSON.parse(showFavData));
  } catch (error) {
    console.log('Erreur restauration AsyncStorage:', error);
  }
}

function enablePersistence() {
  observe(() => AsyncStorage.setItem(STORAGE_KEYS.LISTE, JSON.stringify(listePokemon.get())));
  observe(() => AsyncStorage.setItem(STORAGE_KEYS.FAVORITE, JSON.stringify(favorite.get())));
  observe(() => AsyncStorage.setItem(STORAGE_KEYS.SHOW_FAV, JSON.stringify(showFavoritesOnly.get())));
}

const SCREEN_OPTIONS = {
  title: 'List of pokemon',
};

export default function AboutScreen() {
  const list = useValue(listePokemon)
  const fav = useValue(favorite)
  const showFav = useValue(showFavoritesOnly);

  useEffect(() => {
    restoreState();
    
    if (listePokemon.get().length === 0) {
      const fetchPokemon = async () => {
        try {
          const response = await axios.get('https://pokeapi.co/api/v2/pokemon/');
          listePokemon.set(response.data.results);
        } catch (error) {
          console.log('Erreur Axios:', error);
        }
      };
      fetchPokemon();
    }
    enablePersistence();
  }, []);

  const toggleFavorite = (name: string) => {
    favorite.set((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };
  const displayedList = showFav
    ? list.filter(p => fav[p.name])
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
          <Text>{showFav ? 'Afficher tous les Pokémon' : 'Afficher les favoris'}</Text>
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
                <Star color={fav[pokemon.name] ? 'yellow' : 'gray'} size={18} />
              </Button>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}