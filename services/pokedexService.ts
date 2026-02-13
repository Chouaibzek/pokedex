import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useValue } from '@legendapp/state/react';
import { useQuery } from '@tanstack/react-query';
import { pokedex, restoreState, enablePersistence, tryCatch, fetchAllPokemon } from '@/stores/pokemon';
import { photoUri } from './cameraService';
import { router } from 'expo-router';

type FormValues = {
  pokeball: string;
  region: string;
  uri?: string
};

type Pokemon = {
  name: string;
  captureDate?: string;
  location?: string;
  uri?: string
};

export function usePokedexService() {
  const { data: apiList = [] } = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: fetchAllPokemon,
    staleTime: 1000 * 60 * 60,
  });

  const handleNavigateToDetails = (pokemonName: string) => {
    // Trouver le Pokémon dans le pokédex
    const pokemon = pokedex.get().find(p => p.name === pokemonName);

    if (pokemon?.uri) {
      // Naviguer vers la page de visualisation avec l'URI
      router.push(`../view?uri=${encodeURIComponent(pokemon.uri)}`);
    } else {
      alert('Aucune photo disponible pour ce Pokémon');
    }
  };

  const captured = useValue(pokedex);
  const [randomPokemon, setRandomPokemon] = useState<Pokemon | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    restoreState();
    enablePersistence();
  }, []);

  useEffect(() => {
    if (apiList.length > 0 && !randomPokemon) {
      pickRandomPokemon();
    }
  }, [apiList]);

  const pickRandomPokemon = () => {
    const random = apiList[Math.floor(Math.random() * apiList.length)];
    setRandomPokemon(random);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const onSubmit = ({ pokeball, region, uri }: FormValues) => {
    if (!randomPokemon) return;

    if (captured.length >= 15) {
      alert('Votre Pokédex est plein');
      return;
    }

    const alreadyCaptured = pokedex
      .get()
      .some(p => p.name === randomPokemon.name);

    if (alreadyCaptured) {
      alert('Ce Pokémon est déjà dans ta Pokédex !');
      pickRandomPokemon();
      reset();
      return;
    }

    const success = tryCatch(pokeball);

    if (!success) {
      alert('Le Pokémon s\'est échappé !');
      pickRandomPokemon();
      reset();
      return;
    }

    // ✅ CORRECTION : Récupérer l'URI au moment de la capture
    const currentUri = photoUri.get();

    const capturedPokemon = {
      ...randomPokemon,
      captureDate: getCurrentDate(),
      location: region,
      uri: currentUri || undefined // Utiliser undefined si pas de photo
    };

    pokedex.set(prev => [...prev, capturedPokemon]);

    console.log("Après capture : ", pokedex.get());
    console.log("URI capturée : ", currentUri);

    // Réinitialiser la photo après capture
    photoUri.set("");
    pickRandomPokemon();
    reset();
  };

  const deletePokemon = (name: string) => {
    pokedex.set(prev => prev.filter(p => p.name !== name));
  };

  return {
    randomPokemon,
    captured,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    pickRandomPokemon,
    deletePokemon,
    handleNavigateToDetails
  };
}