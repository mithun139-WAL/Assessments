import { StyleSheet, Pressable } from "react-native";
import React from "react";
import { ThemedView } from "@/components/commonComponents/ThemedView";
import { CommonButton } from "@/components/commonComponents/CommonButton";
import { ThemedText } from "@/components/commonComponents/ThemedText";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const signUpScreen = () => {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const { signInWithGoogle, loading, error, userInfo } = useAuth();
  const handleSignIn = () => {
    router.push("/welcomescreen")
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: headerHeight }]}>
      <ThemedView
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <ThemedText style={styles.title}>Fitness Track</ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
        <CommonButton
          title="Get Started"
          onPress={handleSignIn}
          iconName="logo-google"
          iconPosition="left"
          iconColor="#28a745"
          iconSize={28}
          buttonStyle={{
            marginVertical: 20,
            borderWidth: 1,
            borderColor: "#28a745",
            backgroundColor: 'none'
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
