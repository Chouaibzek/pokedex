import { View, Image} from 'react-native';
import { CameraView } from 'expo-camera';
import { Stack } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCameraService, photoUri } from '@/services/cameraService';
import { useValue } from '@legendapp/state/react';


const SCREEN_OPTIONS = { title: 'Camera' };

export default function CameraScreen() {
  const {
    permission,
    step,
    facing,
    cameraRef,
    takePicture,
    retakePicture,
    toggleFacing,
    setIsCameraReady,
    requestAllPermissions,
    handleValidate
  } = useCameraService();

  const uri = useValue(photoUri);

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
          <Image source={{ uri: uri }} className="flex-1" resizeMode="contain" />
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