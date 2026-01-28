import { Stack } from "expo-router";

export default function ReferralsListLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
