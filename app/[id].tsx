import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Image } from 'react-native';

export default function PhotoView() {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  return (
    <>
      <Stack.Screen options={{ title: 'Photo' }} />
      <View className="flex-1 bg-black justify-center items-center">
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>
    </>
  );
}
