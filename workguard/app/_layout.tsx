import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDB } from '../src/db/db';

export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
