import { useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {addPhoto } from '@/stores/PhotosContext';
import * as MediaLibrary from 'expo-media-library';
import { observable } from '@legendapp/state';
import { useValue } from '@legendapp/state/react';
import { PhotoItem } from '@/stores/PhotosContext';

export type CameraStep = 'camera' | 'preview';
export const photoUri = observable<string>('');
export function useCameraService() {
  const [permission, requestPermission] = useCameraPermissions();
  
  const [step, setStep] = useState<CameraStep>('camera');
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const photoObs = useValue(photoUri)

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) {
      Alert.alert("Camera", "La caméra n'est pas encore prête");
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        Alert.alert("Erreur", "Photo invalide");
        return;
      }
      photoUri.set(photo.uri)
      setStep('preview');
    } catch (error) {
      console.error('Erreur prise photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo.');
    }
    console.log("PHOTO URI =", photoObs)

  };

  const validatePicture = () => {
    if (!photoObs) return;

    addPhoto(photoObs);

    Alert.alert('Photo validée !', 'Votre photo a bien été enregistrée localement.');

    const savedUri = photoUri;
    setStep('camera');

    return savedUri;
  };

  const retakePicture = () => {
    photoUri.set("")
    setStep('camera');
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const savePhoto = async (uri: string, filename = 'pokemon.png') => {
      try {
        if (Platform.OS === 'web') {
          const link = document.createElement('a');
          link.href = uri;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          Alert.alert('Succès', 'Photo téléchargée');
          return;
        }
  
        // Pour iOS/Android : sauvegarder directement
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          // Demander la permission de sauvegarder
          const { status } = await MediaLibrary.requestPermissionsAsync();
          
          if (status !== 'granted') {
            Alert.alert(
              'Permission refusée', 
              'Impossible de sauvegarder la photo sans permission.'
            );
            return;
          }
  
          // Sauvegarder dans la galerie
          await MediaLibrary.createAssetAsync(uri);
          Alert.alert('Succès', 'Photo enregistrée dans la galerie');
        }
      } catch (error) {
        console.error('Erreur sauvegarde photo:', error);
        Alert.alert('Erreur', 'Impossible de sauvegarder la photo');
      }
    };
    const handleValidate = async () => {
    if (!photoUri) return;
    await savePhoto(photoObs);
    validatePicture();
  };
  const requestAllPermissions = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
  };

  return {
    permission,
    photoUri,
    step,
    facing,
    cameraRef,
    takePicture,
    retakePicture,
    toggleFacing,
    setIsCameraReady,
    requestAllPermissions,
    handleValidate
  };
}
