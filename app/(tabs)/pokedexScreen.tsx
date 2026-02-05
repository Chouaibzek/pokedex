import { Text, View, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useValue } from "@legendapp/state/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {allPokemon, pokedex, restoreState, enablePersistence, tryCatch} from "@/stores/pokemon";
import { useUniwind } from "uniwind";

type FormValues = {
    pokeball: string;
    region : string;
};

type Pokemon = {
    name: string;
};

export default function FormScreen() {
    const apiList = useValue(allPokemon);
    const captured = useValue(pokedex);
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const { theme } = useUniwind();

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
        if (apiList.length > 0) {
            pickRandomPokemon();
        }
    }, [apiList]);

    const pickRandomPokemon = () => {
        const random = apiList[Math.floor(Math.random() * apiList.length)];
        setRandomPokemon(random);
    };

    const onSubmit = ({ pokeball, region }: FormValues) => {
        if (!randomPokemon) return;

        if (captured.length >= 15) {
            alert("votre pokedex est plein")
            return;
        }

        const alreadyCaptured = pokedex
            .get()
            .some(p => p.name === randomPokemon.name);

        if (alreadyCaptured) {
            alert("Ce Pokémon est déjà dans ta Pokédex !");
            pickRandomPokemon();
            reset();
            return;
        }

        const success = tryCatch(pokeball);

        if (!success) {
            alert("Le Pokémon s'est échappé !");
            pickRandomPokemon();
            reset();
            return;
        }

        pokedex.set(prev => [...prev, {...randomPokemon, captureDate: dateString, location: region} ]);

        pickRandomPokemon();
        reset();
    };

    const deletePokemon = (name: string) => {
        pokedex.set(prev => prev.filter(p => p.name !== name));
    };

    return (
        <ScrollView className="flex-col">
            <Text
                className={`self-center text-xl mt-4 ${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
            >
                Capture your Pokémon
            </Text>

            <Text className={`self-center mt-6 text-lg ${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                Pokemon : {randomPokemon ? randomPokemon.name : "Chargement..."}
            </Text>
            <View className="flex-col">
                <Controller
                control={control}
                name="pokeball"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <View className="border-1 m-3 bg-white">
                        <Picker selectedValue={value} onValueChange={onChange} className={`${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                            <Picker.Item label="Choisir une Pokéball" value="" />
                            <Picker.Item label="Pokéball" value="pokeball" />
                            <Picker.Item label="Superball" value="superball" />
                            <Picker.Item label="Hyperball" value="hyperball" />
                            <Picker.Item label="Masterball" value="masterball" />
                        </Picker>
                    </View>
                )}
            />

            {errors.pokeball && (
                <Text className="self-center">
                    Veuillez choisir une Pokéball
                </Text>
            )}

            <Controller
                control={control}
                name="region"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                    <View className="border-1 m-3 bg-white">
                        <Picker selectedValue={value} onValueChange={onChange} className={`${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                            <Picker.Item label="Choisir une region" value="" />
                            <Picker.Item label="Kanto" value="Kanto" />
                            <Picker.Item label="Unis" value="Unis" />
                            <Picker.Item label="Alola" value="Alola" />
                            <Picker.Item label="Galar" value="Galar" />
                        </Picker>
                    </View>
                )}
            />

            {errors.region && (
                <Text className="self-center">
                    Veuillez choisir la region ou vous avez trouver votre pokemon
                </Text>
            )}
            </View>
            
            <View className="flex-row mt-2 self-center">
                <Button variant="pokedex" onPress={() => {
                    pickRandomPokemon()
                }} className="w-35">
                    <Text className="text-white">Next</Text>
                </Button>
                <Button
                    variant="pokedex"
                    onPress={handleSubmit(onSubmit)}
                    className="w-35"
                >
                    <Text className="text-white">Capture</Text>
                </Button>

            </View>


            <Text className="self-center text-lg mt-6">
                Pokédex ({captured.length}/15)
            </Text>

            {captured.map((pokemon) => (
                <View
                    key={pokemon.name}
                    className={`flex-col self-center mt-3 p-2 border-1 w-50 ${theme === 'dark' ? 'border-white' : 'border-black'
                    }`}
                >
                    <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>name : {pokemon.name}</Text>
                    <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>{pokemon.captureDate}</Text>
                    <Text className={`${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>location : {pokemon.location}</Text>

                    <Button
                        variant="destructive"
                        onPress={() => deletePokemon(pokemon.name)}
                        className="w-25 mt-2"
                    >
                        <Text className="text-white">Delete</Text>
                    </Button>
                </View>
            ))}
        </ScrollView>
    );
}
