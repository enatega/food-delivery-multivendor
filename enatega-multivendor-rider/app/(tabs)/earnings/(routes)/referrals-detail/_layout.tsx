import { Stack } from "expo-router";

export default function ReferralsDetailLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
