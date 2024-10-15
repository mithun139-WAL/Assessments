import { StyleSheet, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "@/constants/Colors";

const signUpScreen = () => {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const [userExists, setUserExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userJSON = await Promise.race([
          AsyncStorage.getItem("@user"),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
          ),
        ]);

        if (userJSON) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        Alert.alert("Error", "Failed to check user data. Please try again.");
        setUserExists(false);
      }
    };

    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (userExists) {
      router.replace("/(tabs)");
    } else {
      router.push("/signupscreen");
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: headerHeight }]}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>Fitness Track</ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title="Get Started"
          onPress={handleGetStarted}
          iconPosition="left"
          iconColor="#28a745"
          iconSize={28}
          buttonStyle={{
            marginVertical: 20,
            borderWidth: 1,
            borderColor: Colors.blue,
            backgroundColor: "none",
          }}
          textStyle={{ fontSize: 14 }}
          iconStyle={{ marginRight: 10 }}
          disabled={false}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default signUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: { alignItems: "center", justifyContent: "center", flex: 1 },
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    letterSpacing: 10,
    paddingVertical: 40,
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: 50,
  },
  text: {
    marginVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
