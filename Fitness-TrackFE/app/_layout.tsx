import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StyleSheet } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "../constants/Colors";
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="signUpScreen">
          <Stack.Screen name="signUpScreen" options={{ headerShown: false }} />
          <Stack.Screen
            name="getStarted"
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#28a745",
              },
              headerTitle: "CREATE ACCOUNT",
            }}
          />
          <Stack.Screen
            name="loginScreen"
            options={{
              headerShown: true,
              headerStyle: {
                backgroundColor: "#28a745",
              },
              headerTitle: "LOGIN",
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              headerTransparent: true,
              headerTitle: "",
            }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    padding: 0,
  },
  headerTitle: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: "600",
    fontVariant: ["small-caps"],
  },
  headerRight: {
    marginLeft: 20,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
