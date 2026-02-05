import { Button } from '@/components/ui/button';
import {Text} from '@/components/ui/text';
import {Stack } from 'expo-router';
import * as React from 'react';
import { Image, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

const SCREEN_OPTIONS = {
  title: 'Home',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};
export default function Screen() {
  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4 bg-background">
        <Image source={require('@/assets/images/Pokemon_Home_Logo.png')} className="w-80 h-80" resizeMode="contain" />
      </View>
    </>
  );
}

export function ThemeToggle() {
  const { theme } = useUniwind();

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    Uniwind.setTheme(newTheme);
  }

  return (
    <Button variant="pokedex" onPress={toggleTheme}>
      <Text>mode</Text>
    </Button>
  )
}
