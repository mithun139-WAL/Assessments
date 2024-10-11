import { StyleSheet, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const signUpScreen = () => {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const [userExists, setUserExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const userJSON = await AsyncStorage.getItem("@user");
      if (userJSON) {
        setUserExists(true);
      } else {
        setUserExists(false);
      }
    };
    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (userExists) {
      router.navigate("/(tabs)");
    } else {
      router.navigate("/signupscreen");
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: headerHeight }]}>
      <ThemedView
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
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
            borderColor: "#28a745",
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
    borderBottomColor: "#ccc",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
