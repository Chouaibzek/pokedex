import { Button } from '@/components/ui/button';
import {Text} from '@/components/ui/text';
import {Stack } from 'expo-router';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

const LOGO = {
  light: require('@/assets/images/Pokemon_Home_Logo.png'),
  dark: require('@/assets/images/Pokemon_Home_Logo.png'),
};

const SCREEN_OPTIONS = {
  title: 'Pokemon home',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 200,
  width: 200,
};

export default function Screen() {
  const { theme } = useUniwind();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4 bg-background">
        <Image source={LOGO[theme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
      </View>
    </>
  );
}

function ThemeToggle() {
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
