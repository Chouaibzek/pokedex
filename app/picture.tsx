import { useValue } from "@legendapp/state/react";
import { photosStore, addPhoto } from "@/stores/PhotosContext";
import { View, Image, Alert, ScrollView, Pressable } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { photoUri } from '@/services/cameraService'; // ✅ Import photoUri
import { router } from 'expo-router';

export default function PictureScreen() {
    const list = useValue(photosStore);
    const [permission, setPermission] = useState<ImagePicker.MediaLibraryPermissionResponse | null>(null);

    // Demander la permission d'accès à la galerie
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setPermission({ status } as ImagePicker.MediaLibraryPermissionResponse);
        
        if (status !== 'granted') {
            Alert.alert(
                'Permission refusée',
                'Vous devez autoriser l\'accès à la galerie pour ajouter des photos.'
            );
        }
        
        return status === 'granted';
    };

    // ✅ Ouvrir la galerie et définir comme photo active pour capture
    const pickImageForCapture = async () => {
        // Vérifier/demander la permission
        if (!permission || permission.status !== 'granted') {
            const granted = await requestPermission();
            if (!granted) return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.9,
                allowsMultipleSelection: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                
                // ✅ Définir comme photo active (comme si on avait pris une photo)
                photoUri.set(selectedImage.uri);
                
                Alert.alert(
                    'Photo sélectionnée !', 
                    'Retournez à l\'écran de capture pour l\'associer à un Pokémon.',
                    [
                        {
                            text: 'Rester ici',
                            style: 'cancel'
                        },
                        {
                            text: 'Aller capturer',
                            onPress: () => router.back()
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Erreur sélection image:', error);
            Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
        }
    };

    // ✅ Sélectionner une photo existante de la liste
    const selectExistingPhoto = (uri: string) => {
        photoUri.set(uri);
        Alert.alert(
            'Photo sélectionnée !', 
            'Retournez à l\'écran de capture pour l\'associer à un Pokémon.',
            [
                {
                    text: 'Rester ici',
                    style: 'cancel'
                },
                {
                    text: 'Aller capturer',
                    onPress: () => router.back()
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-background">
            {/* Bouton pour ajouter depuis la galerie */}
            <View className="p-4 gap-2">
                <Button variant="pokedex" onPress={pickImageForCapture}>
                    <Text className="text-white text-center">📷 Choisir une photo pour capture</Text>
                </Button>
                <Text className="text-center text-sm text-gray-500">
                    Sélectionnez une photo depuis votre galerie pour l'associer à un Pokémon
                </Text>
            </View>

            {/* Liste des photos déjà dans l'app */}
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {list.length === 0 ? (
                    <View className="flex-1 items-center justify-center p-8">
                        <Text className="text-center text-gray-500">
                            Aucune photo pour le moment.{'\n'}
                            Prenez des photos ou importez-en depuis la galerie !
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text className="text-center text-lg font-semibold mt-4 mb-2">
                            Photos de l'application
                        </Text>
                        <Text className="text-center text-sm text-gray-500 mb-4 px-4">
                            Appuyez sur une photo pour l'utiliser
                        </Text>
                        {list.map((photoItem) => (
                            <Pressable
                                key={photoItem.uri}
                                className="flex-row self-center mb-4"
                                onPress={() => selectExistingPhoto(photoItem.uri)}
                            >
                                <View className="border-2 border-gray-300 rounded-lg overflow-hidden">
                                    <Image 
                                        source={{ uri: photoItem.uri }} 
                                        className="w-80 h-80" 
                                        resizeMode="contain" 
                                    />
                                </View>
                            </Pressable>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}