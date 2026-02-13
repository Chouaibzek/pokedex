import { Text, View, ScrollView, Image, Pressable } from "react-native";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Picker } from "@react-native-picker/picker";
import { useUniwind } from "uniwind";
import { usePokedexService } from "@/services/pokedexService";
import { router } from "expo-router";
import { useValue } from "@legendapp/state/react";
import { photoUri } from "@/services/cameraService"

export default function FormScreen() {
    const { theme } = useUniwind();
    const {
        randomPokemon,
        captured,
        control,
        errors,
        handleSubmit,
        pickRandomPokemon,
        deletePokemon,
        handleNavigateToDetails,
    } = usePokedexService();

    const uri = useValue(photoUri);
    console.log("URI FORM =", uri);


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
                <Controller
                    control={control}
                    name="uri"
                    rules={{ required: false }}
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row mt-2 self-center">
                            <Button
                                variant="pokedex"
                                onPress={() => {
                                    router.push("../camera")
                                }}
                                className="w-40"
                            >
                                <Text className="text-white">Prendre une photo</Text>
                            </Button>
                            <Button
                                variant="pokedex"
                                onPress={() => {
                                    router.push("../picture")
                                }}
                                className="w-40"
                            >
                                <Text className="text-white">Galerie</Text>
                            </Button>

                        </View>
                    )}
                />
                {uri ? (
                    <Pressable
                        className="self-center mb-4"
                        onPress={() =>
                            router.push(`../${uri}`)
                        }
                    >
                        
                        <Image
                            source={{ uri }}
                            style={{ width: 300, height: 300 }}
                            resizeMode="contain"
                        /></Pressable>
                ) : (
                    <Text className="self-center text-gray-400 mt-4">
                        Aucune photo prise
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
                    onPress={handleSubmit}
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
                    {pokemon.uri ? (
                    <Pressable
                        className="self-center mb-4"
                        onPress={() =>
                            handleNavigateToDetails(pokemon.name)
                        }
                    >
                        <Image
                            source={{uri : pokemon.uri}}
                            style={{ width: 300, height: 300 }}
                            resizeMode="contain"
                        /></Pressable>
                ) : (
                    <Text className="self-center text-gray-400 mt-4">
                        Aucune photo prise
                    </Text>
                )}

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
