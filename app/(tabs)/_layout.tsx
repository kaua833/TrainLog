
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        
        tabBarStyle: {
          backgroundColor: "#111827",
          borderTopColor: "#374151",
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },

        tabBarActiveTintColor: "#60a5fa",
        tabBarInactiveTintColor: "#9ca3af",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={typeof color === "string" ? color : "#9ca3af"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="treinos"
        options={{
          title: "Treinos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="barbell-outline"
              size={size}
              color={typeof color === "string" ? color : "#9ca3af"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="time-outline"
              size={size}
              color={typeof color === "string" ? color : "#9ca3af"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
