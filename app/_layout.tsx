import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#111827",
        },
        headerTintColor: "#ffffff",
        contentStyle: {
          backgroundColor: "#111827",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "TrainLog" }}
      />

      <Stack.Screen
        name="detalhes/[id]"
        options={{
          title: "Detalhes do Treino",
        }}
      />

      <Stack.Screen
        name="editar/[id]"
        options={{
          title: "Editar Treino",
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
