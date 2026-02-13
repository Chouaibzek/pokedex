import { observable, observe } from '@legendapp/state';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PhotoItem = {
  uri: string;
  date: string;
  status: 'pending' | 'synced';
};


export const photosStore = observable<PhotoItem[]>([]);


const STORAGE_KEY = 'photos-store';


export async function restorePhotos() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as PhotoItem[];
      photosStore.set(parsed);
    }
  } catch (e) {
    console.error('Erreur restauration AsyncStorage photos:', e);
  }
}


observe(() => {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photosStore.get())).catch((e) =>
    console.error('Erreur sauvegarde AsyncStorage photos:', e)
  );
});


export function addPhoto(uri: string) {
  photosStore.set((prev) => [
    ...prev,
    { uri, date: new Date().toISOString(), status: 'pending' },
  ]);
}


export function markPhotoSynced(uri: string) {
  photosStore.set((prev) =>
    prev.map((p) => (p.uri === uri ? { ...p, status: 'synced' } : p))
  );
}


export function removePhoto(uri: string) {
  photosStore.set((prev) => prev.filter((p) => p.uri !== uri));
}
