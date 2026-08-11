import { Stack } from "expo-router";

export default function WorkScheduleLayout() {
  return (
    <Stack
      screenOptions={{ headerTitle: "", headerBackButtonMenuEnabled: true }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
