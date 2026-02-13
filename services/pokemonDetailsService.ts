import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetails } from '@/stores/pokemon';

export function usePokemonDetailsService(pokemonName: string) {
  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', 'details', pokemonName],
    queryFn: () => fetchPokemonDetails(pokemonName),
    enabled: !!pokemonName,
    staleTime: 1000 * 60 * 60,
  });

  const getHeightInMeters = () => {
    return pokemon ? pokemon.height / 10 : 0;
  };

  const getWeightInKg = () => {
    return pokemon ? pokemon.weight / 10 : 0;
  };

  return {
    pokemon,
    isLoading,
    error,
    getHeightInMeters,
    getWeightInKg,
  };
}
