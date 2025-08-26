import { Stack } from "expo-router";

export default function LoginLayour() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
