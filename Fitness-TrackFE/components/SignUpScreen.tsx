import { StyleSheet, Pressable } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { CommonButton } from "@/components/CommonButton";
import { ThemedText } from "@/components/ThemedText";

const SignUpScreen = () => {
  return (
    <ThemedView style={[styles.container, { paddingTop: 50 }]}>
      <ThemedView
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <ThemedText style={styles.title}>Fitness Track</ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <CommonButton
          title="Login with Google"
          onPress={() => console.log("button pressed")}
          iconName="logo-google"
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
        <CommonButton
          title="Get Started"
          onPress={() => console.log("Pressed")}
          buttonStyle={{ backgroundColor: "#28a745", marginVertical: 20 }}
          textStyle={{ fontSize: 18 }}
          disabled={false}
        />
        <Pressable
          onPress={() => console.log("pressed")}
          style={{ alignItems: "center" }}
        >
          <ThemedText style={styles.text}>
            Already have an account? Login
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
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
