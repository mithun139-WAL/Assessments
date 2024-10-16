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
import { BookmarkProvider } from "@/context/BookmarkContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { TrackingProvider } from "@/context/TrackingContext";

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
      <WorkoutProvider>
        <TrackingProvider>
          <BookmarkProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack initialRouteName="index">
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="signupscreen"
                  options={{
                    headerTitle: "SignUp",
                  }}
                />
                <Stack.Screen
                  name="loginscreen"
                  options={{
                    headerTitle: "Login",
                  }}
                />
                <Stack.Screen
                  name="welcomescreen"
                  options={{ headerShown: false, headerTitle: "" }}
                />
                <Stack.Screen
                  name="WorkOutList"
                  options={{
                    headerTransparent: true,
                    headerTitle: "",
                    headerTintColor: Colors.white,
                  }}
                />
                <Stack.Screen
                  name="customworkout"
                  options={{
                    headerTitle: "Add Workout",
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
                <Stack.Screen
                  name="ProgressPhotos"
                  options={{
                    headerTitle: "Gallery",
                  }}
                />
                <Stack.Screen
                  name="PhotoDisplay"
                  options={{
                    headerTitle: "",
                    headerTransparent: true,
                  }}
                />
              </Stack>
            </ThemeProvider>
          </BookmarkProvider>
        </TrackingProvider>
      </WorkoutProvider>
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
