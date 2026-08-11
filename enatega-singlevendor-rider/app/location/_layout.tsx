// Expo
import { Stack } from 'expo-router'

export default function LoginLayour() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  )
}
