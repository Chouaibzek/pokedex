import { useEffect } from 'react';
import { useValue } from '@legendapp/state/react';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  favorite,
  showFavoritesOnly,
  fetchAllPokemon,
  restoreState,
  enablePersistence,
  toggleFavorite,
} from '@/stores/pokemon';

export function usePokemonListService() {
  const fav = useValue(favorite);
  const showFav = useValue(showFavoritesOnly);

  const { data: list = [], isLoading, error } = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: fetchAllPokemon,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    restoreState();
    enablePersistence();
  }, []);

  const displayedList = showFav
    ? list.filter(pokemon => fav[pokemon.name])
    : list;

  const handleToggleFavorite = (pokemonName: string) => {
    toggleFavorite(pokemonName);
  };

  const handleNavigateToDetails = (pokemonName: string) => {
    router.push(`../${pokemonName}`);
  };

  const handleToggleShowFavorites = (checked: boolean) => {
    showFavoritesOnly.set(checked);
  };

  return {
    displayedList,
    favorites: fav,
    showFavoritesOnly: showFav,
    isLoading,
    error,
    handleToggleFavorite,
    handleNavigateToDetails,
    handleToggleShowFavorites,
  };
}
