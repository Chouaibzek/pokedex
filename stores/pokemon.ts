import { observable, observe } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export type Pokemon = {
  name: string;
  url?: string;
  captureDate?: string;
  location?: string;
  uri?:string
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
};

export const allPokemon = observable<Pokemon[]>([]);

export const pokedex = observable<Pokemon[]>([]);

export const favorite = observable<Record<string, boolean>>({});

export const showFavoritesOnly = observable(false);


const STORAGE_KEYS = {
  POKEDEX: 'pokedex',
  FAVORITE: 'pokemon_favorites',
  SHOW_FAV: 'show_favorites_only',
};
const CATCH_RATES: Record<string, number> = {
  pokeball: 0.4,    
  superball: 0.6,    
  hyperball: 0.8,    
  masterball: 1.0,  
};


export function tryCatch(pokeball: string): boolean {
  const chance = CATCH_RATES[pokeball] ?? 0;
  return Math.random() <= chance;
}


export async function restoreState() {
  try {
    const [pokedexData, favData, showFavData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.POKEDEX),
      AsyncStorage.getItem(STORAGE_KEYS.FAVORITE),
      AsyncStorage.getItem(STORAGE_KEYS.SHOW_FAV),
    ]);

    if (pokedexData) pokedex.set(JSON.parse(pokedexData));
    if (favData) favorite.set(JSON.parse(favData));
    if (showFavData) showFavoritesOnly.set(JSON.parse(showFavData));
  } catch (error) {
    console.error('Erreur restauration AsyncStorage:', error);
  }
}


export function enablePersistence() {
  observe(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.POKEDEX,
      JSON.stringify(pokedex.get())
    );
  });

  observe(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITE,
      JSON.stringify(favorite.get())
    );
  });

  observe(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.SHOW_FAV,
      JSON.stringify(showFavoritesOnly.get())
    );
  });
}


export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const response = await axios.get(
    'https://pokeapi.co/api/v2/pokemon?limit=151'
  );
  return response.data.results;
}

export async function fetchPokemonDetails(name: string): Promise<PokemonDetail> {
  const response = await axios.get(
    `https://pokeapi.co/api/v2/pokemon/${name}`
  );
  return response.data;
}

export function toggleFavorite(name: string) {
  favorite.set(prev => ({
    ...prev,
    [name]: !prev[name],
  }));
}

export function getRandomPokemon(): Pokemon | null {
  const list = allPokemon.get();
  if (list.length === 0) return null;

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}


export function capturePokemon(pokemon: Pokemon) {
  const exists = pokedex.get().some(p => p.name === pokemon.name);

  if (exists) {
    throw new Error('Ce Pokémon est déjà dans la Pokédex');
  }

  pokedex.set(prev => [...prev, pokemon]);
}


export function removeFromPokedex(name: string) {
  pokedex.set(prev => prev.filter(p => p.name !== name));
}
