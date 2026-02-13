import '@/global.css';
import { NAV_THEME } from '@/lib/theme';
import { queryClient } from '@/lib/queryClient';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';

export {
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { theme } = useUniwind();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <PortalHost />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
