import { View, Image, Alert, Platform } from 'react-native';
import { CameraView } from 'expo-camera';
import { Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCameraService } from '@/services/cameraService';
import * as MediaLibrary from 'expo-media-library';

const SCREEN_OPTIONS = { title: 'Camera' };

export default function CameraScreen() {
  const {
    permission,
    requestPermission,
    photoUri,
    step,
    facing,
    cameraRef,
    takePicture,
    retakePicture,
    validatePicture,
    toggleFacing,
    setIsCameraReady,
  } = useCameraService();

  const requestAllPermissions = async () => {
    if (!permission?.granted) await requestPermission();

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const media = await MediaLibrary.requestPermissionsAsync();
      if (!media.granted) {
        Alert.alert(
          'Permission manquante',
          "Accès à la galerie requis pour sauvegarder les photos."
        );
      }
    }
  };

  const savePhoto = async (uri: string, filename = 'pokemon.png') => {
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission refusée', 'Accès à la galerie requis');
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(uri);
        let album = await MediaLibrary.getAlbumAsync('Pokémon Camera');
        if (!album) {
          await MediaLibrary.createAlbumAsync('Pokémon Camera', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
        }
        Alert.alert('Succès', 'Photo enregistrée dans la galerie');
      }

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Succès', 'Photo téléchargée');
      }
    } catch (error) {
      console.error('Erreur sauvegarde photo:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder la photo');
    }
  };

  const handleValidate = async () => {
    if (!photoUri) return;
    await savePhoto(photoUri);
    validatePicture();
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text>Chargement des permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <>
        <Stack.Screen options={SCREEN_OPTIONS} />
        <View className="flex-1 items-center justify-center gap-4 bg-background p-4">
          <Text className="text-center text-lg text-white">
            L'application a besoin d'accéder à votre caméra
          </Text>
          <Button variant="destructive" onPress={requestAllPermissions}>
            <Text className="text-white">Autoriser la caméra</Text>
          </Button>
        </View>
      </>
    );
  }

  if (step === 'preview' && photoUri) {
    return (
      <>
        <Stack.Screen options={{ title: 'Aperçu' }} />
        <View className="flex-1 bg-black">
          <Image source={{ uri: photoUri }} className="flex-1" resizeMode="contain" />
          <View className="flex-row justify-center gap-4 p-6">
            <Button variant="destructive" onPress={retakePicture} className="flex-1">
              <Text className="text-white">Reprendre</Text>
            </Button>
            <Button variant="pokedex" onPress={handleValidate} className="flex-1">
              <Text className="text-white text-center">Valider</Text>
            </Button>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <CameraView
          ref={cameraRef}
          facing={facing}
          style={{ flex: 1, backgroundColor: 'black' }}
          onCameraReady={() => setIsCameraReady(true)}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 24,
            gap: 16,
          }}
        >
          <Button variant="pokedex" onPress={toggleFacing} style={{ flex: 1 }}>
            <Text className="text-white text-center">Retourner</Text>
          </Button>
          <Button variant="pokedex" onPress={takePicture} style={{ flex: 1 }}>
            <Text className="text-white text-center">Photo</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
